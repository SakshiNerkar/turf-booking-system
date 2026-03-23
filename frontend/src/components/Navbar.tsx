"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { Menu, X, Bell, LayoutDashboard, Search, ClipboardList, LogOut } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-[#121A14]/90 transition-colors duration-500">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-xl font-black text-white shadow-xl shadow-green-500/10 transition-all group-hover:shadow-green-500/30"
            >
              T
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-2xl font-black tracking-tighter italic text-gray-900 dark:text-white leading-none uppercase">Turff</div>
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] leading-none mt-1.5 opacity-60 italic">Marketplace</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
             {[
               { href: '/turfs', label: 'BROWSE ARENAS', icon: Search },
               { href: '/dashboard/customer?tab=history', label: 'MATCH STATS', icon: ClipboardList },
               { href: '/bookings', label: 'ACTIVE SLOTS', icon: LayoutDashboard }
             ].map(link => (
               <Link 
                 key={link.href} href={link.href} 
                 className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent ${isActive(link.href) ? 'bg-primary/5 text-primary border-primary/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
               >
                 <link.icon className="w-4 h-4 opacity-70" /> {link.label}
               </Link>
             ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
               <div className="flex items-center gap-6 pl-6 border-l border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push(`/dashboard/${user.role}`)}>
                     <div className="text-right hidden xl:block">
                        <div className="text-sm font-black text-gray-900 dark:text-white italic leading-none">{user.name.toUpperCase()}</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60 italic">{user.role} RANK</div>
                     </div>
                     <div className="h-11 w-11 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center font-black text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        {initials(user.name)}
                     </div>
                  </div>
                  <button onClick={() => { logout(); router.push("/"); }} className="p-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors active:scale-90"><LogOut className="w-5 h-5" /></button>
               </div>
            ) : (
               <div className="flex items-center gap-4">
                  <Link href="/login" className="px-6 py-2.5 text-[10px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all uppercase tracking-widest">Login</Link>
                  <Link href="/register" className="px-8 py-3 bg-primary text-white text-[10px] font-black rounded-xl shadow-2xl shadow-green-500/20 hover:scale-105 transition-all uppercase tracking-[0.2em] italic">GET STARTED</Link>
               </div>
            )}
          </div>


          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 -mr-2 md:hidden rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-[#121A14] border-b border-gray-200 dark:border-white/10 overflow-hidden md:hidden shadow-2xl transition-colors duration-500"
          >
            <div className="p-4 space-y-2">
              <MobileLink href="/turfs" active={isActive("/turfs")} onClick={() => setMenuOpen(false)}>
                <Search className="w-4 h-4" /> Browse Turfs
              </MobileLink>
              {user && (
                <>
                  <MobileLink href={`/dashboard/${user.role}`} active={isActive("/dashboard")} onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </MobileLink>
                  {user.role === "customer" && (
                    <MobileLink href="/bookings" active={isActive("/bookings")} onClick={() => setMenuOpen(false)}>
                      <ClipboardList className="w-4 h-4" /> My Bookings
                    </MobileLink>
                  )}
                  <div className="my-4 border-t border-gray-100 dark:border-white/5" />
                  <div className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold">
                      {initials(user.name)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); router.push("/"); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
              {!user && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="py-3 text-center text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="py-3 text-center text-sm font-bold text-white bg-primary rounded-xl">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 flex items-center gap-2.5 text-sm font-bold transition-all duration-300 group
        ${active ? 'text-primary' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
    >
      {children}
      <motion.div 
        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full origin-left"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

function MobileLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-colors
        ${active ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
    >
      {children}
    </Link>
  );
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
}
