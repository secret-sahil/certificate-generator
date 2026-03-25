import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailVerificationJobData } from './types/email-verification';
import { ResetPasswordJobData } from './types/reset-password';
import { WelcomeJobData } from './types/welcome';
import { CertificateJobData } from './types/certificate';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly queue: Queue) {}

  welcome(vars: WelcomeJobData) {
    return this.queue.add('welcome-email', vars);
  }

  resetPasswordEmail(vars: ResetPasswordJobData) {
    return this.queue.add('reset-password-email', vars);
  }

  sendVerificationEmail(vars: EmailVerificationJobData) {
    return this.queue.add('email-verification-email', vars);
  }

  sendCertificateEmail(vars: CertificateJobData) {
    return this.queue.add('certificate-email', vars);
  }
}
