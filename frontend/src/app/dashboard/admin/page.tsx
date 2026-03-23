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
  AlertCircle, LayoutDashboard, Database, Globe, Settings
} from "lucide-react";
import { ChartProtocol } from "@/components/dashboard/ChartProtocol";

type AdminData = { users: any[]; turfs: any[]; bookings: any[]; revenue: number };

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<AdminData>({ users: [], turfs: [], bookings: [], revenue: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const [u, t, b] = await Promise.all([
      apiFetch<any[]>("/api/users"),
      apiFetch<any[]>("/api/turfs"),
      apiFetch<any[]>("/api/bookings")
    ]);
    if (u.ok && t.ok && b.ok) {
       setData({ 
         users: u.data, 
         turfs: t.data, 
         bookings: b.data, 
         revenue: b.data.reduce((s, x) => s + Number(x.total_price), 0) 
       });
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [user, token]);

  if (!user) return null;

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. ADMIN PROTOCOL HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-4">
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="px-5 py-2 bg-primary/10 text-primary text-[9px] font-black rounded-xl uppercase tracking-[0.4em] italic shadow-sm">Superuser Integrity Verified</span>
               <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase text-gray-900 dark:text-white">Admin <span className="text-primary">Domain</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 leading-loose max-w-sm italic">Universal regional monitoring and sector override protocols.</p>
         </div>
         
         <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#1a241c] p-3 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
            {['Overview', 'Users', 'Sectors', 'Revenue'].map(t => (
              <button key={t} className="px-8 py-3.5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all text-gray-400 hover:text-primary hover:bg-white/5">{t}</button>
            ))}
         </div>
      </header>

      {/* 2. UNIVERSAL TELEMETRY (Simplification) */}
      <section className="grid sm:grid-cols-4 gap-8 px-4">
         {[
           { label: 'Platform Users', value: data.users.length, icon: Users, color: 'bg-primary' },
           { label: 'Active Sectors', value: data.turfs.length, icon: Database, color: 'bg-blue-500' },
           { label: 'Global Revenue', value: `₹${(data.revenue/1000).toFixed(1)}K`, icon: Zap, color: 'bg-amber-500' },
           { label: 'Sync Health', value: '99.9%', icon: Activity, color: 'bg-purple-500' }
         ].map((s, i) => (
           <div key={i} className="card-premium p-10 flex flex-col justify-between h-56 border-transparent hover:border-primary/20 transition-all hover:scale-105">
              <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-xl shadow-black/10`}><s.icon className="w-6 h-6" /></div>
              <div className="space-y-2">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">{s.label}</div>
                 <div className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{s.value}</div>
              </div>
           </div>
         ))}
      </section>

      {/* 3. REVENUE VISUALIZATION (Simple Chart) */}
      <section className="px-4">
         <div className="card-premium p-12 space-y-12">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Global Economic Flow</h3>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic opacity-40 leading-none">REAL-TIME MATCH COMMISSION PROTOCOL</div>
               </div>
               <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-lg">LIVE SYNC</span>
               </div>
            </div>
            <div className="h-96 w-full">
               <ChartProtocol 
                 data={[
                   { label: 'MON', value: 4500 },
                   { label: 'TUE', value: 5200 },
                   { label: 'WED', value: 6100 },
                   { label: 'THU', value: 4800 },
                   { label: 'FRI', value: 7200 },
                   { label: 'SAT', value: 9500 },
                   { label: 'SUN', value: 8800 }
                 ]} 
                 title="Revenue Protocol" 
                 subtitle="GLOBAL ECONOMIC FLOW" 
               />
            </div>
         </div>
      </section>

      {/* 4. RECENT ACTIVITY LOGS (Core Focus) */}
      <section className="px-4 space-y-12">
         <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Regional Telemetry</h3>
            <div className="flex items-center gap-8">
               <div className="hidden lg:flex relative group w-[300px]">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-extrabold group-focus-within:text-primary" />
                  <input placeholder="Search Registry..." className="w-full pl-14 pr-6 py-4 bg-white dark:bg-[#1a241c] border border-gray-100 dark:border-white/5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all italic" />
               </div>
               <button className="text-[10px] font-black text-primary uppercase tracking-widest underline underline-offset-8 italic decoration-primary/20 decoration-2">ACCESS ALL LOGS</button>
            </div>
         </div>

         {loading ? (
            <div className="space-y-6">
               {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
            </div>
         ) : (
           <div className="space-y-6">
              {data.bookings.slice(0, 8).map(b => (
                <div key={b.id} className="card-premium p-8 group flex items-center justify-between gap-8 h-32 border-transparent hover:border-primary/20 transition-all">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-black flex items-center justify-center text-gray-400 group-hover:text-primary transition-all shadow-inner font-extrabold italic text-xl">📄</div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none italic">{b.turf_name} · Engagement ID: {b.id.slice(0, 8)}</h4>
                         <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                            <Clock className="w-4 h-4 text-primary" /> Region Sector V · {new Date(b.start_time).toLocaleDateString()} · High Priority
                         </div>
                      </div>
                   </div>
                   <div className="text-right flex items-center gap-10">
                      <div>
                         <div className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter">₹{b.total_price} PROCESSED</div>
                         <div className={`text-[8px] font-black uppercase tracking-widest italic mt-1 leading-none ${b.payment_status === 'paid' ? 'text-primary' : 'text-amber-500'}`}>{b.payment_status} PROTOCOL</div>
                      </div>
                      <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-primary group-hover:text-white transition-all"><Settings className="w-5 h-5" /></button>
                   </div>
                </div>
              ))}
           </div>
         )}
      </section>

    </div>
  );
}
