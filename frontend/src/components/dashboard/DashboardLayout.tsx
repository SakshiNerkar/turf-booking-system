"use client";

import { useState, useMemo } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { 
  LayoutDashboard, Search, History, User, Settings, PlusCircle, 
  Store, Calendar, BarChart3, Bell, Menu, X, ArrowLeft
} from "lucide-react";
import Link from "next/link";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bottom Navigation Config (Mobile-First)
  const navItems = useMemo(() => {
    if (!user) return [];
    if (user.role === 'customer' || user.role === 'user') return [
      { path: '/dashboard/customer', icon: LayoutDashboard, label: 'Home' },
      { path: '/turfs', icon: Search, label: 'Explore' },
      { path: '/dashboard/customer/history', icon: History, label: 'History' },
      { path: '/dashboard/customer?tab=profile', icon: User, label: 'Profile' }
    ];
    if (user.role === 'owner') return [
      { path: '/dashboard/owner', icon: LayoutDashboard, label: 'Home' },
      { path: '/dashboard/owner?tab=turfs', icon: Store, label: 'Arenas' },
      { path: '/dashboard/owner?tab=add', icon: PlusCircle, label: 'Add' },
      { path: '/dashboard/owner?tab=profile', icon: User, label: 'Profile' }
    ];
    if (user.role === 'admin') return [
      { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Admin' },
      { path: '/dashboard/admin?tab=turfs', icon: Search, label: 'Sectors' },
      { path: '/dashboard/admin?tab=history', icon: Bell, label: 'Logs' },
      { path: '/dashboard/admin?tab=profile', icon: User, label: 'Identity' }
    ];
    return [];
  }, [user]);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0B0F0C] transition-colors duration-500 pb-24 lg:pb-0 lg:pl-[260px] relative flex flex-col">
      
      {/* 0. GLOBAL BACKGROUND DECOR (WOW FACTOR) */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-stadium-texture" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -mr-96 -mt-96" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] lg:ml-72 -mb-96" />

      {/* 1. DESKTOP SIDEBAR (Static/Fixed) */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-[#0B0F0C] border-r border-gray-100 dark:border-white/5 z-40 overflow-y-auto no-scrollbar shadow-sm">
         <div className="px-6 py-10 flex flex-col h-full">
            <Link href="/" className="flex items-center gap-3 mb-16 px-2 group">
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                  <Store className="w-6 h-6 text-white" />
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">TURFF</span>
                  <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] leading-none mt-1">Platform Console</span>
               </div>
            </Link>
            <div className="flex-1">
               <Sidebar />
            </div>
         </div>
      </aside>

      {/* 2. MOBILE TOP HEADER (Tactical) */}
      <div className="lg:hidden sticky top-0 z-50">
         <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
      </div>

      {/* 3. MAIN CONTENT ENGINE */}
      <main className="flex-1 w-full p-6 lg:p-8 relative z-10 overflow-hidden">
         <motion.div 
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
           className="w-full h-full"
         >
            {children}
         </motion.div>
      </main>

      {/* 4. MOBILE BOTTOM NAVIGATION (Premium Protocol) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white/95 dark:bg-black/95 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-50 flex items-center justify-around px-4">
         {navItems.map(item => {
           const isActive = pathname === item.path;
           return (
             <Link key={item.label} href={item.path} className="relative flex flex-col items-center justify-center gap-1 h-full px-4 group">
                <item.icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-gray-400 group-hover:text-primary'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-primary opacity-100' : 'text-gray-400 opacity-60'}`}>{item.label}</span>
                {isActive && <motion.div layoutId="bottom-dot" className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary" />}
             </Link>
           );
         })}
      </nav>

      {/* 5. MOBILE DRAWER OVERLAY (If needed for Extra Items) */}
      <AnimatePresence>
         {mobileMenuOpen && (
           <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
             <motion.div 
               initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
               className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-[#121A14] z-[70] shadow-2xl p-8"
             >
                <div className="flex items-center justify-between mb-12">
                   <Link href="/" className="text-2xl font-black text-primary tracking-tighter italic">TURFF</Link>
                   <button onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5"><X className="w-5 h-5" /></button>
                </div>
                <Sidebar />
             </motion.div>
           </>
         )}
      </AnimatePresence>

    </div>
  );
}
