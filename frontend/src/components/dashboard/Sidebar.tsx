"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Search, History, User, Settings, 
  Store, PlusCircle, Bell, LogOut, ShieldCheck, Zap,
  TrendingUp, Activity, Database, Globe, Palette
} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useTheme, VIBES } from "../ThemeContext";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { vibe, setVibe } = useTheme();

  const menuItems = {
    customer: [
      { path: '/dashboard/customer', icon: LayoutDashboard, label: 'Overview' },
      { path: '/turfs', icon: Search, label: 'Discover' },
      { path: '/dashboard/customer/history', icon: History, label: 'History' },
      { path: '/dashboard/customer?tab=profile', icon: User, label: 'Identity' },
      { path: '/dashboard/customer?tab=settings', icon: Settings, label: 'System' },
    ],
    owner: [
      { path: '/dashboard/owner', icon: LayoutDashboard, label: 'Ops center' },
      { path: '/dashboard/owner?tab=turfs', icon: Store, label: 'Arenas' },
      { path: '/dashboard/owner?tab=add', icon: PlusCircle, label: 'Initialize' },
      { path: '/dashboard/owner?tab=earnings', icon: TrendingUp, label: 'Energy' },
      { path: '/dashboard/owner?tab=profile', icon: User, label: 'Identity' },
    ],
    admin: [
      { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Global' },
      { path: '/dashboard/admin?tab=users', icon: Globe, label: 'Users' },
      { path: '/dashboard/admin?tab=turfs', icon: Database, label: 'Sectors' },
      { path: '/dashboard/admin?tab=history', icon: Bell, label: 'Logs' },
      { path: '/dashboard/admin?tab=settings', icon: Settings, label: 'Override' },
    ]
  };

  const items = user ? menuItems[user.role as keyof typeof menuItems] : [];

  return (
    <div className="flex flex-col h-full justify-between pb-10">
      <div className="space-y-10">
        <div className="space-y-4">
           <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 italic opacity-40">Main Protocol</div>
           <div className="grid gap-1">
              {items.map(item => {
                const searchParamsString = typeof window !== 'undefined' ? window.location.search : '';
                const currentFullVisiblePath = pathname + searchParamsString;
                
                // Exact match for the path + params OR if it's the base path and item is 'Overview/Global'
                const isActive = (currentFullVisiblePath === item.path) || 
                                (item.path === '/dashboard/admin' && currentFullVisiblePath === '/dashboard/admin');

                return (
                  <Link 
                    key={item.label} 
                    href={item.path}
                    className={`flex items-center gap-5 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 italic' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary italic'
                    }`}
                  >
                    <item.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                );
              })}
           </div>
        </div>

        {/* Theme Vibe Selector */}
        <div className="space-y-4">
           <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 italic opacity-40">Identity Vibe</div>
           <div className="flex flex-wrap gap-2 px-2">
              {VIBES.map(v => (
                 <button 
                    key={v.name} 
                    onClick={() => setVibe(v)}
                    className={`w-6 h-6 rounded-full border-2 transition-all p-0.5 ${vibe.name === v.name ? 'border-primary ring-2 ring-primary/20 scale-125 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    title={v.name}
                 >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: v.color }} />
                 </button>
              ))}
           </div>
        </div>

        <div className="space-y-4">
           <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 italic opacity-40">Operational</div>
           <div className="grid gap-1">
              <Link href="/" className="flex items-center gap-5 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary transition-all italic">
                 <Globe className="w-4 h-4 opacity-40" /> Public Site
              </Link>
              <button 
                onClick={() => { logout(); router.push('/'); }}
                className="flex items-center gap-5 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all italic"
              >
                 <LogOut className="w-4 h-4" /> Terminate
              </button>
           </div>
        </div>
      </div>

      {/* Profile Mini Card */}
      <div className="mt-10 p-4 bg-gray-50 dark:bg-black/40 rounded-[1.5rem] border border-gray-100 dark:border-white/5 flex items-center gap-3 transition-all">
         <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black italic shadow-lg shadow-primary/20">{user?.name[0]}</div>
         <div className="overflow-hidden">
            <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase truncate italic leading-none">{user?.name}</div>
            <div className="text-[8px] font-black text-primary uppercase tracking-widest opacity-60 leading-none mt-1">Operational</div>
         </div>
      </div>
    </div>
  );
}
