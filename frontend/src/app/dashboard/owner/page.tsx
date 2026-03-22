"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { notify } from "@/lib/toast";
import { SkeletonRow, SkeletonCard } from "@/components/Skeletons";
import { StatCard } from "@/components/dashboard/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Settings, MapPin, Calendar, CreditCard, Activity, 
  Users, TrendingUp, BarChart3, RefreshCw, Trash2, Edit3,
  Search, Filter, CheckCircle2, ChevronRight, ArrowLeft, Sparkles, MousePointer2, LogOut
} from "lucide-react";

// --- Types ---
type Turf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; description?: string };
type BookingItem = { id: string; turf_name: string; customer_name: string; players: number; total_price: string; payment_status: string; start_time: string; end_time: string; };
type RevenueSummary = { today: string; weekly: string; monthly: string; all_time: string; total_bookings: number; paid_bookings: number; };

const SPORT_ICONS: Record<string, string> = { football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾" };
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

  // Add Turf Form State
  const [form, setForm] = useState(BLANK_TURF);
  const [addLoading, setAddLoading] = useState(false);
  const [addStep, setAddStep] = useState(1);

  async function loadData() {
    if (!user || !token) return;
    setLoading(true);
    try {
      const [tRes, bRes, rRes] = await Promise.all([
        apiFetch<Turf[]>(`/api/turfs?owner_id=${user.id}&limit=50`),
        apiFetch<BookingItem[]>("/api/bookings", { token }),
        apiFetch<RevenueSummary>("/api/bookings/revenue/owner", { token }),
      ]);
      setTurfs(tRes.ok ? tRes.data : []);
      setBookings(bRes.ok ? bRes.data : []);
      setRevenue(rRes.ok ? rRes.data : null);
    } catch (e) { notify.error("Failed to load dashboard data"); }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [user, token]);

  const handleCreateTurf = async () => {
    if (!token) return;
    setAddLoading(true);
    const res = await apiFetch("/api/turfs", { method: "POST", token, body: form });
    setAddLoading(false);
    if (!res.ok) { notify.error(res.error.message); return; }
    notify.success("Turf published! 🏟️");
    setForm(BLANK_TURF);
    setAddStep(1);
    loadData();
    router.push("/dashboard/owner?tab=turfs");
  };

  const setTab = (t: string) => router.push(`/dashboard/owner?tab=${t}`);

  const activeStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Today's Harvest" value={`₹${Number(revenue?.today || 0).toLocaleString()}`} icon={CreditCard} trend={{ value: "+8%", isUp: true }} />
      <StatCard title="Net Earnings" value={`₹${Number(revenue?.all_time || 0).toLocaleString()}`} icon={TrendingUp} trend={{ value: "+24%", isUp: true }} />
      <StatCard title="Operating Venues" value={turfs?.length ?? 0} icon={Activity} />
      <StatCard title="Total Traffic" value={revenue?.total_bookings ?? 0} icon={Users} />
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {currentTab !== 'add' && currentTab !== 'settings' && currentTab !== 'profile' && activeStats}

      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Toolbar */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
           <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-fit overflow-x-auto no-scrollbar">
              {['overview', 'turfs', 'bookings', 'earnings'].map(t => (
                <button 
                  key={t} onClick={() => setTab(t)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${currentTab === t ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                  {t}
                </button>
              ))}
           </div>
           {currentTab !== 'add' && (
             <button onClick={() => setTab('add')} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all text-xs uppercase tracking-widest">
               <Plus className="w-4 h-4" /> NEW VENUE
             </button>
           )}
        </div>

        {/* View Layouts */}
        <div className="flex-1 p-6 sm:p-10 relative">
          <AnimatePresence mode="wait">
            {currentTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-2 gap-10">
                 <section className="space-y-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Activity</h3>
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                       {loading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />) : 
                        bookings?.slice(0, 5).map(b => (
                           <div key={b.id} className="py-5 flex items-center gap-4 group transition-all">
                              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 shadow-sm border border-transparent group-hover:border-primary/10 transition-all">
                                 {SPORT_ICONS[b.turf_name?.toLowerCase()] ?? "🏟️"}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="font-black text-gray-900 dark:text-white truncate">{b.customer_name}</div>
                                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{b.turf_name} · {new Date(b.start_time).toLocaleDateString()}</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-sm font-black text-primary">₹{Number(b.total_price).toFixed(0)}</div>
                                 <div className={`text-[10px] font-black uppercase ${b.payment_status === 'success' ? 'text-green-500' : 'text-amber-500'}`}>{b.payment_status}</div>
                              </div>
                           </div>
                        ))}
                    </div>
                 </section>

                 <section className="bg-gray-50 dark:bg-white/5 rounded-[3rem] p-10 flex flex-col justify-between border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="relative z-10">
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Performance <span className="text-primary italic">Live</span></h3>
                       <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Global engagement index +12.5%</p>
                    </div>
                    <div className="h-48 flex items-end gap-3 px-4 relative z-10">
                       {[40, 70, 45, 90, 65, 80, 55, 60, 85, 95].map((h, i) => (
                         <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-primary/10 hover:bg-primary transition-all rounded-t-lg" />
                       ))}
                    </div>
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform scale-150 pointer-events-none text-primary"><Activity className="w-64 h-64" /></div>
                 </section>
              </motion.div>
            )}

            {currentTab === 'turfs' && (
              <motion.div key="turfs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : 
                  turfs?.map(t => (
                    <div key={t.id} className="group relative bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-transparent hover:border-gray-100 dark:hover:border-white/10 p-8 transition-all">
                       <div className="flex items-center justify-between mb-8">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#1A241D] flex items-center justify-center text-4xl shadow-sm border border-gray-100 dark:border-white/5 transition-transform group-hover:scale-110">
                             {SPORT_ICONS[t.sport_type?.toLowerCase()] ?? "🏟️"}
                          </div>
                          <div className="flex gap-2">
                             <button className="p-2.5 rounded-xl bg-white dark:bg-[#1A241D] text-gray-400 hover:text-primary transition-colors shadow-sm"><Edit3 className="w-4 h-4" /></button>
                             <button className="p-2.5 rounded-xl bg-white dark:bg-[#1A241D] text-gray-400 hover:text-red-500 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                       <h4 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{t.name}</h4>
                       <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4" /> {t.location}</div>
                       <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5">
                          <div className="text-2xl font-black text-gray-900 dark:text-white">₹{Number(t.price_per_slot).toFixed(0)}</div>
                          <button onClick={() => router.push(`/turfs/${t.id}`)} className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">Manage Slots</button>
                       </div>
                    </div>
                  ))}
              </motion.div>
            )}

            {currentTab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Venue Reservations</h3>
                    <div className="flex gap-2">
                       <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black outline-none w-48 focus:w-64 transition-all" placeholder="Search customer..." /></div>
                    </div>
                 </div>
                 <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />) : 
                     bookings?.map(b => (
                        <div key={b.id} className="py-6 flex items-center gap-6 group">
                           <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/10 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors shadow-sm border border-transparent group-hover:border-primary/10">👤</div>
                           <div className="flex-1 min-w-0">
                              <div className="font-black text-lg text-gray-900 dark:text-white mb-1">{b.customer_name}</div>
                              <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                 <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(b.start_time).toLocaleString()}</span>
                                 <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {b.players} Units</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-xl font-black text-gray-900 dark:text-white italic">₹{Number(b.total_price).toFixed(0)}</div>
                              <div className={`text-[10px] font-black uppercase tracking-widest leading-none mt-2 ${b.payment_status === 'success' ? 'text-green-500' : 'text-amber-500'}`}>{b.payment_status}</div>
                           </div>
                        </div>
                     ))}
                 </div>
              </motion.div>
            )}

            {currentTab === 'earnings' && (
              <motion.div key="earnings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                 <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-primary/5 rounded-[3rem] p-12 border border-primary/10 relative overflow-hidden group h-[400px] flex flex-col justify-between">
                       <div className="relative z-10">
                          <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Net Revenue Projection</label>
                          <div className="text-7xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tighter">
                             ₹{Number(revenue?.monthly || 0).toLocaleString()}
                             <span className="text-sm font-black text-green-500 bg-green-500/10 px-4 py-2 rounded-full">+22%</span>
                          </div>
                       </div>
                       <div className="h-40 flex items-end gap-3 px-4 relative z-10">
                          {[30, 50, 40, 80, 60, 70, 45, 90, 85, 95, 75, 80].map((h, i) => (
                             <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg" />
                          ))}
                       </div>
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 pointer-events-none group-hover:scale-175 transition-transform"><BarChart3 className="w-96 h-96" /></div>
                    </div>
                    <div className="space-y-6">
                       {[
                         { label: "Bookings", value: revenue?.total_bookings || 0, icon: Activity, color: "text-blue-500" },
                         { label: "Completion", value: `${((revenue?.paid_bookings || 0) / (revenue?.total_bookings || 1) * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-green-500" },
                         { label: "Daily Avg", value: `₹${(Number(revenue?.monthly || 0) / 30).toFixed(0)}`, icon: CreditCard, color: "text-amber-500" }
                       ].map((s, i) => (
                         <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`p-4 rounded-2xl bg-white dark:bg-[#1A241D] ${s.color} shadow-sm`}><s.icon className="w-5 h-5" /></div>
                               <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{s.label}</div>
                            </div>
                            <div className="text-2xl font-black">{s.value}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {currentTab === 'add' && (
              <motion.div key="add" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-12">
                 <div className="flex items-center justify-between">
                    <div>
                      <button onClick={() => setTab('turfs')} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-colors mb-4 uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> CANCEL</button>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white">Publish <span className="text-primary italic">Venue</span></h2>
                    </div>
                    <div className="flex gap-2">
                       {[1, 2, 3].map(s => (
                         <div key={s} className={`w-10 h-1 h-1.5 rounded-full transition-all ${addStep >= s ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`} />
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8 bg-gray-50 dark:bg-white/2 rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/5 shadow-inner">
                    {addStep === 1 && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                          <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Asset Identity</label>
                            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-8 py-5 bg-white dark:bg-[#0B0F0C] border border-transparent focus:border-primary rounded-3xl text-sm font-black outline-none transition-all shadow-sm" placeholder="e.g. Skyline Sports Complex" />
                          </div>
                          <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Discipline</label>
                            <div className="grid grid-cols-2 gap-4">
                               {['football', 'cricket', 'badminton', 'tennis'].map(s => (
                                 <button key={s} onClick={() => setForm(p => ({ ...p, sport_type: s }))} className={`px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${form.sport_type === s ? 'bg-primary text-white shadow-xl shadow-green-500/20 scale-105' : 'bg-white dark:bg-[#0B0F0C] text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/10'}`}>{s}</button>
                               ))}
                            </div>
                          </div>
                       </motion.div>
                    )}
                    {addStep === 2 && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                          <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Geographic Location</label>
                            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full px-8 py-5 bg-white dark:bg-[#0B0F0C] border border-transparent focus:border-primary rounded-3xl text-sm font-black outline-none transition-all shadow-sm" placeholder="e.g. Pune, Kothrud" />
                          </div>
                       </motion.div>
                    )}
                    {addStep === 3 && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                          <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Hourly Asset Rate (₹)</label>
                            <div className="text-8xl font-black text-gray-900 dark:text-white flex items-center tracking-tighter">
                               ₹<input type="number" value={form.price_per_slot} onChange={e => setForm(p => ({ ...p, price_per_slot: Number(e.target.value) }))} className="bg-transparent border-none outline-none w-full ml-4" placeholder="1200" />
                            </div>
                          </div>
                       </motion.div>
                    )}

                    <div className="mt-16 flex items-center justify-between">
                       <button disabled={addStep === 1} onClick={() => setAddStep(addStep - 1)} className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all uppercase tracking-widest">Back</button>
                       {addStep < 3 ? (
                         <button onClick={() => setAddStep(addStep + 1)} className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest">Continue</button>
                       ) : (
                         <button onClick={handleCreateTurf} disabled={addLoading} className="px-12 py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-green-500/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3 text-lg">
                            {addLoading ? <RefreshCw className="animate-spin w-5 h-5" /> : <>PUBLISH VENUE <Sparkles className="w-5 h-5" /></>}
                         </button>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {(currentTab === 'profile' || currentTab === 'settings') && (
              <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-20 text-center">
                 <div className="w-24 h-24 rounded-[2rem] bg-gray-100 dark:bg-white/5 flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">👤</div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{user?.name}</h2>
                 <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-12 italic">{user?.role} Account · {user?.email}</p>
                 <div className="grid gap-4">
                    <button className="w-full py-5 bg-gray-50 dark:bg-white/5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-100 dark:border-white/5"><Settings className="w-4 h-4" /> Interface Settings</button>
                    <button onClick={logout} className="w-full py-5 bg-red-500/5 text-red-500 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/10 transition-all border border-red-500/10"><LogOut className="w-4 h-4" /> End Session</button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
