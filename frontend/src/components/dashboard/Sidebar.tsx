"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, Search, History, User, Settings, 
  Store, PlusCircle, Bell, LogOut, ShieldCheck, Zap,
  TrendingUp, Activity, Database, Globe, Palette,
  Calendar, Clock, BarChart3, Users, UsersRound, Wallet, CreditCard, Heart
} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useTheme, VIBES } from "../ThemeContext";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { vibe, setVibe } = useTheme();

  const currentTab = searchParams.get('tab');

  const menuItems = {
    customer: [
      { path: '/dashboard/user', icon: LayoutDashboard, label: 'Athlete Hub' },
      { path: '/turfs', icon: Search, label: 'Explore Arenas' },
      { path: '/dashboard/user?tab=matches', icon: Calendar, label: 'My Matches' },
      { path: '/dashboard/user?tab=favorites', icon: Heart, label: 'Favorite Sectors' },
      { path: '/dashboard/user?tab=history', icon: History, label: 'Transaction History' },
      { path: '/dashboard/user?tab=profile', icon: User, label: 'Identity Matrix' },
      { path: '/dashboard/user?tab=settings', icon: Settings, label: 'System Settings' },
    ],
    owner: [
      { path: '/dashboard/owner', icon: LayoutDashboard, label: 'Dashboard Overview' },
      { path: '/dashboard/owner?tab=profile', icon: User, label: 'My Profile & Venues' },
      { path: '/dashboard/owner?tab=customers', icon: Users, label: 'My Customers' },
      { path: '/dashboard/owner?tab=turfs', icon: Store, label: 'My Turf Management' },
      { path: '/dashboard/owner?tab=bookings', icon: Calendar, label: 'My Booking Calendar' },
      { path: '/dashboard/owner?tab=finance', icon: CreditCard, label: 'My Revenue & Payouts' },
      { path: '/dashboard/owner?tab=staff', icon: ShieldCheck, label: 'Staff Management' },
      { path: '/dashboard/owner?tab=marketing', icon: Zap, label: 'Promotions & Marketing' },
      { path: '/dashboard/owner?tab=maintenance', icon: Activity, label: 'Maintenance Hub' },
      { path: '/dashboard/owner?tab=inventory', icon: Database, label: 'Inventory & Rentals' },
      { path: '/dashboard/owner?tab=settings', icon: Settings, label: 'Application Settings' },
    ],
    admin: [
      { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Admin Terminal' },
      { path: '/dashboard/admin?tab=users', icon: UsersRound, label: 'User Governance' },
      { path: '/dashboard/admin?tab=turfs', icon: Database, label: 'Sectors & Venues' },
      { path: '/dashboard/admin?tab=payouts', icon: CreditCard, label: 'Payout Control' },
      { path: '/dashboard/admin?tab=approvals', icon: ShieldCheck, label: 'Owner Reviews' },
      { path: '/dashboard/admin?tab=history', icon: Bell, label: 'Platform Logs' },
      { path: '/dashboard/admin?tab=settings', icon: Settings, label: 'System Override' },
    ]
  };

  const items = user ? menuItems[(user.role === 'user' ? 'customer' : user.role) as keyof typeof menuItems] : [];

  return (
    <div className="flex flex-col h-full justify-between pb-10">
      <div className="space-y-10">
        <div className="space-y-4">
           <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 italic opacity-40">Main Protocol</div>
            <div className="grid gap-1">
               {items.map(item => {
                 // Precision Path Matching Protocol
                 const [basePath, searchQuerry] = item.path.split('?');
                 const itemTab = searchQuerry ? new URLSearchParams(searchQuerry).get('tab') : null;
                 
                 const isActive = (pathname === basePath && currentTab === itemTab);

                 return (
                   <Link 
                     key={item.label} 
                     href={item.path}
                     className={`flex items-center gap-5 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                       isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 italic' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary italic'
                     }`}
                   >
                     <item.icon className={`w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
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
                onClick={() => { logout(); window.location.href = "/"; }}
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
