"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PlusCircle, History, Clock, MapPin, ArrowRight, Zap, Target,
  Calendar, CreditCard, Heart, Trophy, Activity, RotateCw
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow, EmptyState } from "../../../components/Skeletons";
import { Navbar } from "@/components/Navbar";

type Booking = { 
  id: string; 
  turf_name: string; 
  date: string;
  start_time: string; 
  end_time: string; 
  total_price: string; 
  status: string;
  turf_id?: string;
};

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch<any>("/api/dashboards/user");
      setLoading(false);
      if (res.ok) setBookings(res.data.bookings);
    })();
  }, []);

  const upcomingMatches = useMemo(() => {
    return bookings.filter(b => b.status === "confirmed")
                   .sort((a,b) => new Date(`${a.date} ${a.start_time}`).getTime() - new Date(`${b.date} ${b.start_time}`).getTime())
                   .slice(0, 3);
  }, [bookings]);

  const pastMatches = useMemo(() => {
    return bookings.filter(b => b.status !== "confirmed")
                   .sort((a,b) => new Date(`${b.date} ${b.start_time}`).getTime() - new Date(`${a.date} ${a.start_time}`).getTime())
                   .slice(0, 5);
  }, [bookings]);

  const stats = useMemo(() => [
    { label: 'Upcoming Matches', value: upcomingMatches.length, icon: Calendar, color: 'text-primary bg-primary/10 border-primary/20' },
    { label: 'Total Played', value: pastMatches.length, icon: Trophy, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { label: 'Favorite Arena', value: "Alpha Turf HQ", icon: Heart, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
  ], [upcomingMatches, pastMatches]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F0C] transition-colors duration-300 pb-32 md:pb-16 relative">
      <Navbar />

      <div className="container-compact py-8 md:py-12 space-y-12">
        
        {/* COMPACT DASHBOARD HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase tracking-widest border border-primary/20 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Player Profile Active</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Welcome Back, <span className="text-primary italic">{user.name.split(' ')[0]}</span></h1>
              <p className="text-sm font-medium text-gray-500">Manage your reservations, track performance, and fast-book your favorite arenas.</p>
           </div>
           
           <Link href="/turfs" className="btn-sports px-8 py-3.5 shadow-md shadow-primary/20 flex-shrink-0">
              <PlusCircle className="w-5 h-5" /> Book a Match
           </Link>
        </header>

        {/* STATS (High Usability Grid) */}
        <section className="grid sm:grid-cols-3 gap-6">
           {loading ? [1,2,3].map(i => <SkeletonStat key={i} />) : stats.map((s, i) => (
             <div key={i} className="card-compact p-6 flex flex-col justify-between h-40 border-border group hover:border-primary/30 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${s.color}`}>
                   <s.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 mt-4">
                   <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
                   <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 truncate">{s.value}</div>
                </div>
             </div>
           ))}
        </section>

        {/* TWO COLUMN LAYOUT: UPCOMING VS PAST */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
           
           {/* LEFT: UPCOMING MATCHES (Actionable) */}
           <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Upcoming Matches
                 </h3>
              </div>

              {loading ? (
                <div className="space-y-4">{[1,2].map(i => <SkeletonRow key={i} />)}</div>
              ) : upcomingMatches.length === 0 ? (
                <EmptyState title="No Scheduled Matches" sub="You have no upcoming confirmed matches. Book an arena to organize your next game." icon={Calendar} actionLabel="Find Arena" actionLink="/turfs" />
              ) : (
                <div className="space-y-4">
                   {upcomingMatches.map(b => (
                     <div key={b.id} className="card-compact p-5 group hover:border-primary/40 focus-within:border-primary/40 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                           <div className="flex items-start gap-4">
                              <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20">
                                 <div className="text-xs font-bold uppercase tracking-widest leading-none">{new Date(b.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                 <div className="text-xl font-black leading-none mt-1">{new Date(b.date).getDate()}</div>
                              </div>
                              <div className="space-y-1.5">
                                 <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none">{b.turf_name}</h4>
                                 <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {b.start_time} - {b.end_time}</span>
                                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> Pune</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-0 border-border pt-4 sm:pt-0">
                               <span className="px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-green-500/20">Confirmed</span>
                               <Link href={`/turfs`} className="text-xs font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1.5">Details <ArrowRight className="w-3.5 h-3.5" /></Link>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           {/* RIGHT: PAST MATCHES & REBOOK */}
           <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-400" /> Recent Activity
                 </h3>
                 <Link href="/dashboard/customer/history" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline underline-offset-4">View All</Link>
              </div>

              {loading ? (
                <div className="space-y-4">{[1,2,3].map(i => <SkeletonRow key={i} />)}</div>
              ) : pastMatches.length === 0 ? (
                <div className="text-center py-10 px-6 card-compact">
                   <RotateCw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                   <p className="text-sm font-semibold text-gray-500">No past activity recorded.</p>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col">
                   {pastMatches.map(b => (
                     <div key={b.id} className="p-4 rounded-xl bg-white dark:bg-[#121A14] border border-border flex items-center justify-between gap-4 group hover:bg-card-hover transition-colors shadow-sm">
                        <div className="space-y-1 overflow-hidden">
                           <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{b.turf_name}</h4>
                           <div className="text-[11px] font-medium text-gray-500">{new Date(b.start_time).toLocaleDateString()}</div>
                        </div>
                        <button className="flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors border border-border" title="Quick Rebook">
                           <RotateCw className="w-4 h-4" />
                        </button>
                     </div>
                   ))}
                </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
