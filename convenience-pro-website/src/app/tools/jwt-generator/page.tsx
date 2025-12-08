import { JwtGenerator } from '@/components/tools/jwt-generator';

export const metadata = {
  title: 'JWT Generator | Create JWT Tokens Online',
  description: 'Generate JWT tokens with custom payload using HS256 algorithm. Configure expiration, issuer, subject, and custom claims. Free, secure, and client-side only.',
  keywords: ['jwt generator', 'jwt token', 'json web token', 'hs256', 'jwt creator', 'jwt online', 'token generator', 'authentication token'],
  openGraph: {
    title: 'JWT Generator | Create JWT Tokens Online',
    description: 'Generate JWT tokens with custom payload using HS256 algorithm. Configure expiration, issuer, subject, and custom claims.',
    type: 'website',
    url: '/tools/jwt-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JWT Generator | Create JWT Tokens Online',
    description: 'Generate JWT tokens with custom payload using HS256 algorithm. Configure expiration, issuer, subject, and custom claims.',
  },
};

export default function JwtGeneratorPage() {
  return <JwtGenerator />;
}
