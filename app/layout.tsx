import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Vecta | Find. Apply. Advance.",
  description: "Career intelligence to find specialist roles, understand your fit, and move every application forward.",
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
  applicationName: "Vecta",
  openGraph: {
    type: "website",
    title: "Vecta | Find. Apply. Advance.",
    description: "Career intelligence for your next move.",
    siteName: "Vecta",
    images: [
      {
        url: "/og.png",
        width: 1729,
        height: 910,
        alt: "Vecta — Find. Apply. Advance. Career intelligence for your next move.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vecta | Find. Apply. Advance.",
    description: "Career intelligence for your next move.",
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Vecta",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
