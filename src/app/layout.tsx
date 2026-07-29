import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PB. Nusa Badminton Club",
  description: "Club badminton profesional — jadwal turnamen, mabar, dan informasi terlengkap.",
};

async function getThemeStyle() {
  const settings = await prisma.setting.findMany();
  const themeMap: Record<string, string> = {};
  for (const s of settings) {
    themeMap[s.key] = s.value;
  }
  const colorKeys = [
    "color-navy", "color-navy-light", "color-navy-dark",
    "color-gold", "color-gold-light", "color-gold-dark",
    "color-surface", "color-muted",
  ];
  const vars: Record<string, string> = {};
  for (const k of colorKeys) {
    if (themeMap[k]) vars[`--${k}`] = themeMap[k];
  }
  return vars;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeVars = await getThemeStyle();

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={themeVars as React.CSSProperties}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
