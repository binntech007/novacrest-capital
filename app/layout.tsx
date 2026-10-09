
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Novacrest Capital",
    template: "%s | Novacrest Capital",
  },

  description:
    "Explore cryptocurrency, stocks, shares and commodities with Novacrest Capital.",

  icons: {
    icon: "/novacrest-logo.png",
    shortcut: "/novacrest-logo.png",
    apple: "/novacrest-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050912] font-sans text-white">
        {children}

        <Script
          id="tawk-to-chat"
          strategy="lazyOnload"
          src="https://embed.tawk.to/6ac8f0ca532d6134c74ad3a7/1k4gep6ei"
        />
      </body>
    </html>
  );
}
