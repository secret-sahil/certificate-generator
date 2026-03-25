import {
  Section,
  Img,
  Text,
  Row,
  Column,
  Link,
  Tailwind,
  Hr,
} from '@react-email/components';
import { EMAIL_BRAND } from '../email.config';

export const Footer = ({
  toEmail,
}: {
  toEmail: string;
}): React.ReactElement => {
  return (
    <Tailwind>
      <Hr />
      <Section className="text-center pt-4">
        <table className="w-full">
          <tr>
            <td align="center">
              <Row className="table-cell w-full align-bottom">
                {EMAIL_BRAND.socialLinks.map((social, index) => (
                  <Column key={index}>
                    <Link href={social.url} target="_blank" rel="noopener">
                      <Img
                        alt={social.name}
                        className="mx-1"
                        height="32"
                        src={social.icon}
                        width="32"
                      />
                    </Link>
                  </Column>
                ))}
              </Row>
            </td>
          </tr>
          <tr>
            <td align="center">
              <Text className="text-sm text-gray-600 m-0">
                Need help? Our team is just one email away at{' '}
                <Link
                  href={`mailto:${EMAIL_BRAND.supportEmail}`}
                  className="text-sky-600"
                >
                  {EMAIL_BRAND.supportEmail}
                </Link>
              </Text>
              <Text className="text-sm text-gray-500 m-0 mt-4">
                This email was sent to{' '}
                <Link
                  href={`mailto:${toEmail}`}
                  className="text-gray-500 underline"
                >
                  {toEmail}
                </Link>
              </Text>
              <Text className="text-xs text-gray-500 text-left m-0 mt-4">
                © {new Date().getFullYear()} {EMAIL_BRAND.legalName} /{' '}
                {EMAIL_BRAND.address} /{' '}
                <Link
                  href={EMAIL_BRAND.privacyPolicyLink}
                  className="text-sky-600"
                >
                  Privacy Policy
                </Link>
              </Text>
            </td>
          </tr>
        </table>
      </Section>
    </Tailwind>
  );
};
