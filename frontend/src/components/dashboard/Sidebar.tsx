"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, LayoutDashboard, Calendar, History, User, Bell, Settings, LogOut, 
  PlusCircle, BarChart3, PieChart, ChevronLeft, ChevronRight, Map, 
  Trophy, Activity, Target, ShieldCheck, Globe, CreditCard, ClipboardList,
  Layers, Zap, Users, Store, Star
} from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect } from "react";

const CUSTOMER_LINKS = [
  { label: "Browse Turfs", href: "/turfs", icon: Search },
  { label: "My Bookings",  href: "/dashboard/customer?tab=upcoming", icon: Calendar },
  { label: "Upcoming",     href: "/dashboard/customer?tab=upcoming", icon: Activity },
  { label: "History",      href: "/dashboard/customer?tab=history", icon: History },
  { label: "Notifications", href: "/dashboard/customer?tab=notifications", icon: Bell },
  { label: "Profile",      href: "/dashboard/customer?tab=profile", icon: User },
  { label: "Settings",     href: "/dashboard/customer?tab=settings", icon: Settings },
];

const OWNER_LINKS = [
  { label: "Overview",     href: "/dashboard/owner?tab=overview", icon: LayoutDashboard },
  { label: "My Turfs",      href: "/dashboard/owner?tab=turfs", icon: Store },
  { label: "Add Turf",      href: "/dashboard/owner?tab=add", icon: PlusCircle },
  { label: "Bookings",     href: "/dashboard/owner?tab=bookings", icon: ClipboardList },
  { label: "Earnings",     href: "/dashboard/owner?tab=earnings", icon: CreditCard },
  { label: "Calendar",     href: "/dashboard/owner?tab=calendar", icon: Calendar },
  { label: "Reports",      href: "/dashboard/owner?tab=reports", icon: BarChart3 },
  { label: "Profile",      href: "/dashboard/owner?tab=profile", icon: User },
  { label: "Settings",     href: "/dashboard/owner?tab=settings", icon: Settings },
];

const ADMIN_LINKS = [
  { label: "Dashboard",    href: "/dashboard/admin?tab=overview", icon: ShieldCheck },
  { label: "Users",        href: "/dashboard/admin?tab=users", icon: Users },
  { label: "Turfs",        href: "/dashboard/admin?tab=turfs", icon: Trophy },
  { label: "Bookings",     href: "/dashboard/admin?tab=bookings", icon: Activity },
  { label: "Revenue",      href: "/dashboard/admin?tab=overview", icon: Zap },
  { label: "Reports",      href: "/dashboard/admin?tab=overview", icon: BarChart3 },
  { label: "Settings",     href: "/dashboard/admin?tab=overview", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !user) return null;

  const links = user.role === "admin" ? ADMIN_LINKS : user.role === "owner" ? OWNER_LINKS : CUSTOMER_LINKS;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 100 : 280 }}
      className="fixed left-0 top-0 h-screen bg-white/80 dark:bg-[#0B0F0C]/80 backdrop-blur-3xl border-r border-gray-100 dark:border-white/5 z-50 flex flex-col transition-colors duration-500 shadow-2xl"
    >
      {/* Brand Header */}
      <div className={`h-24 flex items-center px-8 cursor-pointer group ${isCollapsed ? 'justify-center border-b border-gray-100 dark:border-white/5' : ''}`}>
        <Link href="/" className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-green-500/20 group-hover:rotate-12 transition-transform">T</div>
           {!isCollapsed && (
             <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none">Turff</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] leading-none mt-1 opacity-60">SaaS Hub</span>
             </div>
           )}
        </Link>
      </div>

      {/* Navigation Registry */}
      <nav className="flex-1 overflow-y-auto pt-8 px-4 space-y-2 no-scrollbar">
        {!isCollapsed && <div className="px-4 pb-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] italic mb-2">Primary Domain</div>}
        
        {links.map((link) => {
          const Icon = link.icon;
          const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
          const currentTab = searchParams?.get('tab') || 'overview';
          
          const isActive = pathname === link.href.split('?')[0] && (
            link.href.includes('tab=') 
              ? link.href.split('tab=')[1] === currentTab 
              : currentTab === 'overview'
          );

          return (
            <Link 
              key={link.label} 
              href={link.href}
              className={`flex items-center gap-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all relative group h-14
                ${isActive 
                  ? 'bg-primary text-white shadow-xl shadow-green-500/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'opacity-60 group-hover:opacity-100'} transition-all`} />
              {!isCollapsed && <span className="italic">{link.label}</span>}
              
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-6 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100] shadow-2xl border border-white/10 italic">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Command Footer */}
      <div className="p-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-4 p-4 mb-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all group overflow-hidden"
        >
          <div className="w-5 h-5 flex items-center justify-center">
             {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </div>
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest italic">{isCollapsed ? '' : 'Minimize Portal'}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 text-red-500 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest italic">Terminate Command</span>}
        </button>
      </div>
      
      {/* Decorative Gradient */}
      {!isCollapsed && (
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />
      )}
    </motion.aside>
  );
}
