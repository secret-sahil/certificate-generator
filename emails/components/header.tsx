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
          <Column align="left">
            <Img
              src={EMAIL_BRAND.logoUrl}
              width="auto"
              height="36"
              alt={EMAIL_BRAND.appName}
            />
          </Column>
        </Row>
      </Section>
    </Tailwind>
  );
};
