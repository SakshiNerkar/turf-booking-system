"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RequireAuth } from "../../../components/RequireAuth";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { notify } from "../../../lib/toast";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";
import { 
  Users, Activity, Trophy, Shield, Zap, TrendingUp, CreditCard, 
  MapPin, Clock, Search, Filter, ArrowUpRight, CheckCircle2, 
  AlertCircle, LayoutDashboard, Database, Globe
} from "lucide-react";
import { ChartProtocol } from "@/components/dashboard/ChartProtocol";

type AdminTurf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; is_active: boolean; owner_name?: string; };
type AdminBooking = { id: string; total_price: string; payment_status: string; turf_name?: string; customer_name?: string; start_time?: string; };
type AdminRevenue = { total_amount: string };
type AdminUser = { id: string; name: string; email: string; role: string };

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [turfs, setTurfs] = useState<AdminTurf[] | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [revenue, setRevenue] = useState<AdminRevenue[] | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [tab, setTab] = useState<"overview" | "users" | "turfs" | "bookings">("overview");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!token) return;
      setLoading(true);
      const [tRes, bRes, rRes, uRes] = await Promise.all([
        apiFetch<AdminTurf[]>("/api/admin/turfs", { token }),
        apiFetch<AdminBooking[]>("/api/admin/bookings", { token }),
        apiFetch<AdminRevenue[]>("/api/admin/revenue", { token }),
        apiFetch<AdminUser[]>("/api/admin/users", { token }),
      ]);
      setLoading(false);
      setTurfs(tRes.ok ? tRes.data : []);
      setBookings(bRes.ok ? bRes.data : []);
      setRevenue(rRes.ok ? rRes.data : []);
      setUsers(uRes.ok ? uRes.data : []);
    })();
  }, [token]);

  const stats = useMemo(() => {
    const rev = (revenue ?? []).reduce((s, r) => s + Number(r.total_amount), 0);
    return {
      revenue: rev,
      users: users?.length ?? 0,
      bookings: bookings?.length ?? 0,
      turfs: turfs?.filter(t => t.is_active).length ?? 0,
      growth: "+12.4%" // Simulated
    };
  }, [revenue, users, bookings, turfs]);

  return (
    <RequireAuth roles={["admin"]}>
      <div className="space-y-10 pb-40">
        
        {/* 1. PLATFORM COMMAND HEADER */}
        <header className="bg-gray-900 dark:bg-white rounded-[4.5rem] p-16 text-white dark:text-gray-900 relative overflow-hidden group shadow-[0_60px_120px_rgba(0,0,0,0.2)] border border-white/5">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="px-6 py-2 bg-primary/20 text-primary text-[10px] font-black rounded-xl uppercase tracking-[0.4em] border border-primary/20 italic shadow-2xl">GLOBAL ADMIN OVERRIDE</span>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                 </div>
                 <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">{user?.name} COMMAND</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 leading-loose max-w-sm italic">PLATFORM INTEGRITY: 100% · GLOBAL NODES SYNCED · REGIONAL DATA STREAMS ACTIVE.</p>
              </div>

              {/* Sub-Navigation */}
              <div className="flex flex-wrap gap-4 bg-white/5 dark:bg-black/5 p-3 rounded-[2.5rem] border border-white/10 dark:border-black/10 backdrop-blur-3xl">
                 {[
                   { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                   { id: 'users', label: 'Users', icon: Users },
                   { id: 'turfs', label: 'Turfs', icon: Trophy },
                   { id: 'bookings', label: 'Registry', icon: Activity }
                 ].map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setTab(t.id as any)}
                     className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${tab === t.id ? 'bg-primary text-white shadow-2xl shadow-green-500/20 scale-105' : 'text-white/40 dark:text-gray-400 hover:text-white dark:hover:text-black'}`}
                   >
                      <t.icon className="w-5 h-5" /> {t.label}
                   </button>
                 ))}
              </div>
           </div>
           <div className="absolute -top-32 -right-32 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-[5s] pointer-events-none text-primary"><Shield className="w-[600px] h-[600px]" /></div>
        </header>

        {/* 2. OVERVIEW: BENTO GRID DASHBOARD */}
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="grid md:grid-cols-4 gap-10">
               
               {/* High Impact KPIs */}
               {[
                 { label: "Global Liquidity", value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "text-primary bg-primary/10", sub: "PLATFORM REVENUE" },
                 { label: "Acquisition Index", value: stats.users, icon: Users, color: "text-blue-500 bg-blue-500/10", sub: "USER REGISTRY" },
                 { label: "Operational Sectors", value: stats.turfs, icon: MapPin, color: "text-amber-500 bg-amber-500/10", sub: "ARENA ASSETS" },
                 { label: "Match Persistence", value: stats.bookings, icon: Zap, color: "text-purple-500 bg-purple-500/10", sub: "SYSTEM EXECUTION" }
               ].map((s, i) => (
                 <div key={i} className="bg-white dark:bg-[#121A14] rounded-[4rem] p-12 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all">
                    <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center mb-10 ${s.color} group-hover:rotate-6 transition-transform shadow-lg shadow-black/5`}>
                       <s.icon className="w-8 h-8" />
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 italic opacity-60 leading-none">{s.sub}</div>
                    <div className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase mb-6 leading-none">{s.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60 italic">{s.label}</div>
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-all pointer-events-none"><s.icon className="w-48 h-48" /></div>
                 </div>
               ))}

               {/* Advanced Analytics Chart Module */}
               <div className="md:col-span-3">
                  <ChartProtocol 
                    title="GLOBAL ENGAGEMENT VELOCITY"
                    subtitle="Platform match persistence trends"
                    data={[
                       { label: 'JAN', value: 124000 },
                       { label: 'FEB', value: 156000 },
                       { label: 'MAR', value: 142000 },
                       { label: 'APR', value: 198000 },
                       { label: 'MAY', value: 215000 },
                       { label: 'JUN', value: 204000 }
                    ]}
                  />
               </div>

               {/* System Integrity Sub-Panel */}
               <div className="bg-primary rounded-[4rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-green-500/20 flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl font-black italic tracking-tighter mb-8 uppercase leading-none">SYSTEM <br /> PERSISTENCE</h4>
                    <div className="space-y-8">
                       {[
                         { icon: Database, label: "99.99% Uptime", sub: "Operational" },
                         { icon: Globe, label: "12 Node Clusters", sub: "Active Sync" }
                       ].map((stat, i) => (
                         <div key={i} className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10"><stat.icon className="w-6 h-6" /></div>
                            <div>
                               <div className="text-[11px] font-black uppercase tracking-widest italic">{stat.label}</div>
                               <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mt-0.5">{stat.sub}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  <Link href="/turfs" className="px-10 py-5 bg-white text-primary text-[10px] font-black rounded-[1.25rem] uppercase tracking-widest text-center shadow-2xl hover:scale-105 transition-all italic mt-12 underline underline-offset-4 decoration-2">PLATFORM REGISTRY</Link>
                  <div className="absolute -bottom-16 -right-16 opacity-10 group-hover:scale-110 transition-all duration-[4s] pointer-events-none"><CheckCircle2 className="w-[300px] h-[300px]" /></div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. DATA TABLES (Registry Management) */}
        {tab !== "overview" && (
           <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex items-end justify-between px-6">
                 <div className="space-y-4">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">System {tab.toUpperCase()} Registry</h2>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">
                       GLOBAL ACCESS PROTOCOL · {tab.toUpperCase()} LOG SYNCED
                    </div>
                 </div>
                 <div className="relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-all" />
                    <input 
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={`Filter global ${tab} registry...`}
                      className="w-[450px] pl-20 pr-10 py-5 bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-primary/5 transition-all shadow-2xl shadow-black/[0.02]"
                    />
                 </div>
              </div>

              <div className="bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 shadow-[0_80px_160px_rgba(0,0,0,0.1)] overflow-hidden p-12">
                 {loading ? [1,2,3,4].map(i => <SkeletonRow key={i} />) : (
                    <div className="space-y-4">
                       {(tab === "turfs" ? turfs : tab === "bookings" ? bookings : users)?.slice(0, 15).map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-10 bg-gray-50/50 dark:bg-white/2 rounded-[3.5rem] border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/5 transition-all group shadow-sm hover:shadow-2xl">
                             <div className="flex items-center gap-10">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-white dark:bg-black flex items-center justify-center text-4xl shadow-xl group-hover:rotate-12 transition-all border border-gray-100 dark:border-white/5">{item.name?.[0] || item.turf_name?.[0] || item.customer_name?.[0] || "U"}</div>
                                <div>
                                   <div className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none mb-3 group-hover:text-primary transition-colors">{item.name || item.turf_name || item.customer_name}</div>
                                   <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                                      <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> ID: {item.id.slice(0, 12)}</span>
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
                                      <span className="flex items-center gap-2 underline decoration-2 underline-offset-4"><MapPin className="w-4 h-4" /> {item.location || 'GLOBAL'}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-16 px-10 border-l border-gray-100 dark:border-white/5 h-20">
                                <div className="text-right">
                                   <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-1 leading-none">{item.role || item.payment_status || (item.is_active ? 'ENABLED' : 'DISABLED')}</div>
                                   <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-40 leading-none">PROTOCOL STATUS</div>
                                </div>
                                <button className="p-6 rounded-[1.5rem] bg-white dark:bg-black border border-gray-100 dark:border-white/10 text-gray-400 hover:text-primary transition-all shadow-xl hover:scale-110 active:scale-95"><ArrowUpRight className="w-6 h-6" /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </motion.section>
        )}
      </div>
    </RequireAuth>
  );
}
