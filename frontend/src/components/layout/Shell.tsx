"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import PageTransition from "../PageTransition";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <div className="min-h-dvh flex flex-col">
          {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F0C] transition-colors duration-500">
      <Navbar />
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
