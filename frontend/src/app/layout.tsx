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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-dvh bg-gradient-to-br from-green-50 via-white to-green-100 text-[color:var(--foreground)] dark:from-[#041007] dark:via-[#050b07] dark:to-[#06150a]">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
