"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PlusCircle, CreditCard, Clock, MapPin, ArrowRight, Database, 
  TrendingUp, Activity, BarChart3, Users, ChevronRight
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, EmptyState, SkeletonCard } from "../../../components/Skeletons";
import { Navbar } from "@/components/Navbar";
import { MiniSparkline } from "../../../components/dashboard/MiniSparkline";

type TurfItem = { id: string; name: string; location_city: string; location_address: string; sports_available: string; price_weekday: number; price_weekend: number; rating?: number; images: string; };
type Booking = { id: string; turf_name: string; date: string; start_time: string; end_time: string; total_price: string; status: string; };

export default function OwnerDashboard() {
  const { user, token } = useAuth();
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch<any>("/api/dashboards/owner");
      setLoading(false);
      if (res.ok) {
        setTurfs(res.data.turfsOwned);
        setBookings(res.data.bookings);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const revenue = bookings.reduce((s, b) => s + Number(b.total_price), 0);
    return [
      { label: 'Active Domains', value: turfs.length, icon: Database, color: 'text-primary bg-primary/10 border-primary/20' },
      { label: 'Net Revenue', value: `₹${revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
      { label: 'Platform Sessions', value: bookings.length, icon: Users, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
    ];
  }, [turfs, bookings]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F0C] transition-colors duration-300 pb-32 md:pb-16 relative">
      <Navbar />

      <div className="container-compact py-8 md:py-12 space-y-12">
        
        {/* COMPACT DASHBOARD HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase tracking-widest border border-primary/20 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Partner Hub Active</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Owner <span className="text-primary italic">Analytics</span></h1>
              <p className="text-sm font-medium text-gray-500">Monitor regional assets, track daily match cadence, and maximize revenue velocity.</p>
           </div>
           
           <Link href="/dashboard/owner/add" className="btn-sports px-8 py-3.5 shadow-md flex-shrink-0">
              <PlusCircle className="w-5 h-5" /> Initialize Arena
           </Link>
        </header>

        {/* STATS (High Usability Analytics) */}
        <section className="grid sm:grid-cols-3 gap-6">
           {loading ? [1,2,3].map(i => <SkeletonStat key={i} />) : stats.map((s, i) => (
             <div key={i} className="card-compact p-6 flex flex-col justify-between h-40 border border-border group hover:border-primary/30 transition-all relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-sm ${s.color}`}>
                   <s.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 mt-4">
                   <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
                   <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">{s.value}</div>
                </div>
                <div className="absolute top-6 right-6 w-16 h-8 opacity-20"><MiniSparkline /></div>
             </div>
           ))}
        </section>

        {/* ASSET MANAGEMENT (Primary Growth Engine) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                 <Database className="w-5 h-5 text-primary" /> Regional Assets
              </h3>
              <Link href="/turfs" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline underline-offset-4 flex items-center gap-1">Manage Catalog <ChevronRight className="w-4 h-4" /></Link>
           </div>

           {loading ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1,2,3].map(i => <SkeletonCard key={i} />)}
             </div>
           ) : turfs.length === 0 ? (
             <EmptyState title="No Assests Active" sub="Broaden your regional deployment by registering your first turf." icon={Database} actionLabel="Add Arena" actionLink="/dashboard/owner/add" />
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {turfs.map(t => (
                  <div key={t.id} className="card-compact p-0 group flex flex-col h-[380px] hover:border-primary/30">
                     <div className="h-[180px] relative bg-gray-100 dark:bg-[#0B0F0C] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt={t.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 text-white">
                           <h4 className="text-xl font-bold tracking-tight leading-none truncate pr-4">{t.name}</h4>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-80"><MapPin className="w-3 h-3 text-primary" /> {t.location_city}</div>
                        </div>
                     </div>
                     <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-500 uppercase">Hourly Yield</span>
                              <div className="text-lg font-black text-gray-900 dark:text-white">₹{t.price_weekday}</div>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-500 uppercase">Weekly Booking Rate</span>
                              <div className="text-sm font-bold text-emerald-500">84% (<TrendingUp className="w-3 h-3 inline" />)</div>
                           </div>
                        </div>
                        <div className="pt-5 border-t border-border mt-4">
                           <Link href={`/dashboard/owner/turfs/${t.id}`} className="btn-secondary w-full text-xs box-border">Manage Operations</Link>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </section>

      </div>
    </div>
  );
}
