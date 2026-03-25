"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import PageTransition from "../PageTransition";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Dashboards have no navigation or footer in the shell (they handle their own layouts if needed)
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F0C] transition-colors duration-300">
      {/* Navbar is global except for specific auth flows if preferred, but here we keep it for discovery */}
      {!isAuthPage && !isLandingPage && <Navbar />}
      
      <main className={`flex-1 w-full ${isLandingPage ? '' : 'container-compact py-8 md:py-12'}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Footer is only for the landing page or discovery if needed, but per request: no footer in dashboards */}
      {isLandingPage && <Footer />}
    </div>
  );
}
