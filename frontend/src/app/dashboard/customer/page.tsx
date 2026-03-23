"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RequireAuth } from "../../../components/RequireAuth";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { notify } from "../../../lib/toast";
import { SkeletonCard, EmptyState } from "../../../components/Skeletons";
import { 
  History, Calendar, User, Settings, LogOut, Search, Clock, 
  MapPin, Star, ArrowRight, Zap, Target, Sparkles, Filter, ShieldCheck
} from "lucide-react";
import { CountdownModule } from "@/components/dashboard/CountdownModule";

type BookingItem = { id: string; turf_name: string; total_price: string; start_time: string; end_time: string; location: string; status: string; };

export default function CustomerDashboard() {
  const { token, user, logout } = useAuth();
  const [bookings, setBookings]     = useState<BookingItem[] | null>(null);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"overview" | "history" | "profile">("overview");

  useEffect(() => {
    (async () => {
      if (!token) return;
      setLoading(true);
      const res = await apiFetch<BookingItem[]>("/api/bookings", { token });
      setLoading(false);
      if (res.ok) setBookings(res.data);
    })();
  }, [token]);

  const upcomingBooking = useMemo(() => {
    if (!bookings) return null;
    return bookings.find(b => new Date(b.start_time) > new Date()) || null;
  }, [bookings]);

  return (
    <RequireAuth roles={["customer"]}>
      <div className="space-y-16 pb-40">
        
        {/* 1. MISSION CONTROL HEADER */}
        <header className="bg-gray-900 dark:bg-white rounded-[4.5rem] p-16 text-white dark:text-gray-900 relative overflow-hidden group shadow-[0_80px_160px_rgba(0,0,0,0.3)] border border-white/5">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="px-6 py-2 bg-primary/20 text-primary text-[10px] font-black rounded-xl uppercase tracking-[0.4em] border border-primary/20 italic shadow-2xl">Athlete Profile Active</span>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                 </div>
                 <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">{user?.name} HUB</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 leading-loose max-w-sm italic">NEXT MATCH COORDINATES INITIALIZED · REGIONAL SECTORS SYNCED · PROTOCOLS READY.</p>
              </div>

              {/* Sub-Navigation Dashboard Protocol */}
              <div className="flex flex-wrap gap-4 bg-white/5 dark:bg-black/5 p-3 rounded-[3rem] border border-white/10 dark:border-black/10 backdrop-blur-3xl">
                 {[
                   { id: 'overview', label: 'Mission Control', icon: Target },
                   { id: 'history', label: 'Match History', icon: History },
                   { id: 'profile', label: 'Identity', icon: User }
                 ].map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setTab(t.id as any)}
                     className={`flex items-center gap-5 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${tab === t.id ? 'bg-primary text-white shadow-2xl shadow-green-500/20 scale-105' : 'text-white/40 dark:text-gray-400 hover:text-white dark:hover:text-black'}`}
                   >
                      <t.icon className="w-5 h-5" /> {t.label}
                   </button>
                 ))}
              </div>
           </div>
           <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-12 duration-[10s] text-primary"><Sparkles className="w-[600px] h-[600px]" /></div>
        </header>

        {/* 2. TABBED CONTENT EXECUTION */}
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="space-y-16">
               
               {/* 2.1 MATCH COUNTDOWN (High Impact) */}
               {upcomingBooking ? (
                 <CountdownModule booking={upcomingBooking} />
               ) : (
                 <aside className="bg-gray-50 dark:bg-white/2 rounded-[4rem] p-12 border border-dashed border-gray-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 rounded-[1.75rem] bg-white dark:bg-black flex items-center justify-center text-3xl shadow-2xl border border-gray-100 dark:border-white/5">🏟️</div>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">NO ACTIVE MATCH</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Initialize your first session protocol in a regional sector.</p>
                       </div>
                    </div>
                    <Link href="/turfs" className="px-12 py-6 bg-primary text-white text-[11px] font-black rounded-3xl uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-6 italic">INITIALIZE SECTOR DISCOVERY <ArrowRight className="w-5 h-5" /></Link>
                 </aside>
               )}

               {/* 2.2 SMART RECOMMENDATIONS HUB */}
               <section className="space-y-12">
                  <div className="flex items-end justify-between px-6">
                     <div className="space-y-4">
                        <h3 className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Sector Discovery</h3>
                        <div className="flex items-center gap-6 text-[11px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">
                           TRENDING DOMAINS FOR YOUR DISCOVERY INDEX
                        </div>
                     </div>
                     <Link href="/turfs" className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-4 italic group underline underline-offset-8 decoration-2">EXPLORE ALL SECTORS <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" /></Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                     {[1,2,3].map(i => (
                       <Link key={i} href="/turfs" className="group bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl hover:-translate-y-4 hover:shadow-[0_80px_160px_rgba(0,0,0,0.1)] transition-all flex flex-col relative h-[500px]">
                          <div className="h-2/3 relative overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-125 transition-all duration-[3s]" />
                             <div className="absolute top-10 right-10 px-6 py-3 bg-white/95 dark:bg-black/95 backdrop-blur-3xl rounded-[1.25rem] font-black text-primary text-[10px] shadow-2xl transition-transform group-hover:rotate-12 border border-white/20">★ 4.9 ({120 * i})</div>
                             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                          </div>
                          <div className="p-10 space-y-6 flex-1 flex flex-col justify-between">
                             <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">Sector Alpha-Elite {i}</h4>
                             <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-3 saturate-0 group-hover:saturate-100"><MapPin className="w-4 h-4 text-primary" /> PUNE, MH</div>
                                <div className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter">₹1200</div>
                             </div>
                          </div>
                          <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                       </Link>
                     ))}
                  </div>
               </section>
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
               <div className="flex items-end justify-between px-6">
                 <div className="space-y-4">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Match Registry</h2>
                    <div className="text-[11px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">COMMITTED SESSION LOGS PERSISTENCE · {bookings?.length || 0} RECORDS</div>
                 </div>
                 <div className="relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-all" />
                    <input placeholder="Filter match logs..." className="w-[450px] pl-20 pr-10 py-5 bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-2xl" />
                 </div>
               </div>

               <div className="bg-white dark:bg-[#121A14] rounded-[4.5rem] p-12 border border-gray-100 dark:border-white/5 shadow-2xl space-y-6 shadow-black/5">
                  {loading ? [1,2,3].map(i => <div key={i} className="h-32 bg-gray-50 dark:bg-white/5 animate-pulse rounded-[2.5rem]" />) : (
                    bookings?.length === 0 ? (
                      <EmptyState title="No Match History" sub="Your match persistence registry is currently at zero index. Commit to a session to begin tracking." icon={History} actionLink="/turfs" actionLabel="DISCOVER ARENAS" />
                    ) : (
                      bookings?.map(b => (
                        <div key={b.id} className="flex items-center justify-between p-10 bg-gray-50 dark:bg-white/2 rounded-[3.5rem] border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/5 transition-all group shadow-sm hover:shadow-2xl">
                           <div className="flex items-center gap-10">
                              <div className="w-20 h-20 rounded-[2.5rem] bg-white dark:bg-black flex items-center justify-center text-4xl shadow-xl group-hover:rotate-12 transition-all border border-gray-100 dark:border-white/5">🏟️</div>
                              <div>
                                 <div className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-3 leading-none group-hover:text-primary transition-colors">{b.turf_name}</div>
                                 <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                                    <span className="flex items-center gap-3"><Clock className="w-5 h-5" /> {new Date(b.start_time).toLocaleDateString("en-IN", { month: 'short', day: '2-digit' })} · {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
                                    <span className="flex items-center gap-2 saturate-0 group-hover:saturate-100"><MapPin className="w-4 h-4 text-primary" /> {b.location}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-12 px-10 border-l border-gray-100 dark:border-white/5 h-20 text-right">
                              <div>
                                 <div className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter mb-1 leading-none">₹{Number(b.total_price).toFixed(0)}</div>
                                 <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] italic leading-none">{b.status} PROTOCOL</div>
                              </div>
                              <button className="p-6 rounded-[1.5rem] bg-white dark:bg-black border border-gray-100 dark:border-white/10 text-gray-400 hover:text-primary transition-all shadow-xl hover:scale-110"><ArrowRight className="w-6 h-6" /></button>
                           </div>
                        </div>
                      ))
                    )
                  )}
               </div>
            </motion.div>
          )}

          {tab === "profile" && (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
                <div className="bg-white dark:bg-[#121A14] rounded-[5rem] p-24 border border-gray-100 dark:border-white/5 shadow-[0_80px_160px_rgba(0,0,0,0.1)] text-center relative overflow-hidden group">
                   <div className="w-48 h-48 rounded-[4rem] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-16 shadow-2xl border border-primary/20 relative group-hover:rotate-6 transition-all">
                      <span className="text-7xl font-black italic">{user?.name[0]}</span>
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl shadow-2xl border-4 border-white dark:border-[#121A14]"><Sparkles className="w-8 h-8" /></div>
                   </div>
                   <h2 className="text-6xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none mb-4">{user?.name}</h2>
                   <p className="text-[11px] font-black text-primary uppercase tracking-[0.5em] italic mb-16">{user?.email} · Operational Identity Verified</p>
                   
                   <div className="grid grid-cols-2 gap-10">
                      {[
                        { label: 'Security Protocols', icon: ShieldCheck, color: 'text-green-500' },
                        { label: 'Account Config', icon: Settings, color: 'text-blue-500' }
                      ].map(item => (
                        <button key={item.label} className="p-10 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col items-center gap-6 group/btn hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm">
                           <item.icon className={`w-10 h-10 ${item.color} group-hover/btn:scale-110 transition-transform`} />
                           <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest italic">{item.label}</span>
                        </button>
                      ))}
                   </div>

                   <button onClick={logout} className="mt-20 px-16 py-6 border-2 border-red-500/20 text-red-500 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all italic flex items-center gap-6 mx-auto">
                      <LogOut className="w-6 h-6" /> TERMINATE SESSION
                   </button>
                   <div className="absolute top-0 left-0 p-16 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-all"><Zap className="w-64 h-64" /></div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

      </div>
    </RequireAuth>
  );
}
