"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import PageTransition from "../PageTransition";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isDashboard = pathname.startsWith('/dashboard');
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDiscoverPage = pathname.startsWith('/turfs');

  // Dashboards handle their own layout (usually with a sidebar)
  if (isDashboard) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F0C] transition-colors duration-300">
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F0C] transition-colors duration-500 overflow-x-hidden">
      {/* Global Navbar for all non-dashboard pages */}
      {!isAuthPage && <Navbar />}
      
      <main className={`flex-1 w-full ${isLandingPage ? "" : "container-premium py-8 md:py-12"}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Global Footer for all non-dashboard, non-discover, non-auth pages */}
      {!isAuthPage && !isDiscoverPage && <Footer />}
    </div>
  );
}
