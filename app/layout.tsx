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
  title: "JuanGuide: 🇵🇭 Gov Services Made Simple",
  description: "Skip the confusion! Get instant, easy checklists for SSS, PhilHealth, DFA, LTO, and more. Walang hassle, pramis! 🚀",
  keywords: ["Philippines", "Government Services", "SSS", "PhilHealth", "Pag-IBIG", "LTO", "DFA", "Requirements", "Guide"],
  authors: [{ name: "JuanGuide Team" }],
  openGraph: {
    title: "JuanGuide: 🇵🇭 Gov Services Made Simple",
    description: "Skip the confusion! Get instant, easy checklists for SSS, PhilHealth, DFA, LTO, and more. Walang hassle, pramis! 🚀",
    type: "website",
    locale: "en_PH",
    siteName: "JuanGuide",
  },
  twitter: {
    card: "summary_large_image",
    title: "JuanGuide: 🇵🇭 Gov Services Made Simple",
    description: "Skip the confusion! Get instant, easy checklists for SSS, PhilHealth, DFA, LTO, and more. Walang hassle, pramis! 🚀",
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
