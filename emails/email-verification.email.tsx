import { Button, Heading, Link, Section, Text } from '@react-email/components';

import { EMAIL_BRAND } from './email.config';
import Layout from './components/layout';

interface EmailVerificationEmailProps {
  name: string;
  verificationLink: string;
  toEmail: string;
}

export const EmailVerificationEmail = ({
  name,
  verificationLink,
  toEmail,
}: EmailVerificationEmailProps): React.ReactElement => {
  const previewText = `Verify your ${EMAIL_BRAND.appName} email`;

  return (
    <Layout previewText={previewText} toEmail={toEmail}>
      <Section>
        <Heading className="text-2xl font-semibold text-gray-900 text-center">
          Verify your email address ✉️
        </Heading>

        <Text className="mt-3 text-base leading-6 text-gray-700">
          Hi <strong>{name}</strong>,<br />
          Thanks for signing up for <strong>{EMAIL_BRAND.appName}</strong>.
        </Text>

        <Text className="text-base leading-6 text-gray-700">
          Please confirm your email address by clicking the button below. This
          helps us keep your account secure and ensures you receive important
          updates.
        </Text>

        <Section className="my-7 text-center">
          <Button
            href={verificationLink}
            className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white no-underline"
          >
            Verify Email →
          </Button>
        </Section>

        <Text className="text-sm text-gray-600">
          If the button doesn’t work, copy and paste this link into your
          browser:
          <br />
          <Link href={verificationLink} className="text-sky-600 break-all">
            {verificationLink}
          </Link>
        </Text>

        <Text className="mt-5 text-[13px] text-gray-500">
          If you didn’t create an account with {EMAIL_BRAND.appName}, you can
          safely ignore this email.
        </Text>
      </Section>
    </Layout>
  );
};

EmailVerificationEmail.PreviewProps = {
  name: 'John Doe',
  verificationLink: 'https://example.com/verify?token=longrandomtoken12345',
  toEmail: 'john.doe@example.com',
};

export default EmailVerificationEmail;
