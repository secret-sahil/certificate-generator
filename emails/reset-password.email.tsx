import { Button, Heading, Link, Section, Text } from '@react-email/components';

import { EMAIL_BRAND } from './email.config';
import Layout from './components/layout';

interface ResetPasswordEmailProps {
  name: string;
  resetLink: string;
  toEmail: string;
}

export const ResetPasswordEmail = ({
  name,
  resetLink,
  toEmail,
}: ResetPasswordEmailProps): React.ReactElement => {
  const previewText = `Reset your ${EMAIL_BRAND.appName} password`;

  return (
    <Layout previewText={previewText} toEmail={toEmail}>
      <Section>
        <Heading className="text-[26px] font-semibold text-gray-900 text-center">
          Reset your password 🔐
        </Heading>

        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          Hi <strong>{name}</strong>,<br />
          We received a request to reset your password for your{' '}
          <strong>{EMAIL_BRAND.appName}</strong> account.
        </Text>

        <Text className="text-[15px] leading-6 text-gray-700">
          Click the button below to set a new password. This link is valid for a
          limited time and can be used only once.
        </Text>

        <Section className="my-7 text-center">
          <Button
            href={resetLink}
            className="rounded-md bg-black px-[22px] py-3 text-[13px] font-semibold text-white no-underline"
          >
            Reset Password →
          </Button>
        </Section>

        <Text className="text-[14px] text-gray-600">
          If the button doesn’t work, copy and paste this link into your
          browser:
          <br />
          <Link href={resetLink} className="text-sky-600 break-all">
            {resetLink}
          </Link>
        </Text>

        <Text className="mt-5 text-[13px] text-gray-500">
          If you didn’t request a password reset, you can safely ignore this
          email. Your password will remain unchanged.
        </Text>
      </Section>
    </Layout>
  );
};

ResetPasswordEmail.PreviewProps = {
  name: 'John Doe',
  resetLink: 'https://bytelogsolutions.com/reset-password?token=abcdef123456',
  toEmail: 'john.doe@example.com',
};

export default ResetPasswordEmail;
