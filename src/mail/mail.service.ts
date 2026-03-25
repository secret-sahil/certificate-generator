import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CertificateJobData } from './types/certificate';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly queue: Queue) {}

  sendCertificateEmail(vars: CertificateJobData) {
    return this.queue.add('certificate-email', vars);
  }
}
