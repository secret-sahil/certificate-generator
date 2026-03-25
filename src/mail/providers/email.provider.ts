export type EmailAttachment = {
  filename: string;
  path: string;
  contentType?: string;
};

export interface EmailProvider {
  send(options: {
    to: string;
    subject: string;
    react: React.ReactNode;
    attachments?: EmailAttachment[];
  }): Promise<void>;
}
