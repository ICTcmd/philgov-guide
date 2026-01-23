import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

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
  title: "GovGuide PH: Your Guide to Government Requirements",
  description: "Know the requirements. Understand the process. Avoid hassle. Your one-stop guide for SSS, PhilHealth, Pag-IBIG, and more.",
  keywords: ["Philippines", "Government Services", "SSS", "PhilHealth", "Pag-IBIG", "LTO", "DFA", "Requirements", "Guide", "GovGuide PH"],
  authors: [{ name: "GovGuide PH Team" }],
  openGraph: {
    title: "GovGuide PH: Your Guide to Government Requirements",
    description: "Know the requirements. Understand the process. Avoid hassle.",
    type: "website",
    locale: "en_PH",
    siteName: "GovGuide PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "GovGuide PH",
    description: "Know the requirements. Understand the process. Avoid hassle.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-slate-50 dark:bg-slate-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
