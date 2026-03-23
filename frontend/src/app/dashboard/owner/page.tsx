"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  TrendingUp, Users, Calendar, Store, PlusCircle, ArrowUpRight, 
  MapPin, Clock, Star, Zap, LayoutDashboard, Database, Globe, 
  Settings, ArrowRight, ShieldCheck, Target, Sparkles, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow, EmptyState } from "../../../components/Skeletons";
import { MiniSparkline } from "../../../components/dashboard/MiniSparkline";
import { useRouter } from "next/navigation";

export default function OwnerDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [turfs, setTurfs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_revenue: 0, total_bookings: 0, occupancy: 85 });

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const [tRes, bRes] = await Promise.all([
      apiFetch<any[]>("/api/turfs/owner"),
      apiFetch<any[]>("/api/bookings/owner")
    ]);
    if (tRes.ok) setTurfs(tRes.data);
    if (bRes.ok) {
       setBookings(bRes.data);
       setStats(prev => ({ ...prev, total_bookings: bRes.data.length, total_revenue: bRes.data.reduce((s: any, b: any) => s + Number(b.total_price), 0) }));
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [user, token]);

  if (!user) return null;

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. SECTOR OVERVIEW (Strategic) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-4">
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="px-5 py-2 bg-primary/10 text-primary text-[9px] font-black rounded-xl uppercase tracking-[0.4em] italic shadow-sm">Region: Operational Alpha</span>
               <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase text-gray-900 dark:text-white">Venue <span className="text-primary">Ops</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 leading-loose max-w-sm italic">Operational asset management for Regional Domain {user.id.slice(0, 8)}.</p>
         </div>
         
         <Link href="/dashboard/owner?tab=add" className="btn-primary px-12 py-5 text-sm shadow-[0_20px_40px_rgba(34,197,94,0.3)]">
            <PlusCircle className="w-6 h-6" /> INITIALIZE ASSET
         </Link>
      </header>

      {/* 2. REVENUE CORE (Clean & Tactical) */}
      <section className="grid sm:grid-cols-3 gap-8 px-4">
         {[
           { label: 'Total Energy', value: `₹${stats.total_revenue}`, icon: Zap, color: 'bg-primary', trend: '+14% Protocol Sync' },
           { label: 'Occupancy Rate', value: `${stats.occupancy}%`, icon: Target, color: 'bg-amber-500', trend: 'Stabilized Sector' },
           { label: 'Active Sessions', value: stats.total_bookings, icon: Globe, color: 'bg-blue-500', trend: 'Match Synchronized' }
         ].map((s, i) => (
           <div key={i} className="card-premium p-10 flex flex-col justify-between h-64 border-transparent hover:border-primary/20 transition-all hover:-translate-y-4">
              <div className="flex items-center justify-between">
                 <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-xl shadow-black/10`}><s.icon className="w-6 h-6" /></div>
                 <div className="text-[9px] font-black text-primary uppercase tracking-widest italic">{s.trend}</div>
              </div>
              <div className="space-y-2">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">{s.label}</div>
                 <div className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{s.value}</div>
                 <div className="w-full h-8 mt-4"><MiniSparkline color={s.color === 'bg-primary' ? '#2E7D32' : s.color === 'bg-amber-500' ? '#f59e0b' : '#3b82f6'} /></div>
              </div>
           </div>
         ))}
      </section>

      {/* 3. ASSET REGISTRY (Simple Vertical Cards) */}
      <section className="px-4 space-y-12">
         <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Venue Assets</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest underline underline-offset-8 italic decoration-primary/20 decoration-2">VIEW ALL NODES</button>
         </div>

         {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
         ) : turfs.length === 0 ? (
           <EmptyState title="No Assets Assigned" sub="You haven't initialized any regional arena protocols yet. Domain expansion is required." icon={Database} actionLabel="INITIALIZE ASSET" />
         ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {turfs.map(t => (
                <div key={t.id} className="card-premium group relative flex flex-col h-[480px] border-transparent hover:border-primary/20 overflow-hidden">
                   <div className="h-1/2 relative">
                      <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
                      <div className="absolute top-8 right-8 px-5 py-2 bg-primary text-white text-[9px] font-black rounded-xl uppercase tracking-widest italic group-hover:scale-110 transition-transform">OPERATIONAL SECTOR</div>
                   </div>
                   <div className="p-8 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                         <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic truncate leading-none mb-1">{t.name}</h4>
                         <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 tracking-widest uppercase italic opacity-60"><MapPin className="w-4 h-4 text-primary" /> {t.location}</div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                         <div className="flex items-center gap-6">
                            <div className="text-center">
                               <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Utilization</div>
                               <div className="text-sm font-black text-gray-900 dark:text-white italic">85%</div>
                            </div>
                            <div className="text-center">
                               <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Rating</div>
                               <div className="text-sm font-black text-gray-900 dark:text-white italic">★ 4.98</div>
                            </div>
                         </div>
                         <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white transition-all"><Settings className="w-5 h-5" /></button>
                      </div>
                   </div>
                   <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary/20 overflow-hidden"><div className="h-full bg-primary w-4/5 animate-pulse" /></div>
                </div>
              ))}
           </div>
         )}
      </section>

      {/* 4. ACTIVITY & TELEMETRY (Simplified Logs) */}
      <section className="px-4 space-y-10">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Activity Stream</h3>
               <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic opacity-40">REAL-TIME MATCH PROTOCOL LOGS</div>
            </div>
            <button className="p-4 rounded-2xl bg-white dark:bg-[#1a241c] border border-gray-100 dark:border-white/5 text-gray-400 hover:text-primary transition-all shadow-sm"><Filter className="w-5 h-5" /></button>
         </div>

         {loading ? (
            <div className="space-y-6">
               {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
            </div>
         ) : bookings.length === 0 ? (
           <EmptyState title="No Active Signals" sub="Your regional domain is currently idling. Awaiting match initialization packets." icon={Clock} />
         ) : (
           <div className="space-y-6">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="card-premium p-8 group flex items-center justify-between gap-8 h-32 border-transparent hover:border-primary/20">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-black flex items-center justify-center text-gray-900 dark:text-white shadow-inner group-hover:rotate-12 transition-all duration-700 font-black italic text-xl">⚡</div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-black text-gray-900 dark:text-white italic leading-none">{b.customer_name || 'Protocol User'} confirmed match at {b.turf_name}</h4>
                         <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                            <Clock className="w-4 h-4 text-primary" /> {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · REGIONAL ZONE Alpha
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter">₹{b.total_price}</div>
                      <div className="text-[8px] font-black text-primary uppercase tracking-widest italic mt-1 leading-none opacity-40">COMMISSION: ₹{(Number(b.total_price) * 0.1).toFixed(0)}</div>
                   </div>
                </div>
              ))}
           </div>
         )}
      </section>

    </div>
  );
}

function Link({ children, ...props }: any) {
  return <a {...props} className={props.className}>{children}</a>;
}
