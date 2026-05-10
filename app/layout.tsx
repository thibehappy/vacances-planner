import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vacances 2026 - Planificateur de dispos",
  description: "Planifie tes vacances avec tes potes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
