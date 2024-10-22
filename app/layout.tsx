import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "../styles/fonts.css";
import localFont from 'next/font/local';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
const designer = localFont({ 
  src: '../public/fonts/Designer.otf',
  variable: '--font-designer',
});
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Termometer",
  description: "Termometer is a word association game that challenges players to guess a secret word based on a temperature score for each guess.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${designer.variable}`} >
      <head>
          <link
            rel="preload"
            href="/fonts/Designer.otf"
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
        </head>
        <body className={inter.className}>
          {/* <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
          {children}
        <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
