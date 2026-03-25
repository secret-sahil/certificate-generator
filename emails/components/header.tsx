import {
  Section,
  Row,
  Column,
  Img,
  Tailwind,
  Text,
} from '@react-email/components';
import { EMAIL_BRAND } from '../email.config';

export const Header = (): React.ReactElement => {
  return (
    <Tailwind>
      <Section className="pb-4">
        <Row>
          <Column className="w-[10%]">
            <Img
              src={EMAIL_BRAND.logoUrl}
              width="auto"
              height="36"
              alt={EMAIL_BRAND.appName}
            />
          </Column>
          <Column align="right">
            <Text className="text-xs text-gray-600 m-0">
              Monetize your creations effortlessly
            </Text>
          </Column>
        </Row>
      </Section>
    </Tailwind>
  );
};
