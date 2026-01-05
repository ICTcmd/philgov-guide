import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JuanGuide - Your Friendly Gov Guide",
  description: "The fun, easy, and accurate guide to Philippine government services. Walang hassle! Get requirements for SSS, PhilHealth, Pag-IBIG, LTO, and more.",
  keywords: ["Philippines", "Government Services", "SSS", "PhilHealth", "Pag-IBIG", "LTO", "DFA", "Requirements", "Guide"],
  authors: [{ name: "JuanGuide Team" }],
  openGraph: {
    title: "JuanGuide - Your Friendly Gov Guide",
    description: "Simplified requirements for PH government services. No more confusion. Walang hassle!",
    type: "website",
    locale: "en_PH",
    siteName: "JuanGuide",
  },
  twitter: {
    card: "summary_large_image",
    title: "JuanGuide - Your Friendly Gov Guide",
    description: "The fun, easy, and accurate guide to Philippine government services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
