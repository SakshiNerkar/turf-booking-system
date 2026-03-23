import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "../components/AuthProvider";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ToasterProvider } from "../components/ToasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#22C55E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Turff SaaS | Elite Sports Tech Platform",
  description: "High-performance arena booking, regional match synchronization, and operational asset management.",
  keywords: ["turf booking", "sports tech", "SaaS", "football", "cricket"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Turff SaaS",
  },
};

import ThemeSwitcher from "../components/ThemeSwitcher";
import ScrollProgress from "../components/ScrollProgress";
import { Shell } from "../components/layout/Shell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-[#0B0F0C] dark:text-gray-100 transition-colors duration-500`}
      >
        <AuthProvider>
          <ScrollProgress />
          <Shell>
            {children}
          </Shell>
          <ThemeSwitcher />
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
