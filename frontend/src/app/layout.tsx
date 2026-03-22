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

export const metadata: Metadata = {
  title: "Turff | Book Sports Turfs Online",
  description:
    "Discover, check availability, and book sports turfs instantly. Real-time calendar, role dashboards, flexible payments.",
  keywords: ["turf booking", "sports turf", "football", "cricket", "badminton", "tennis"],
  openGraph: {
    title: "Turff | Book Sports Turfs Online",
    description: "Discover, check availability, and book sports turfs instantly.",
    type: "website",
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
