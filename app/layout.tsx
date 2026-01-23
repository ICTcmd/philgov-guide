import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BAGO APP: 🇵🇭 Gov Services Made Simple",
  description: "Skip the confusion! Get instant, easy checklists for SSS, PhilHealth, DFA, LTO, and more. Walang hassle, pramis! 🚀",
  keywords: ["Philippines", "Government Services", "SSS", "PhilHealth", "Pag-IBIG", "LTO", "DFA", "Requirements", "Guide", "Bago City"],
  authors: [{ name: "BAGO APP Team" }],
  openGraph: {
    title: "BAGO APP: 🇵🇭 Gov Services Made Simple",
    description: "Skip the confusion! Get instant, easy checklists for SSS, PhilHealth, DFA, LTO, and more. Walang hassle, pramis! 🚀",
    type: "website",
    locale: "en_PH",
    siteName: "BAGO APP",
  },
  twitter: {
    card: "summary_large_image",
    title: "BAGO APP: 🇵🇭 Gov Services Made Simple",
    description: "Skip the confusion! Get instant, easy checklists for SSS, PhilHealth, DFA, LTO, and more. Walang hassle, pramis! 🚀",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
