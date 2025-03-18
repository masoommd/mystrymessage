import type { Metadata } from 'next';
import { Inter,Fira_Code} from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });
const firacode = Fira_Code({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mystery Message',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <head>
      <style>
@import url('https://fonts.googleapis.com/css2?family=Gorditas:wght@400;700&display=swap');
</style>
      
      </head>
      <AuthProvider>
        <body className={firacode.className || inter.className}>
           <Navbar/>
          {children}
          <Toaster richColors />
          <Footer/>
        </body>
      </AuthProvider>
    </html>
  );
}
