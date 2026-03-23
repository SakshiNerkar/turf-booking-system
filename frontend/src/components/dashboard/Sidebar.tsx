"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Search, History, User, Settings, 
  Store, PlusCircle, Bell, LogOut, ShieldCheck, Zap,
  TrendingUp, Activity, Database, Globe
} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

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
      <div className="space-y-12">
        <div className="space-y-4">
           <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 italic opacity-40">Main Protocol</div>
           <div className="grid gap-2">
              {items.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.label} 
                    href={item.path}
                    className={`flex items-center gap-6 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-green-500/20 scale-105 italic' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary italic'
                    }`}
                  >
                    <item.icon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                );
              })}
           </div>
        </div>

        <div className="space-y-4">
           <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 italic opacity-40">Operational</div>
           <div className="grid gap-2">
              <Link href="/" className="flex items-center gap-6 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary transition-all italic">
                 <Globe className="w-5 h-5 opacity-40" /> Public Site
              </Link>
              <button 
                onClick={() => { logout(); router.push('/'); }}
                className="flex items-center gap-6 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all italic"
              >
                 <LogOut className="w-5 h-5" /> Terminate
              </button>
           </div>
        </div>
      </div>

      {/* Profile Mini Card */}
      <div className="mt-20 p-6 bg-gray-50 dark:bg-black/40 rounded-[2rem] border border-gray-100 dark:border-white/5 flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
         <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black italic shadow-lg shadow-green-500/20">{user?.name[0]}</div>
         <div className="overflow-hidden">
            <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase truncate italic">{user?.name}</div>
            <div className="text-[8px] font-black text-primary uppercase tracking-widest opacity-60 leading-none mt-1">Operational</div>
         </div>
      </div>
    </div>
  );
}
