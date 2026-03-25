import { Button, Heading, Link, Section, Text } from '@react-email/components';

import { EMAIL_BRAND } from './email.config';
import Layout from './components/layout';

interface WelcomeEmailProps {
  name: string;
  toEmail: string;
}

export const WelcomeEmail = ({
  name,
  toEmail,
}: WelcomeEmailProps): React.ReactElement => {
  const previewText = `Welcome to ${EMAIL_BRAND.appName} 🚀`;

  return (
    <Layout previewText={previewText} toEmail={toEmail}>
      <Section>
        <Heading className="text-[26px] font-semibold text-gray-900 text-center">
          Welcome aboard, {name} 👋
        </Heading>

        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          Your <strong>{EMAIL_BRAND.appName}</strong> account is ready. You now
          have access to powerful tools designed to help you build faster, scale
          smarter, and ship with confidence.
        </Text>

        <Section className="my-7 text-center">
          <Button
            href={EMAIL_BRAND.dashboardLink}
            className="rounded-md bg-black px-[22px] py-3 text-[13px] font-semibold text-white no-underline"
          >
            Open Dashboard →
          </Button>
        </Section>

        <Text className="text-[14px] text-gray-600">
          If the button doesn’t work, copy and paste this link:
          <br />
          <Link
            href={EMAIL_BRAND.dashboardLink}
            className="text-sky-600 break-all"
          >
            {EMAIL_BRAND.dashboardLink}
          </Link>
        </Text>
      </Section>
    </Layout>
  );
};

WelcomeEmail.PreviewProps = {
  name: 'John Doe',
  toEmail: 'john.doe@example.com',
};

export default WelcomeEmail;
