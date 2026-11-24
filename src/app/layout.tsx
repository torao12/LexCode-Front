import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'LexCode — Ética, Legislación y Ciberseguridad',
  description:
    'Plataforma web educativa y gamificada de ética profesional, legislación tecnológica y ciberseguridad para ingeniería.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#000000] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
