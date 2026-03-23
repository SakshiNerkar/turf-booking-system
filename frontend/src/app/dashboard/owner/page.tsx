"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { notify } from "@/lib/toast";
import { SkeletonRow, SkeletonCard } from "@/components/Skeletons";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Settings, MapPin, Calendar, CreditCard, Activity, 
  Users, TrendingUp, BarChart3, RefreshCw, Trash2, Edit3,
  Search, Filter, CheckCircle2, ChevronRight, ArrowLeft, Sparkles, 
  MousePointer2, LogOut, Store, LayoutDashboard, Target, Zap, Globe, ShieldCheck
} from "lucide-react";
import { ChartProtocol, MiniSparkline } from "@/components/dashboard/ChartProtocol";

type Turf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; description?: string };
type BookingItem = { id: string; turf_name: string; customer_name: string; players: number; total_price: string; payment_status: string; start_time: string; end_time: string; };
type RevenueSummary = { today: string; weekly: string; monthly: string; all_time: string; total_bookings: number; paid_bookings: number; };

const SPORT_META: Record<string, { icon: string; accent: string }> = {
  football:  { icon: "⚽", accent: "text-green-500" },
  cricket:   { icon: "🏏", accent: "text-amber-500" },
  badminton: { icon: "🏸", accent: "text-blue-500" },
  tennis:    { icon: "🎾", accent: "text-orange-500" },
};

const BLANK_TURF = { name: "", location: "", sport_type: "football", price_per_slot: 1200, description: "" };

export default function OwnerDashboard() {
  const { token, user, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [bookings, setBookings] = useState<BookingItem[] | null>(null);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState(BLANK_TURF);
  const [addLoading, setAddLoading] = useState(false);
  const [addStep, setAddStep] = useState(1);

  async function loadData() {
    if (!user || !token) return;
    setLoading(true);
    const [tRes, bRes, rRes] = await Promise.all([
      apiFetch<Turf[]>(`/api/turfs?owner_id=${user.id}&limit=50`),
      apiFetch<BookingItem[]>("/api/bookings", { token }),
      apiFetch<RevenueSummary>("/api/bookings/revenue/owner", { token }),
    ]);
    setTurfs(tRes.ok ? tRes.data : []);
    setBookings(bRes.ok ? bRes.data : []);
    setRevenue(rRes.ok ? rRes.data : null);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [user, token]);

  const setTab = (t: string) => router.push(`/dashboard/owner?tab=${t}`);

  const handleCreateTurf = async () => {
    if (!token) return;
    setAddLoading(true);
    const res = await apiFetch("/api/turfs", { method: "POST", token, body: form });
    setAddLoading(false);
    if (!res.ok) { notify.error(res.error.message); return; }
    notify.success("Venue operational! 🏟️");
    setForm(BLANK_TURF);
    setAddStep(1);
    loadData();
    setTab('turfs');
  };

  return (
    <div className="space-y-12 pb-32">
      
      <AnimatePresence mode="wait">
        {currentTab === "overview" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
             
             {/* 1. OPERATIONAL BENTO GRID */}
             <div className="grid md:grid-cols-4 gap-8">
                
                {/* Major KPI: Revenue */}
                <div className="md:col-span-2 bg-gray-900 dark:bg-white rounded-[4rem] p-12 text-white dark:text-gray-900 shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <span className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest italic border border-white/10">FINANCIAL HUB</span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                         </div>
                         <h3 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">₹{Number(revenue?.all_time || 0).toLocaleString()}</h3>
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">GROSS ASSET REVENUE TO DATE</p>
                      </div>
                      <div className="flex items-center justify-between pt-8 border-t border-white/10 dark:border-black/5">
                         <div className="text-[10px] font-black uppercase tracking-widest leading-none">Monthly Index: <span className="text-primary italic">+24.5%</span></div>
                         <button onClick={() => setTab('earnings')} className="px-8 py-3 bg-white/10 dark:bg-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-black hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">Audit Reports</button>
                      </div>
                   </div>
                   <div className="absolute -top-12 -right-12 opacity-[0.03] group-hover:scale-110 transition-all duration-[3s] pointer-events-none"><CreditCard className="w-96 h-96 -rotate-12" /></div>
                </div>

                {/* Sub KPI: Occupancy */}
                <div className="bg-white dark:bg-[#121A14] rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Target className="w-6 h-6" /></div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-2 leading-none">Occupancy Rate</div>
                   <div className="text-4xl font-black italic tracking-tighter uppercase">78.4%</div>
                   <div className="mt-6 flex gap-2">
                      {[1,1,1,1,1,0.5,0.2].map((v, i) => <div key={i} className="flex-1 h-1 bg-primary rounded-full" style={{ opacity: v }} />)}
                   </div>
                </div>

                {/* Sub KPI: Active Venues */}
                <div className="bg-white dark:bg-[#121A14] rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Store className="w-6 h-6" /></div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-2 leading-none">Venue Assets</div>
                   <div className="text-4xl font-black italic tracking-tighter uppercase">{turfs?.length || 0} SECTORS</div>
                   <button onClick={() => setTab('turfs')} className="mt-8 text-[9px] font-black text-primary uppercase tracking-widest italic flex items-center gap-3 group/btn">MANAGE ASSETS <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-3 transition-transform" /></button>
                </div>

             </div>

             {/* 2. ACTIVITY & TELEMETRY */}
             <div className="grid lg:grid-cols-3 gap-12">
                
                {/* Performance Flow Chart */}
                <div className="lg:col-span-2">
                   <ChartProtocol 
                     title="REVENUE PROTOCOL"
                     subtitle="Sector engagement velocity log"
                     data={[
                       { label: 'JAN', value: 45000 },
                       { label: 'FEB', value: 52000 },
                       { label: 'MAR', value: 48000 },
                       { label: 'APR', value: 65000 },
                       { label: 'MAY', value: 72000 },
                       { label: 'JUN', value: 68000 }
                     ]}
                   />
                </div>

                {/* Real-time Sector Updates */}
                <section className="bg-white dark:bg-[#121A14] rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col justify-between">
                   <div className="space-y-10">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-8 border-b border-gray-100 dark:border-white/5 pb-6">Protocol Logs</h4>
                      <div className="space-y-8">
                         {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-50 dark:bg-white/5 animate-pulse rounded-2xl" />) : 
                          bookings?.slice(0, 4).map(b => (
                            <div key={b.id} className="flex items-center gap-6 group">
                               <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-all border border-transparent group-hover:border-primary/20 shadow-sm">{SPORT_META[b.turf_name?.toLowerCase()]?.icon || "🏟️"}</div>
                               <div className="flex-1 min-w-0">
                                  <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase italic tracking-tighter truncate">{b.customer_name}</div>
                                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60">MATCH SYNC COMPLETED</div>
                               </div>
                               <div className="text-[10px] font-black text-primary">₹{Number(b.total_price).toFixed(0)}</div>
                            </div>
                          ))}
                      </div>
                   </div>
                   <button onClick={() => setTab('bookings')} className="w-full mt-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-[0.3em] italic shadow-2xl hover:scale-105 transition-all">AUDIT FULL LOG</button>
                </section>

             </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED TABS PROTOCOL */}
      <AnimatePresence>
         {currentTab !== "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               
               {/* Context Switcher (SaaS Tab Bar) */}
               <div className="px-10 py-8 glass-panel rounded-[3.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-2 border-primary/5">
                  <div className="flex items-center gap-6">
                     <button onClick={() => setTab('overview')} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:text-primary transition-all shadow-sm"><ArrowLeft className="w-5 h-5" /></button>
                     <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-[1.5rem] flex items-center overflow-x-auto no-scrollbar">
                        {['turfs', 'bookings', 'earnings', 'add'].map(t => (
                           <button key={t} onClick={() => setTab(t)} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentTab === t ? 'bg-primary text-white shadow-2xl shadow-green-500/10' : 'text-gray-400 opacity-60 hover:opacity-100'}`}>{t}</button>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none hidden xl:block">Operational Sector: {user?.name.toUpperCase()} HUB</span>
                     <button onClick={loadData} className="p-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary transition-all"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
                  </div>
               </div>

               {/* TAB CONTENTS (Simplified Elite Design) */}
               <div className="bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 shadow-2xl p-12 min-h-[600px]">
                  
                  {currentTab === 'turfs' && (
                     <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
                        {loading ? [1,2,3].map(i => <SkeletonCard key={i} />) : 
                         turfs?.map(t => (
                           <div key={t.id} className="group relative bg-gray-50 dark:bg-white/2 rounded-[4rem] border border-transparent hover:border-primary/20 p-10 transition-all shadow-sm hover:shadow-2xl">
                              <div className="flex items-center justify-between mb-10">
                                 <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-black flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform">
                                    {SPORT_META[t.sport_type?.toLowerCase()]?.icon || "🏟️"}
                                 </div>
                                 <div className="flex gap-3">
                                    <button className="p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-white/5 text-gray-400 hover:text-primary transition-all shadow-sm"><Edit3 className="w-5 h-5" /></button>
                                    <button className="p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-5 h-5" /></button>
                                 </div>
                              </div>
                              <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{t.name}</h4>
                              <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-3 flex items-center gap-3 italic"><MapPin className="w-4 h-4 text-primary" /> {t.location}</div>
                              
                              <div className="mt-12 flex items-center justify-between pt-10 border-t border-gray-100 dark:border-white/5">
                                 <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">₹{Number(t.price_per_slot).toFixed(0)}<span className="text-xs not-italic opacity-40">/hr</span></div>
                                 <button onClick={() => router.push(`/turfs/${t.id}`)} className="px-8 py-4 bg-gray-900 dark:bg-primary text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-xl hover:scale-110 active:scale-95 transition-all italic">Control Slots</button>
                              </div>
                              <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none group-hover:rotate-12 duration-[1s]"><Zap className="w-40 h-40" /></div>
                           </div>
                         ))}
                     </div>
                  )}

                  {currentTab === 'bookings' && (
                     <div className="space-y-6">
                        {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />) : 
                         bookings?.map(b => (
                           <div key={b.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-10 bg-gray-50/50 dark:bg-white/2 rounded-[3.5rem] border border-transparent hover:border-primary/20 transition-all group shadow-sm">
                              <div className="flex items-center gap-8">
                                 <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-black text-[10px] font-black text-primary border border-primary/20 flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform italic">
                                    <Users className="w-6 h-6 mb-1" />
                                    SYNCED
                                 </div>
                                 <div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-2">{b.customer_name}</div>
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                                       <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(b.start_time).toLocaleString()}</span>
                                       <span className="flex items-center gap-2 text-primary font-black"><Store className="w-4 h-4" /> {b.turf_name}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-10 px-8 lg:border-l border-gray-100 dark:border-white/5">
                                 <div className="text-right">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1 opacity-60">REVENUE STATUS</div>
                                    <div className={`text-2xl font-black italic uppercase ${b.payment_status === 'success' ? 'text-green-500' : 'text-amber-500'}`}>{b.payment_status === 'success' ? 'PAID PROTOCOL' : 'PENDING'}</div>
                                 </div>
                                 <div className="text-4xl font-black italic tracking-tighter">₹{Number(b.total_price).toFixed(0)}</div>
                              </div>
                           </div>
                         ))}
                     </div>
                  )}

                  {currentTab === 'add' && (
                     <div className="max-w-4xl mx-auto space-y-16 py-10">
                        <div className="flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5 pb-10">
                           <div className="space-y-4">
                              <h2 className="text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Initialize <span className="text-primary">Asset</span></h2>
                              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Follow the protocol to publish your venue sector to the marketplace.</p>
                           </div>
                           <div className="flex gap-3">
                              {[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-700 ${addStep >= s ? 'bg-primary' : 'bg-gray-100 dark:bg-white/10'}`} />)}
                           </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-white/2 rounded-[4rem] p-16 border border-gray-100 dark:border-white/5 shadow-inner">
                           {addStep === 1 && (
                              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                 <div className="space-y-6">
                                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic mb-6 block">Asset Descriptor</label>
                                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-12 py-7 bg-white dark:bg-black border border-transparent focus:border-primary/20 rounded-[2.5rem] text-xl font-black italic uppercase tracking-tighter outline-none focus:ring-8 focus:ring-primary/5 transition-all shadow-xl" placeholder="Sector Name (e.g. Arena-7 Elite)" />
                                 </div>
                                 <div className="space-y-6">
                                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic mb-6 block">Discipline Domain</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                       {Object.keys(SPORT_META).map(s => (
                                          <button key={s} onClick={() => setForm(p => ({ ...p, sport_type: s }))} className={`px-10 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${form.sport_type === s ? 'bg-primary text-white shadow-2xl shadow-green-500/20 scale-105' : 'bg-white dark:bg-black text-gray-400 border border-transparent hover:border-primary/20'}`}>
                                             <div className="text-4xl mb-3">{SPORT_META[s].icon}</div>
                                             {s}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                           {addStep === 2 && (
                               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                 <div className="space-y-6">
                                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic mb-6 block">Geographic Quadrant</label>
                                    <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full px-12 py-7 bg-white dark:bg-black border border-transparent focus:border-primary/20 rounded-[2.5rem] text-xl font-black italic uppercase tracking-tighter outline-none focus:ring-8 focus:ring-primary/5 transition-all shadow-xl" placeholder="Landmark / City Protocol" />
                                 </div>
                              </motion.div>
                           )}
                           {addStep === 3 && (
                               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 text-center">
                                 <div className="space-y-10">
                                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic mb-6 block">Hourly Revenue Protocol</label>
                                    <div className="text-9xl font-black text-gray-900 dark:text-white flex items-center justify-center tracking-tighter">
                                       ₹<input type="number" value={form.price_per_slot} onChange={e => setForm(p => ({ ...p, price_per_slot: Number(e.target.value) }))} className="bg-transparent border-none outline-none w-56 text-center" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic opacity-40">Base hourly rate for 1 match protocol.</p>
                                 </div>
                              </motion.div>
                           )}

                           <div className="mt-20 flex items-center justify-between px-6">
                              <button disabled={addStep === 1} onClick={() => setAddStep(addStep - 1)} className="px-12 py-5 text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest disabled:opacity-0 transition-all italic border border-transparent hover:border-gray-100 rounded-2xl">Return</button>
                              {addStep < 3 ? (
                                <button onClick={() => setAddStep(addStep + 1)} className="px-16 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest italic">Proceed</button>
                              ) : (
                                <button onClick={handleCreateTurf} disabled={addLoading} className="px-20 py-7 bg-primary text-white font-black rounded-[2.5rem] shadow-2xl shadow-green-500/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-6 text-xl italic uppercase tracking-tighter">
                                   {addLoading ? <RefreshCw className="animate-spin w-6 h-6" /> : <>EXECUTE PUBLISH <Sparkles className="w-8 h-8" /></>}
                                </button>
                              )}
                           </div>
                        </div>
                     </div>
                  )}

               </div>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}
