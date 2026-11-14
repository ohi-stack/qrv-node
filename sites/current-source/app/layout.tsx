import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://qrv.network"),
  title: {
    default: "QR-V™ Global Verification Network",
    template: "%s | QR-V™",
  },
  description: "Live registry-backed verification for certificates, credentials, documents, products, and digital records.",
  openGraph: {
    type: "website",
    url: "https://qrv.network/",
    title: "QR-V™ Global Verification Network",
    description: "Resolve public QR-V records through the live verifier, registry, and integrity service at qrv.network.",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "QR-V live public verification network" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR-V™ Global Verification Network",
    description: "Live public verification for registry-backed records.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/qrv-favicon.png", type: "image/png" }],
    shortcut: "/qrv-favicon.png",
    apple: "/qrv-favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
