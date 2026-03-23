"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { notify } from "@/lib/toast";
import { SkeletonRow } from "@/components/Skeletons";
import { StatCard } from "@/components/dashboard/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, CreditCard, Activity, ArrowRight, RefreshCw, History, User, 
  MapPin, Settings, LogOut, Search, Clock, ShieldCheck, Zap
} from "lucide-react";

// --- Types ---
type BookingListItem = { id: string; turf_id: string; turf_name: string; location: string; sport_type: string; players: number; total_price: string; payment_status: string; start_time: string; end_time: string; };

const SPORT_ICONS: Record<string, string> = { football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾" };

function fmtSlot(start: string, end: string) {
  const d = new Date(start);
  const date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const from = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const to   = new Date(end).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${date} · ${from} – ${to}`;
}

export default function CustomerDashboard() {
  const { token, user, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentTab = searchParams.get("tab") || "upcoming";
  const [bookings, setBookings] = useState<BookingListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function loadBookings() {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<BookingListItem[]>("/api/bookings", { token });
    setLoading(false);
    if (res.ok) setBookings(res.data);
  }

  useEffect(() => { loadBookings(); }, [token]);

  async function handleCancel(id: string) {
    if (!confirm("Relinquish this slot? This action is irreversible.")) return;
    setCancelling(id);
    const res = await apiFetch(`/api/bookings/${id}`, { method: "DELETE", token: token! });
    setCancelling(null);
    if (!res.ok) { notify.error(res.error.message); return; }
    notify.success("Slot released successfully! ✅");
    setBookings((prev) => prev?.filter((b) => b.id !== id) ?? null);
  }

  const now = new Date();
  const upcoming = useMemo(() => (bookings ?? []).filter((b) => new Date(b.start_time) >= now).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()), [bookings]);
  const past     = useMemo(() => (bookings ?? []).filter((b) => new Date(b.start_time) < now).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()), [bookings]);
  const totalSpent = useMemo(() => (bookings ?? []).filter(b => b.payment_status === "success").reduce((s, b) => s + Number(b.total_price), 0), [bookings]);

  const displayList = currentTab === "upcoming" ? upcoming : past;
  const setTab = (t: string) => router.push(`/dashboard/customer?tab=${t}`);

  const activeStats = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Reservations" value={bookings?.length ?? 0} icon={Calendar} trend={{ value: "+12%", isUp: true }} />
      <StatCard title="Turff Credits" value={Math.floor(totalSpent * 0.1 || 300)} icon={Zap} trend={{ value: "Earn 10%", isUp: true }} />
      <StatCard title="Total Investment" value={`₹${totalSpent.toLocaleString()}`} icon={CreditCard} />
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {(currentTab === 'upcoming' || currentTab === 'history') && activeStats}

      <div className="bg-white dark:bg-[#121A14] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Tab Interface */}
        <div className="px-10 py-8 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/50 dark:bg-white/[0.02]">
           <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-[1.25rem] w-fit">
              {[
                { key: 'upcoming', label: 'Active Sessions', count: upcoming.length },
                { key: 'history', label: 'Past Matches', count: past.length }
              ].map(t => (
                <button 
                  key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${currentTab === t.key ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                  {t.label}
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] ${currentTab === t.key ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>{t.count}</span>
                </button>
              ))}
           </div>
           
           {(currentTab === 'upcoming' || currentTab === 'history') && (
             <button onClick={loadBookings} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-primary transition-all pr-4 uppercase tracking-[0.2em]">
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> REFRESH PULSE
             </button>
           )}
        </div>

        {/* View Layouts */}
        <div className="flex-1 p-6 sm:p-10 relative">
          <AnimatePresence mode="wait">
            {(currentTab === 'upcoming' || currentTab === 'history') && (
              <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 {loading ? (
                   <div className="space-y-6">
                      {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
                   </div>
                 ) : displayList.length === 0 ? (
                    <div className="py-24 text-center max-w-sm mx-auto">
                       <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8 border border-dashed border-gray-200 dark:border-white/10">
                          {currentTab === 'upcoming' ? <Zap className="w-10 h-10 text-gray-300" /> : <History className="w-10 h-10 text-gray-300" />}
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No {currentTab} Found</h3>
                       <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed">It looks like this sector of your dashboard is currently vacant. Let's find your next session.</p>
                       <Link href="/turfs" className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/20 hover:scale-105 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3">EXPLORE ARENAS <ArrowRight className="w-5 h-5" /></Link>
                    </div>
                 ) : (
                    <div className="grid gap-4">
                       {displayList.map(b => (
                         <div key={b.id} className="group relative flex flex-col sm:flex-row sm:items-center gap-6 p-8 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/2 hover:bg-white dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5 hover:shadow-2xl hover:shadow-black/[0.02]">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#1A241D] flex items-center justify-center text-4xl shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all">
                               {SPORT_ICONS[b.sport_type?.toLowerCase()] ?? "🏟️"}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <h4 className="text-xl font-black text-gray-900 dark:text-white truncate">{b.turf_name}</h4>
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${b.payment_status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {b.payment_status === 'success' ? 'Verified Payout' : b.payment_status}
                                  </span>
                               </div>
                               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-2 font-black transition-colors group-hover:text-primary"><Clock className="w-4 h-4" /> {fmtSlot(b.start_time, b.end_time)}</span>
                                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {b.location}</span>
                               </div>
                            </div>
                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4 pt-6 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
                               <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">₹{Number(b.total_price).toFixed(0)}</div>
                               {currentTab === 'upcoming' && b.payment_status !== "success" && (
                                 <button onClick={() => handleCancel(b.id)} disabled={cancelling === b.id} className="px-6 py-2 rounded-xl text-[10px] font-black text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-[0.2em] border border-red-500/10 disabled:opacity-40">
                                   {cancelling === b.id ? "RELEASING..." : "CANCEL SESSION"}
                                 </button>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 )}
              </motion.div>
            )}

            {(currentTab === 'profile' || currentTab === 'settings') && (
              <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-20 text-center">
                 <div className="w-32 h-32 rounded-[3rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-5xl mx-auto mb-10 shadow-inner group relative">
                    👤
                    <div className="absolute inset-0 bg-primary/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-none">{user?.name}</h2>
                 <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-12 italic">{user?.role} Proficiency · {user?.email}</p>
                 <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 dark:bg-white/2 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 text-left">
                          <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Member Strength</label>
                          <div className="text-2xl font-black">Level 12 <Zap className="inline-block w-4 h-4 text-amber-500" /></div>
                       </div>
                       <div className="bg-gray-50 dark:bg-white/2 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 text-left">
                          <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Security Index</label>
                          <div className="text-2xl font-black text-green-500">Verified <ShieldCheck className="inline-block w-5 h-5" /></div>
                       </div>
                    </div>
                    <button className="w-full py-6 bg-gray-100 dark:bg-white/5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary/10 hover:text-primary transition-all group border border-transparent hover:border-primary/20">
                      <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Preferences & Modifiers
                    </button>
                    <button onClick={logout} className="w-full py-6 bg-red-500/5 text-red-500 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-500/10 transition-all border border-red-500/10 active:scale-95">
                      <LogOut className="w-4 h-4" /> Relinquish Session
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
