import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface ResetPasswordEmailProps {
    username: string;
    resetToken: string;
  }
  
  export default function VerificationEmail({ username, resetToken }: ResetPasswordEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Password Reset Request</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here&apos;s your Reset Password verification code: {resetToken}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello @{username},</Heading>
          </Row>
          <Row>
            <Text>
            You are receiving this because you (or someone else) have requested
            the reset of the password for your account.
            </Text>
          </Row>
          <Row>
            <Text>{resetToken}</Text> 
          </Row>
          <Row>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
          <Row>
            <Button
              href={`${process.env.URL}/reset-password/?resetToken=${resetToken}&username=${username}`}
              style={{ color: '#61dafb' }}
            >
              Reset Password
            </Button>
          </Row>
        </Section>
      </Html>
    );
  }