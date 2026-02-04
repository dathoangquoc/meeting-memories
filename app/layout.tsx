import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import RouteGuard from "@/components/route-guard";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Meeting Memories",
  description: "The fastest way to take note of meetings",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
          <RouteGuard>
            {children}
          </RouteGuard>
      </body>
    </html>
  );
}
