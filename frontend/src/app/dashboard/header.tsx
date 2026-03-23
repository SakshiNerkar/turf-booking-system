"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, User, Settings, LogOut, MapPin, ChevronDown, Sparkles, Globe, Zap, History, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import { useState, useEffect } from "react";

const getTitle = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last || last === 'dashboard') return 'Global Overview';
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
};

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Pune");

  if (!user) return null;

  return (
    <header className="h-24 flex items-center justify-between px-8 lg:px-12 border-b border-gray-100 dark:border-white/5 bg-white/60 dark:bg-[#0B0F0C]/60 backdrop-blur-3xl sticky top-0 z-40 transition-all duration-500 shadow-sm">
      <div className="flex items-center gap-8">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none">
                {getTitle(pathname)}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
           </div>
           <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 group cursor-default">
              <span className="hover:text-primary transition-colors">Turff</span>
              <span className="opacity-20 text-[12px]">/</span>
              <span className="text-primary italic">{user.role} Domain</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Universal Search Bar */}
        <div className="hidden xl:flex relative group w-[400px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-black group-focus-within:text-primary transition-all" />
          <input 
            type="text" 
            placeholder="Search venue protocols, matches, id..." 
            className="w-full pl-16 pr-6 py-4 bg-gray-100/50 dark:bg-white/5 border border-transparent rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Location Selector Pill */}
        <div className="hidden lg:relative lg:block">
           <button 
             onClick={() => setShowLocations(!showLocations)}
             className="flex items-center gap-4 px-6 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hover:border-primary/20 transition-all shadow-sm"
           >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="italic">{selectedCity}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showLocations ? 'rotate-180' : ''}`} />
           </button>
           
           <AnimatePresence>
              {showLocations && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-4 right-0 w-64 p-4 bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-2xl z-50 overflow-hidden shadow-black/10">
                    <div className="px-4 pb-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-4">Select Zone</div>
                    {["Pune", "Mumbai", "Bengaluru", "Delhi NCR"].map(city => (
                       <button key={city} onClick={() => { setSelectedCity(city); setShowLocations(false); }} className={`flex items-center justify-between w-full p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCity === city ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                          {city}
                          {selectedCity === city && <Sparkles className="w-3 h-3" />}
                       </button>
                    ))}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Tactical Counters */}
        <div className="hidden md:flex items-center gap-4 px-6 border-l border-gray-100 dark:border-white/5">
           <motion.button 
             whileHover={{ scale: 1.1 }}
             className="relative p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-white/5"
           >
             <Bell className="w-5 h-5 flex-shrink-0" />
             <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F0C]" />
           </motion.button>
        </div>

        {/* Global Identity Module */}
        <div className="relative">
          <motion.button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-4 p-2 pl-4 rounded-[2rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-105 transition-all shadow-2xl shadow-black/10 group h-14"
          >
            <div className="text-right flex-col hidden sm:flex">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none group-hover:text-primary transition-colors italic">{user.name.split(' ')[0]}</span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mt-1">Operational</span>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-6 w-72 p-6 bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden shadow-black/10"
              >
                <div className="px-2 pb-6 flex items-center gap-4 border-b border-gray-100 dark:border-white/5 mb-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">{user.name[0]}</div>
                   <div>
                      <div className="text-sm font-black text-gray-900 dark:text-white uppercase italic">{user.name}</div>
                      <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-1">{user.role} Rank</div>
                   </div>
                </div>
                
                <div className="grid gap-2">
                   {[
                     { label: 'Platform Settings', icon: Globe, href: pathname + '?tab=settings' },
                     { label: 'Security Protocols', icon: zap, href: pathname + '?tab=settings' },
                     { label: 'Tactical Logs', icon: History, href: pathname + '?tab=history' },
                     { label: 'Control Center', icon: LayoutDashboard, href: `/dashboard/${user.role}` }
                   ].map(item => (
                      <button key={item.label} onClick={() => { setShowProfile(false); router.push(item.href); }} className="flex items-center gap-4 w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all italic">
                        <item.icon className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                        {item.label}
                      </button>
                   ))}
                </div>
                <div className="my-4 border-t border-gray-100 dark:border-white/5" />
                <button 
                  onClick={() => { logout(); router.push("/"); }}
                  className="flex items-center gap-4 w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all italic"
                >
                  <LogOut className="w-4 h-4" />
                  Terminate Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

const zap = Zap;
