"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import { useState } from "react";

const getTitle = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last || last === 'dashboard') return 'Overview';
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
};

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5 bg-white/70 dark:bg-[#0B0F0C]/70 backdrop-blur-xl sticky top-0 z-40 transition-all duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            {getTitle(pathname)}
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 group cursor-default">
            <span>Turff</span>
            <span className="opacity-30">/</span>
            <span className="text-primary">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-black group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search bookings, turfs..." 
            className="w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl text-sm font-medium outline-none focus:border-primary/30 focus:bg-white dark:focus:bg-[#121A14] transition-all"
          />
        </div>

        {/* Notifications */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F0C]" />
        </motion.button>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ y: -1 }}
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 transition-all shadow-sm"
          >
            <div className="text-right flex-col hidden sm:flex">
              <span className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none">{user.name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mt-1">{user.role}</span>
            </div>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-green-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </motion.button>

          {/* Profile Dropdown */}
          {showProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-3 w-56 p-2 bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl z-50 overflow-hidden shadow-black/10"
            >
              <button className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <button className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Settings className="w-4 h-4" />
                Preferences
              </button>
              <div className="my-1.5 border-t border-gray-100 dark:border-white/5" />
              <button className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />
                Power Off
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
