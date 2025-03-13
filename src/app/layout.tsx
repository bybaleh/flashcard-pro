import { Inter } from 'next/font/google';
import './globals.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FlashCardPro - Your Study Companion',
  description: 'A customizable flashcard study tool built with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
} 
