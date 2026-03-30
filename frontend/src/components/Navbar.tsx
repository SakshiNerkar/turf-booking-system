"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { 
  Menu, X, Bell, LayoutDashboard, Search, History, LogOut, 
  User, CheckCircle2, ChevronRight, MapPin, Target, Home
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? "glass-panel shadow-sm" 
            : "bg-white dark:bg-[#0B0F0C] border-b border-border"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          
          {/* Minimal Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl italic skew-x-3 transition-transform group-hover:skew-x-0 shadow-lg shadow-primary/20">
               T
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100 uppercase italic">Turff</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-2">
             <NavLink href="/" label="Home" icon={Home} active={pathname === "/"} />
             <NavLink href="/turfs" label="Discover" icon={Search} active={pathname.startsWith("/turfs")} />
             {user && (
               <NavLink 
                 href={`/dashboard/${user.role === 'user' ? 'customer' : user.role}`} 
                 label="Dashboard" 
                 icon={LayoutDashboard} 
                 active={pathname.startsWith("/dashboard")} 
               />
             )}
          </nav>

          {/* User Hub & Trust Signals */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary italic opacity-70">
              <CheckCircle2 className="w-4 h-4" /> Secure Hub
            </div>

            {user ? (
               <div className="flex items-center gap-4">
                  <button className="hidden sm:flex relative p-2 text-gray-400 hover:text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </button>
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => router.push(`/dashboard/${user.role === 'user' ? 'customer' : user.role}`)}
                  >
                     <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-card border border-border flex items-center justify-center font-black text-sm text-gray-500 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                        {initials(user.name)}
                     </div>
                  </div>
                  <button onClick={() => { logout(); router.push("/"); }} className="hidden sm:flex p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
               </div>
            ) : (
               <div className="hidden sm:flex items-center gap-3">
                  <Link href="/login" className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Log In</Link>
                  <Link href="/register" className="btn-sports px-6 py-2.5">Sign Up</Link>
               </div>
            )}
            
            {/* Mobile Header Menu Trigger (For generic pages) */}
            <button
              className="p-2 -mr-2 md:hidden text-gray-500 hover:text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown (Auth/Logout Only) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border bg-white dark:bg-card shadow-xl overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {user ? (
                  <button
                    onClick={() => { logout(); window.location.href = "/"; }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary">Log In</Link>
                    <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-sports">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-panel border-t shadow-sticky pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <BottomNavIcon href="/" label="Home" icon={Home} active={pathname === "/"} />
          <BottomNavIcon href="/turfs" label="Discover" icon={Search} active={pathname.startsWith("/turfs")} />
          {user && (
            <BottomNavIcon 
              href={`/dashboard/${user.role === 'user' ? 'customer' : user.role}`} 
              label="Dashboard" 
              icon={LayoutDashboard} 
              active={pathname.startsWith("/dashboard")} 
            />
          )}
          {user && (
            <BottomNavIcon 
              href={`/dashboard/${user.role === 'user' ? 'customer' : user.role}/history`} 
              label="Activity" 
              icon={History} 
              active={pathname.includes("history")} 
            />
          )}
        </div>
      </div>
    </>
  );
}

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: any; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative group
        ${active ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} /> 
      {label}
    </Link>
  );
}

function BottomNavIcon({ href, label, icon: Icon, active }: { href: string; label: string; icon: any; active: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full h-full gap-1 group">
      <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
        <Icon className={`w-5 h-5 ${active ? 'fill-primary/20' : ''}`} />
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
    </Link>
  );
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
}
