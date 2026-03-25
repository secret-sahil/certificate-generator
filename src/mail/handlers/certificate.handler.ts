import { access } from 'node:fs/promises';
import { Job } from 'bullmq';
import { MailHandler } from './mail-handler.interface';
import { EmailProvider } from '../providers/email.provider';
import { CertificateJobData } from '../types/certificate';
import CertificateEmail from '../templates/certificate-email';

export class CertificateMailHandler implements MailHandler {
  jobName = 'certificate-email';

  constructor(private readonly email: EmailProvider) {}

  async handle(job: Job<CertificateJobData>) {
    await access(job.data.certificatePdfPath);

    await this.email.send({
      to: job.data.email,
      subject: 'Your Certificate 📄',
      react: CertificateEmail({ name: job.data.name }),
      attachments: [
        {
          filename: 'certificate.pdf',
          path: job.data.certificatePdfPath,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
