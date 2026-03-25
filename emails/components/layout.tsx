import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';

import { Header } from './header';
import { Footer } from './footer';

interface LayoutProps {
  children: React.ReactNode;
  previewText: string;
  toEmail: string;
}

export const Layout = ({
  children,
  previewText,
  toEmail,
}: LayoutProps): React.ReactElement => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Google Sans"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFU.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-5 max-w-[520px] rounded-3xl bg-white border border-gray-200 p-6">
            <Header />
            {children}
            <Footer toEmail={toEmail} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Layout;
