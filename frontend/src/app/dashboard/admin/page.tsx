"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { 
  Users, Activity, Trophy, Shield, Zap, TrendingUp, CreditCard, 
  MapPin, Clock, Search, Filter, ArrowUpRight, CheckCircle2, 
  AlertCircle, Database, LayoutDashboard, Globe, Settings, Map
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";
import { ChartProtocol } from "@/components/dashboard/ChartProtocol";
import { Navbar } from "@/components/Navbar";

type AdminData = { users: any[]; turfs: any[]; bookings: any[]; revenue: number };

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<AdminData>({ users: [], turfs: [], bookings: [], revenue: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<any>("/api/dashboards/admin");
    if (res.ok) {
       setData({ 
         users: Array(res.data.totalUsers || 0).fill({}), 
         turfs: Array(res.data.totalTurfs || 0).fill({}), 
         bookings: [], 
         revenue: 0 
       });
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [user, token]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F0C] transition-colors duration-300 pb-32 md:pb-16 relative">
      <Navbar />

      <div className="container-compact py-8 md:py-12 space-y-12">
        
        {/* COMPACT ADMIN HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-red-500/20 flex items-center gap-1.5"><Shield className="w-3 h-3" /> System Administrator Active</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Global <span className="text-primary italic">Command</span></h1>
              <p className="text-sm font-medium text-gray-500">Universal platform tracking, rapid overrides, and regional monitoring protocols.</p>
           </div>
           
           <div className="flex items-center gap-3">
              {['Overview', 'Users', 'Turfs'].map(t => (
                <button key={t} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${t==='Overview' ? 'bg-white dark:bg-card border border-border text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 border border-transparent'}`}>{t}</button>
              ))}
           </div>
        </header>

        {/* HIGH VELOCITY TELEMETRY (4 Grids) */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Registered Athletes', value: data.users.length, icon: Users, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', trend: '+12% (30d)' },
             { label: 'Verified Arenas', value: data.turfs.length, icon: Map, color: 'text-primary bg-primary/10 border-primary/20', trend: '+5% (30d)' },
             { label: 'Platform Volume', value: `₹${(data.revenue/1000).toLocaleString()}K`, icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', trend: '+28% (30d)' },
             { label: 'System Health', value: '100%', icon: Activity, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', trend: 'Optimal' }
           ].map((s, i) => (
             <div key={i} className="card-compact p-6 flex flex-col justify-between h-44 border border-border group hover:border-primary/30 transition-all shadow-sm">
                <div className="flex items-start justify-between">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-sm ${s.color}`}>
                      <s.icon className="w-5 h-5" />
                   </div>
                   <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">{s.trend}</div>
                </div>
                <div className="space-y-1 mt-4">
                   <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
                   <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">{s.value}</div>
                </div>
             </div>
           ))}
        </section>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
           
           {/* REVENUE VISUALIZATION & LOGS */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              
              <div className="card-compact p-8 space-y-8 bg-white dark:bg-[#121A14]">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-primary" /> Transacted Volume
                    </h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm">Live Sync</span>
                 </div>
                 
                 <div className="h-[300px] w-full bg-gray-50/50 dark:bg-[#0B0F0C] border border-border rounded-2xl flex items-center justify-center shadow-inner">
                    <ChartProtocol 
                      data={[
                        { label: 'WK 1', value: 4500 },
                        { label: 'WK 2', value: 5200 },
                        { label: 'WK 3', value: 6100 },
                        { label: 'WK 4', value: 8800 }
                      ]} 
                      title="Monthly Revenue" 
                      subtitle="Gross Platform Economics" 
                    />
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                       <Database className="w-5 h-5 text-gray-400" /> Platform Event Feed
                    </h3>
                 </div>

                 {loading ? (
                   <div className="space-y-4">{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>
                 ) : (
                   <div className="space-y-3">
                      {data.bookings.slice(0, 6).map(b => (
                        <div key={b.id} className="card-compact p-5 flex items-center justify-between gap-4 group hover:bg-gray-50 dark:hover:bg-[#17221A] transition-all border border-border/50">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-black border border-border flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                 <Clock className="w-5 h-5" />
                              </div>
                              <div className="space-y-1 font-semibold truncate max-w-[200px] sm:max-w-xs">
                                 <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{b.turf_name}</h4>
                                 <div className="text-[10px] text-gray-500 uppercase tracking-widest truncate">TXN ID: {b.id.slice(0, 12)}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-black text-gray-900 dark:text-gray-100">₹{b.total_price}</div>
                              <div className={`text-[9px] font-bold uppercase tracking-widest ${b.status === 'confirmed' ? 'text-primary' : 'text-amber-500'}`}>
                                 {b.status}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
           
           {/* RIGHT COLUMN INFO STRIP */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="card-compact p-8 space-y-6 sticky top-24 bg-white dark:bg-[#121A14]">
                 <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">System Status</h3>
                    <p className="text-sm font-medium text-gray-500">All regional services operational.</p>
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t border-border">
                    {[
                      { l: 'Auth Services', s: 'green', v: '99.9%' },
                      { l: 'Payment Gate', s: 'green', v: '100%' },
                      { l: 'Match Grid', s: 'green', v: '99.8%' }
                    ].map((k,i)=>(
                      <div key={i} className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#0B0F0C] p-3 rounded-lg border border-border">
                         <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" /> {k.l}</span>
                         <span>{k.v}</span>
                      </div>
                    ))}
                 </div>

                 <button className="btn-secondary w-full text-xs box-border mt-4">Run Diagnostics</button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
