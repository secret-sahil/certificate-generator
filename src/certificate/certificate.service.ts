import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) {}

  getUniqueCertificateId() {
    // Generate a random alphanumeric string of length 5 and prefix it with "HM-"
    const id = `HM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    return this.prisma.certificate
      .findUnique({ where: { certificateId: id } })
      .then((existing) => {
        if (existing) {
          return this.getUniqueCertificateId(); // Recursively generate a new ID if collision occurs
        }
        return id;
      });
  }

  create(createCertificateDto: CreateCertificateDto) {
    return 'This action adds a new certificate';
  }

  findAll() {
    return `This action returns all certificate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificate`;
  }

  update(id: number, updateCertificateDto: UpdateCertificateDto) {
    return `This action updates a #${id} certificate`;
  }
}
