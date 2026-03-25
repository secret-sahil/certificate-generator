import { Section, Text } from '@react-email/components';

import { EMAIL_BRAND } from './email.config';
import Layout from './components/layout';

interface CertificateEmailProps {
  name: string;
  toEmail: string;
}

export const CertificateEmail = ({
  name,
  toEmail,
}: CertificateEmailProps): React.ReactElement => {
  const previewText = `Your certificate is ready! 🚀`;

  return (
    <Layout previewText={previewText} toEmail={toEmail}>
      <Section>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700 font-bold">
          Dear {name},
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          Greetings from Hoping Minds!
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          Congratulations on successfully completing your course. We are
          delighted to recognize your dedication, commitment, and consistent
          efforts throughout your learning journey.{' '}
          <u>
            Please find your Certificate of Completion attached to this email.
          </u>
          This certificate is an acknowledgement that you have met all academic
          and assessment requirements of the program. Your achievement reflects
          not only your hard work but also your readiness to apply these skills
          in real-world scenarios.{' '}
          <i>
            We encourage you to showcase this certificate on your professional
            platforms such as LinkedIn and include it in your portfolio.
          </i>
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          At Hoping Minds, we remain committed to supporting your continuous
          learning and career growth. We look forward to seeing you enroll in
          more advanced programs and take the next step in your professional
          journey.
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          If you have any questions or require further assistance, feel free to
          reach out to us.
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          Wishing you continued success ahead!
        </Text>
        <Text className="mt-3 text-[15px] leading-6 text-gray-700">
          Best regards, <br />
          <strong>{EMAIL_BRAND.appName}</strong>
        </Text>
      </Section>
    </Layout>
  );
};

CertificateEmail.PreviewProps = {
  name: 'Anita Sharma',
  toEmail: 'anita.sharma@example.com',
};

export default CertificateEmail;
