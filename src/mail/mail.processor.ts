import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailJobRouter } from './mail-job.router';
import { WelcomeMailHandler } from './handlers/welcome.handler';
import { AwsSesEmailProvider } from './providers/aws-ses.provider';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/env.validation';
import { ResetPasswordMailHandler } from './handlers/reset-password.handler';
import { EmailVerificationMailHandler } from './handlers/email-verification.handler';
import { CertificateMailHandler } from './handlers/certificate.handler';

@Processor('mail', { concurrency: 5 })
export class MailProcessor extends WorkerHost {
  private router: MailJobRouter;

  constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {
    super();

    const emailProvider = new AwsSesEmailProvider({
      emailFrom: config.get<string>('EMAIL_FROM'),
      awsRegion: config.get<string>('AWS_SES_REGION'),
      awsAccessKeyId: config.get<string>('AWS_ACCESS_KEY_ID'),
      awsSecretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY'),
    });

    this.router = new MailJobRouter([
      new WelcomeMailHandler(emailProvider),
      new ResetPasswordMailHandler(emailProvider),
      new EmailVerificationMailHandler(emailProvider),
      new CertificateMailHandler(emailProvider),
    ]);
  }

  async process(job: Job) {
    await this.router.route(job);
  }
}
