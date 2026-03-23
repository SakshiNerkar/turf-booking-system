"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, Search, History, Star, Clock, MapPin, 
  ArrowRight, Users, Zap, ShieldCheck, Target, Sparkles, 
  Calendar, CreditCard, LayoutDashboard
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow, EmptyState } from "../../../components/Skeletons";

type Booking = { id: string; turf_name: string; start_time: string; end_time: string; total_price: string; status: string; };

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch<Booking[]>("/api/bookings/customer");
      setLoading(false);
      if (res.ok) setBookings(res.data);
    })();
  }, []);

  const stats = useMemo(() => [
    { label: 'Active Matches', value: bookings.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'bg-primary' },
    { label: 'Total Energy', value: `₹${bookings.reduce((s, b) => s + Number(b.total_price), 0)}`, icon: Zap, color: 'bg-amber-500' },
    { label: 'Match History', value: bookings.length, icon: History, color: 'bg-blue-500' }
  ], [bookings]);

  if (!user) return null;

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. SECTOR HEADER (Mobile-First Stacking) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-4">
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="px-5 py-2 bg-primary/10 text-primary text-[9px] font-black rounded-xl uppercase tracking-[0.4em] italic shadow-sm">Sync Status: Optimal</span>
               <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase text-gray-900 dark:text-white">Domain <span className="text-primary">Control</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 leading-loose max-w-sm italic">Operational match registry for User {user.id.slice(0, 8)}.</p>
         </div>
         
         <Link href="/turfs" className="btn-primary px-12 py-5 text-sm shadow-[0_20px_40px_rgba(34,197,94,0.3)]">
            <PlusCircle className="w-6 h-6" /> NEW ENGAGEMENT
         </Link>
      </header>

      {/* 2. STATS CLUSTER (Tactical Grid) */}
      <section className="grid sm:grid-cols-3 gap-8 px-4">
         {loading ? [1,2,3].map(i => <SkeletonStat key={i} />) : stats.map((s, i) => (
           <div key={i} className="card-premium p-10 flex flex-col justify-between h-56 border-transparent hover:border-primary/20 hover:scale-105">
              <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-xl shadow-black/10`}><s.icon className="w-6 h-6" /></div>
              <div className="space-y-2">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">{s.label}</div>
                 <div className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{s.value}</div>
              </div>
           </div>
         ))}
      </section>

      {/* 3. CORE REGISTRY (Simplified Vertical List) */}
      <section className="px-4 space-y-10">
         <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Booking Protocol</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest underline underline-offset-8 italic decoration-primary/20 decoration-2">VIEW ALL RECORDS</button>
         </div>

         {loading ? (
           <div className="space-y-6">
              {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
           </div>
         ) : bookings.length === 0 ? (
           <EmptyState title="No Records Yet" sub="You haven't initialized any matches. Proceed to the sector discovery hub." icon={Calendar} actionLabel="DISCOVER SECTORS" actionLink="/turfs" />
         ) : (
           <div className="space-y-6">
              {bookings.map(b => (
                <div key={b.id} className="card-premium p-8 group flex items-center justify-between gap-8 hover:bg-white dark:hover:bg-[#1a241c] hover:border-primary/20">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-[1.75rem] bg-gray-50 dark:bg-black flex items-center justify-center text-gray-900 dark:text-white shadow-inner group-hover:rotate-12 transition-transform duration-700 font-extrabold italic text-2xl">🏟️</div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none italic">{b.turf_name}</h4>
                         <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                            <Clock className="w-4 h-4 text-primary" /> {new Date(b.start_time).toLocaleDateString()} · {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-10">
                      <div className="text-right hidden sm:block">
                         <div className="text-xs font-black text-gray-900 dark:text-white italic tracking-tighter">₹{b.total_price}</div>
                         <div className={`text-[8px] font-black uppercase tracking-widest italic mt-1 ${b.status === 'confirmed' ? 'text-primary' : 'text-amber-500'}`}>{b.status} PROTOCOL</div>
                      </div>
                      <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><ArrowRight className="w-5 h-5" /></button>
                   </div>
                </div>
              ))}
           </div>
         )}
      </section>

      {/* 4. AI RECOMMENDATIONS (Clean) */}
      <section className="px-4 py-16 bg-white dark:bg-black/20 rounded-[5rem] border border-gray-100 dark:border-white/5 space-y-12">
          <div className="flex items-center gap-6 px-10">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Sparkles className="w-6 h-6" /></div>
             <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Sector Discovery <span className="text-primary italic">AI</span></h3>
          </div>
          <p className="px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic opacity-60 leading-loose max-w-lg">Synthetic analysis suggests these regional arenas align with your historical engagement frequency.</p>
          <div className="grid md:grid-cols-3 gap-10 px-10">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                   <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black overflow-hidden shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <div className="text-sm font-black text-gray-900 dark:text-white uppercase italic leading-none mb-1">Elite Sector {i}</div>
                      <div className="text-[8px] font-black text-primary uppercase tracking-widest opacity-60 italic">98% Match Sync</div>
                   </div>
                </div>
              ))}
          </div>
      </section>

    </div>
  );
}
