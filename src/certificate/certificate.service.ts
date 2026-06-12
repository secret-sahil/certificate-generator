import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { existsSync } from 'node:fs';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
  PDFDocument,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from 'pdf-lib/cjs';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import {
  CertificateDto,
  CreateCertificateDto,
} from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { EnvironmentVariables } from 'src/env.validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  private readonly templatesDir = resolve(
    process.cwd(),
    'public',
    'certificate_templates',
  );

  private readonly fontsDir = resolve(process.cwd(), 'public', 'fonts');

  private readonly generatedCertificatesDir = resolve(
    process.cwd(),
    'public',
    'generated_certificates',
  );

  private getVerificationUrl(certificateId: string) {
    return `https://certify.hopingminds.com/certificate/${certificateId}`;
  }

  private isUniqueConstraintError(error: unknown): error is {
    code: string;
    meta?: { target?: unknown };
  } {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string' &&
      (error as { code: string }).code === 'P2002'
    );
  }

  private async generateCertificatePdf(options: {
    name: string;
    course: string;
    issuedAt: string;
    certificateId: string;
    templateFile: string;
    grades?: string | null;
  }) {
    const templatePath = join(this.templatesDir, options.templateFile);

    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${options.templateFile}`);
    }

    const headingFontPath = join(this.fontsDir, 'heading.ttf');
    const bodyFontPath = join(this.fontsDir, 'body.ttf');

    const [templateBytes, headingFontBytes, bodyFontBytes] = await Promise.all([
      readFile(templatePath),
      readFile(headingFontPath),
      readFile(bodyFontPath),
    ]);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(
      fontkit as unknown as Parameters<typeof pdfDoc.registerFontkit>[0],
    );

    const headingFont = await pdfDoc.embedFont(headingFontBytes);
    const bodyFont = await pdfDoc.embedFont(bodyFontBytes);

    const [firstPage] = pdfDoc.getPages();
    const { width, height } = firstPage.getSize();

    const drawCenteredText = ({
      page,
      text,
      y,
      size,
      font,
      color,
    }: {
      page: PDFPage;
      text: string;
      y: number;
      size: number;
      font: PDFFont;
      color: RGB;
    }) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y,
        size,
        font,
        color,
      });
    };

    const drawText = ({
      page,
      text,
      x,
      y,
      size,
      font,
      color,
    }: {
      page: PDFPage;
      text: string;
      x: number;
      y: number;
      size: number;
      font: PDFFont;
      color: RGB;
    }) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color,
      });
    };

    // const headingColor = rgb(0.14, 0.2, 0.3);
    const bodyColor = rgb(0.1, 0.1, 0.1);

    if (options.templateFile.toLowerCase().includes('sawayam')) {
      drawCenteredText({
        page: firstPage,
        text: options.name,
        y: height * 0.59,
        size: 38,
        font: headingFont,
        color: bodyColor,
      });

      drawCenteredText({
        page: firstPage,
        text: options.course,
        y: height * 0.44,
        size: 18,
        font: bodyFont,
        color: bodyColor,
      });

      drawText({
        page: firstPage,
        text: options.issuedAt,
        x: width * 0.146,
        y: height * 0.17,
        size: 14,
        font: bodyFont,
        color: bodyColor,
      });

      drawCenteredText({
        page: firstPage,
        text: `Certificate ID: ${options.certificateId}`,
        y: height * 0.01,
        size: 12,
        font: bodyFont,
        color: rgb(0.35, 0.35, 0.35),
      });
    } else if (options.templateFile.toLocaleLowerCase().includes('anna')) {
      drawCenteredText({
        page: firstPage,
        text: options.name,
        y: height * 0.635,
        size: 38,
        font: headingFont,
        color: bodyColor,
      });

      drawCenteredText({
        page: firstPage,
        text: options.course,
        y: height * 0.422,
        size: 18,
        font: bodyFont,
        color: bodyColor,
      });

      drawText({
        page: firstPage,
        text: options.issuedAt,
        x: width * 0.146,
        y: height * 0.17,
        size: 14,
        font: bodyFont,
        color: bodyColor,
      });

      if (options.grades) {
        drawText({
          page: firstPage,
          text: options.grades,
          x: width * 0.285,
          y: height * 0.17,
          size: 14,
          font: bodyFont,
          color: bodyColor,
        });
      }

      drawCenteredText({
        page: firstPage,
        text: `Certificate ID: ${options.certificateId}`,
        y: height * 0.01,
        size: 12,
        font: bodyFont,
        color: rgb(0.35, 0.35, 0.35),
      });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(
      this.getVerificationUrl(options.certificateId),
      {
        margin: 1,
        width: 300,
      },
    );

    const qrCodeImageBytes = Buffer.from(
      qrCodeDataUrl.split(',')[1] ?? '',
      'base64',
    );
    const qrImage = await pdfDoc.embedPng(qrCodeImageBytes);

    const qrSize = 40;
    firstPage.drawImage(qrImage, {
      x: (width - qrSize - 24) * 0.045,
      y: qrSize * 0.98,
      width: qrSize,
      height: qrSize,
    });

    return Buffer.from(await pdfDoc.save());
  }

  async getCertificatePdfByCertificateId(certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
    });

    if (!certificate) {
      throw new NotFoundException(
        `Certificate not found for certificateId: ${certificateId}`,
      );
    }

    const pdfBuffer = await this.generateCertificatePdf({
      name: certificate.name,
      course: certificate.course,
      issuedAt: certificate.issuedAt.toISOString().slice(0, 10),
      certificateId: certificate.certificateId,
      templateFile: certificate.template,
      grades: certificate.grades,
    });

    return {
      certificate,
      fileName: `${certificate.certificateId}.pdf`,
      pdfBuffer,
    };
  }

  async getCertificatePublicDetailsByCertificateId(certificateId: string) {
    return this.prisma.certificate.findUnique({
      where: { certificateId },
      select: {
        certificateId: true,
        name: true,
        course: true,
        template: true,
        grades: true,
        issuedAt: true,
      },
    });
  }

  async getCertificatePreviewPngByCertificateId(certificateId: string) {
    const { pdfBuffer } =
      await this.getCertificatePdfByCertificateId(certificateId);

    const pdfjsLib =
      (await import('pdfjs-dist/legacy/build/pdf.mjs')) as unknown as {
        getDocument: (options: {
          data: Uint8Array;
          disableWorker: boolean;
        }) => {
          promise: Promise<{
            getPage: (pageNumber: number) => Promise<{
              getViewport: (options: { scale: number }) => {
                width: number;
                height: number;
              };
              render: (options: {
                canvasContext: unknown;
                viewport: { width: number; height: number };
              }) => { promise: Promise<void> };
            }>;
          }>;
        };
      };

    const canvasLib = (await import('@napi-rs/canvas')) as unknown as {
      createCanvas: (
        width: number,
        height: number,
      ) => {
        getContext: (contextId: '2d') => unknown;
        toBuffer: (mimeType: 'image/png') => Buffer;
      };
    };

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      disableWorker: true,
    }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.4 });

    const canvas = canvasLib.createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height),
    );
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    return {
      pngBuffer: canvas.toBuffer('image/png'),
      fileName: `${certificateId}.png`,
    };
  }

  async getUniqueCertificateId(): Promise<string> {
    // Generate a random alphanumeric string of length 5 and prefix it with "HM-"
    const id = `HM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const existing = await this.prisma.certificate.findUnique({
      where: { certificateId: id },
    });
    if (existing) {
      return this.getUniqueCertificateId(); // Recursively generate a new ID if collision occurs
    }
    return id;
  }

  async create(createCertificateDto: CreateCertificateDto) {
    if (
      createCertificateDto.password !== this.config.get('CERTIFICATE_PASSWORD')
    ) {
      throw new UnauthorizedException('Invalid password');
    }

    await mkdir(this.generatedCertificatesDir, { recursive: true });

    const template =
      (createCertificateDto.template || 'sawayam.pdf').trim() || 'sawayam.pdf';

    const CONCURRENCY_LIMIT = 10; // Tune based on CPU/DB pool size

    const results: Array<CertificateDto> = [];
    const skipped: Array<CertificateDto> = [];

    // Pre-generate all unique IDs in one batch to avoid sequential async calls
    const certificateIds = await Promise.all(
      createCertificateDto.certificates.map(() =>
        this.getUniqueCertificateId(),
      ),
    );

    // Process in batches to avoid overwhelming DB connection pool
    for (
      let i = 0;
      i < createCertificateDto.certificates.length;
      i += CONCURRENCY_LIMIT
    ) {
      const batch = createCertificateDto.certificates.slice(
        i,
        i + CONCURRENCY_LIMIT,
      );
      const batchIds = certificateIds.slice(i, i + CONCURRENCY_LIMIT);

      const batchResults = await Promise.allSettled(
        batch.map((cert, idx) =>
          this.processSingleCertificate({
            cert,
            certificateId: batchIds[idx],
            template,
            createCertificateDto,
          }),
        ),
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          const { type, data } = result.value;
          if (type === 'skipped') skipped.push(data);
          else results.push(data);
        } else {
          throw result.reason; // Re-throw unexpected errors
        }
      }
    }

    return {
      count: results.length,
      certificates: results,
      skippedCount: skipped.length,
      skipped,
    };
  }

  // Extracted helper — processes one cert fully in parallel
  private async processSingleCertificate({
    cert,
    certificateId,
    template,
    createCertificateDto,
  }: {
    cert: CertificateDto;
    certificateId: string;
    template: string;
    createCertificateDto: CreateCertificateDto;
  }): Promise<{
    type: 'success' | 'skipped';
    data: CertificateDto & {
      template: string;
      reason?: string;
      certificatePdfPath?: string;
      certificateId?: string;
      isEmailQueued?: boolean;
    };
  }> {
    const issuedAt = cert.issuedAt ? new Date(cert.issuedAt) : new Date();
    const certificatePdfPath = join(
      this.generatedCertificatesDir,
      `${certificateId}.pdf`,
    );

    // Run PDF generation and DB insert concurrently where possible
    const tasks: Promise<any>[] = [];

    if (!createCertificateDto.sendOnlyEmail) {
      tasks.push(
        this.generateCertificatePdf({
          name: cert.name,
          course: cert.course,
          issuedAt: issuedAt.toISOString().slice(0, 10),
          certificateId,
          templateFile: template,
          grades: cert.grades,
        }).then((pdfBuffer) => writeFile(certificatePdfPath, pdfBuffer)),
      );
    }

    if (createCertificateDto.saveToDatabase) {
      tasks.push(
        this.prisma.certificate.create({
          data: {
            certificateId,
            email: cert.email,
            name: cert.name,
            course: cert.course,
            grades: cert.grades,
            template,
            issuedAt,
          },
        }),
      );
    }

    try {
      await Promise.all(tasks);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        // Clean up the written PDF file if DB insert was a duplicate
        if (!createCertificateDto.sendOnlyEmail) {
          await unlink(certificatePdfPath).catch(() => {});
        }
        return {
          type: 'skipped',
          data: {
            email: cert.email,
            name: cert.name,
            course: cert.course,
            template,
            reason:
              'Skipped duplicate (email + course + template already exists)',
          },
        };
      }
      throw error;
    }

    if (createCertificateDto.sendEmail) {
      // Fire-and-forget — queue handles the rest
      void this.mailService.sendCertificateEmail({
        certificateId,
        name: cert.name,
        email: cert.email,
        certificateDownloadUrl: this.getVerificationUrl(certificateId),
        certificatePdfPath: createCertificateDto.sendOnlyEmail
          ? null
          : certificatePdfPath,
      });
    }

    return {
      type: 'success',
      data: {
        certificateId,
        email: cert.email,
        name: cert.name,
        course: cert.course,
        template,
        issuedAt: issuedAt.toISOString(),
        certificatePdfPath,
        isEmailQueued: createCertificateDto.sendEmail,
      },
    };
  }

  findAll() {
    return this.prisma.certificate.findMany({
      orderBy: { issuedAt: 'desc' },
    });
  }

  update(id: string, updateCertificateDto: UpdateCertificateDto) {
    const data = {
      ...updateCertificateDto,
      issuedAt: updateCertificateDto.issuedAt
        ? new Date(updateCertificateDto.issuedAt)
        : undefined,
    };

    return this.prisma.certificate.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.certificate.delete({ where: { id } });
  }
}
