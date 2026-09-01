import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Vecta | Recruitment Intelligence & Career Radar (IT · AI · Governance · Security)",
  description: "Direct ATS job search, company ecosystem radar, AI vector match scoring, STAR interview preparation, and career pipeline navigator for IT, AI, Governance, and Security.",
  keywords: [
    "IT Jobs",
    "AI Jobs",
    "Cybersecurity Jobs",
    "Governance GRC Jobs",
    "EU AI Act",
    "ATS Job Search",
    "Direct Application",
    "Tech Career Radar",
    "STAR Interview Prep",
    "Vecta"
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
