import "@/styles/globals.css";
import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { CONFIG } from "@/constants";

export const metadata: Metadata = {
  applicationName: CONFIG.APP_NAME,
  title: {
    default: CONFIG.APP_DEFAULT_TITLE,
    template: CONFIG.APP_TITLE_TEMPLATE
  },
  description: CONFIG.APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: CONFIG.APP_DEFAULT_TITLE
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: CONFIG.APP_NAME,
    title: {
      default: CONFIG.APP_DEFAULT_TITLE,
      template: CONFIG.APP_TITLE_TEMPLATE
    },
    description: CONFIG.APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: CONFIG.APP_DEFAULT_TITLE,
      template: CONFIG.APP_TITLE_TEMPLATE
    },
    description: CONFIG.APP_DESCRIPTION
  }
};

export const viewport: Viewport = {
  themeColor: "black"
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body style={fontSans.style}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
