import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { EmailAttachment, EmailProvider } from './email.provider';

export class AwsSesEmailProvider implements EmailProvider {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly config: {
      emailFrom: string;
      awsRegion: string;
      awsAccessKeyId: string;
      awsSecretAccessKey: string;
    },
  ) {
    const sesClient = new SESv2Client({
      region: config.awsRegion,
      credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    } as any);
  }

  async send({
    to,
    subject,
    react,
    attachments,
  }: {
    to: string;
    subject: string;
    react: React.ReactNode;
    attachments?: EmailAttachment[];
  }) {
    const html = await render(react);

    await this.transporter.sendMail({
      from: this.config.emailFrom,
      bcc: 'viparaja@hopingminds.com',
      to,
      subject,
      html,
      attachments,
    });
  }
}
