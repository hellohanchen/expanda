import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
import "./markdown-editor.css"
import "react-loading-skeleton/dist/skeleton.css"
import { RootLayoutClient } from "@/components/layout/root-layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expanda - Share Your Stories",
  description: "A modern platform for sharing content in multiple formats",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`min-h-full bg-background font-sans antialiased ${inter.className}`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
