"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, LayoutDashboard, Calendar, History, User, Bell, Settings, LogOut, 
  PlusCircle, BarChart3, PieChart, ChevronLeft, ChevronRight, Map 
} from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect } from "react";

const CUSTOMER_LINKS = [
  { label: "Browse Turfs", href: "/turfs", icon: Search },
  { label: "My Bookings",  href: "/dashboard/customer?tab=upcoming", icon: Calendar },
  { label: "History",      href: "/dashboard/customer?tab=history", icon: History },
  { label: "Profile",      href: "/dashboard/customer?tab=profile", icon: User },
  { label: "Settings",     href: "/dashboard/customer?tab=settings", icon: Settings },
];

const OWNER_LINKS = [
  { label: "Overview",     href: "/dashboard/owner?tab=overview", icon: LayoutDashboard },
  { label: "My Turfs",      href: "/dashboard/owner?tab=turfs", icon: Map },
  { label: "Add Turf",      href: "/dashboard/owner?tab=add", icon: PlusCircle },
  { label: "Bookings",     href: "/dashboard/owner?tab=bookings", icon: Calendar },
  { label: "Earnings",     href: "/dashboard/owner?tab=earnings", icon: BarChart3 },
  { label: "Profile",      href: "/dashboard/owner?tab=profile", icon: User },
  { label: "Settings",     href: "/dashboard/owner?tab=settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !user) return null;

  const links = user.role === "owner" ? OWNER_LINKS : CUSTOMER_LINKS;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-[#121A14] border-r border-gray-100 dark:border-white/5 z-50 flex flex-col transition-colors duration-500"
    >
      {/* Brand */}
      <div className={`h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-green-500/20">T</div>
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Turff</span>
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
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
              className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all relative group
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              {!isCollapsed && <span>{link.label}</span>}
              
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
