"use client";

import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { 
  PlusCircle, CreditCard, Clock, MapPin, ArrowUpRight, Database, 
  TrendingUp, Activity, BarChart3, Users, ChevronRight, Calendar,
  Zap, ShieldCheck, Star, Bell, Settings, LogOut, Search, Filter,
  CheckCircle2, AlertCircle, Trash2, Edit3, MoreVertical, Hash,
  RefreshCw, Terminal, Command, Power, Info
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow, EmptyState } from "../../../components/Skeletons";
import { notify } from "../../../lib/toast";
import { useTheme } from "../../../components/ThemeContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type Tab = 'overview' | 'bookings' | 'slots' | 'turfs' | 'finance' | 'customers' | 'coupons' | 'staff' | 'reports' | 'profile';

function OwnerDashboardContent() {
  const { user, token, logout } = useAuth();
  const { vibe } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentTab = (searchParams.get('tab') || 'overview') as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(currentTab);
  const [data, setData] = useState<any>({ turfs: [], bookings: [], customers: [], finance: { daily: [], total: 0 } });
  const [loading, setLoading] = useState(true);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  // Sync state with URL - MISSION CRITICAL
  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<any>("/api/dashboards/owner");
    if (res.ok) {
       setData({
         turfs: res.data.turfsOwned || [],
         bookings: res.data.bookings || [],
         customers: [], // Mocking for now
         finance: { daily: [30, 45, 32, 60, 40, 55, 70], total: 145000 }
       });
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [token]);

  const switchTab = (tab: Tab) => {
    router.push(`/dashboard/owner?tab=${tab}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
         
         {/* 1. INITIALIZATION OVERLAY */}
         <AnimatePresence>
            {loading && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-[#060806]/90 backdrop-blur-xl"
               >
                  <div className="relative flex flex-col items-center gap-6">
                     <div className="w-48 h-48 border-2 border-primary/20 rounded-full flex items-center justify-center relative overflow-hidden">
                        <motion.div 
                          initial={{ left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 bottom-0 w-[40px] bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-12"
                        />
                        <RefreshCw className="w-12 h-12 text-primary animate-spin opacity-40" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic">Synchronizing Operational Nodes...</span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* TOP TACTICAL HEADER */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="group cursor-default">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Partner Command Active</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic dark:text-white transition-all group-hover:tracking-normal group-hover:text-primary mt-1">
                  Owner <span className="text-primary opacity-60">Dashboard</span>
               </h1>
            </div>
            
            <div className="flex items-center gap-4">
               {/* INTERNAL TACTICAL NAV (ELITE) */}
               <div className="hidden xl:flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-border">
                  {(['overview', 'bookings', 'finance'] as Tab[]).map(t => (
                     <button 
                        key={t} onClick={() => switchTab(t)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-gray-400 hover:text-primary'}`}
                     >
                        {t}
                     </button>
                  ))}
               </div>
               <button onClick={() => setExitModalOpen(true)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><LogOut className="w-5 h-5" /></button>
            </div>
         </div>

         {/* MAIN OPERATIONAL AREA */}
         <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
               <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
                  
                  {/* HOLOGRAPHIC ANALYTICS CARDS */}
                  <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     <HoloCard label="Arena Occupancy" value="78.2%" icon={Activity} trend="+4.5%" chart={[40, 55, 42, 68, 55, 72, 78]} color="primary" />
                     <HoloCard label="Today's Revenue" value="₹12.4K" icon={TrendingUp} trend="+12.1%" chart={[30, 45, 32, 60, 40, 55, 70]} color="emerald" />
                     <HoloCard label="Pending Sync" value="8 Nodes" icon={Clock} trend="Manual" chart={[10, 15, 12, 18, 14, 16, 12]} color="amber" />
                     <HoloCard label="Entity Growth" value="1.2K" icon={Users} trend="+8.4%" chart={[20, 25, 22, 30, 28, 32, 30]} color="purple" />
                  </section>

                  <div className="grid lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8 space-y-10">
                        {/* PERFORMANCE CHART PROTOCOL */}
                        <div className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border shadow-2xl relative">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] italic font-black text-6xl uppercase tracking-tighter">Revenue Velocity</div>
                           <div className="p-10 border-b border-border bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                              <div>
                                 <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">Financial Intelligence</h3>
                                 <p className="text-3xl font-black tracking-tight dark:text-white mt-1">₹{data.finance.total.toLocaleString()}</p>
                              </div>
                              <button onClick={() => switchTab('finance')} className="btn-premium-primary !px-6 !text-[10px]">Audit Logs</button>
                           </div>
                           <div className="p-10 flex items-center justify-center min-h-[300px] border-b border-border">
                              <div className="flex items-end gap-3 h-[200px] w-full">
                                 {data.finance.daily.map((v: number, i: number) => (
                                    <motion.div 
                                      key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i*0.1, duration: 1 }}
                                      className="flex-1 bg-primary/20 rounded-t-xl hover:bg-primary transition-all relative group"
                                    >
                                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">₹{(v*100).toLocaleString()}</div>
                                    </motion.div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* RECENT BOOKINGS GRID */}
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <h3 className="text-sm font-black uppercase italic dark:text-white flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /> Active Activity Stream</h3>
                              <button onClick={() => switchTab('bookings')} className="text-[9px] font-black text-primary uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all">Export Protocol</button>
                           </div>
                           <div className="space-y-3">
                              {data.bookings.slice(0, 5).map((b: any, i: number) => (
                                 <motion.div key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }}>
                                    <div className="card-compact !p-5 flex items-center justify-between border border-border bg-white/80 dark:bg-card hover:bg-primary/[0.02] transition-all group rounded-3xl">
                                       <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-black flex items-center justify-center text-gray-400 group-hover:text-primary transition-all border border-border group-hover:scale-105 group-hover:rotate-3">
                                             <Clock className="w-5 h-5" />
                                          </div>
                                          <div>
                                             <div className="text-xs font-black dark:text-white uppercase italic tracking-tight">{b.turf_name}</div>
                                             <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60 flex items-center gap-2">
                                                <Hash className="w-2.5 h-2.5" /> {b.id.slice(0, 8)} · {b.date} · {b.start_time}
                                             </div>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-8">
                                          <div className="text-right">
                                             <div className="text-sm font-black dark:text-white">₹{b.total_price}</div>
                                             <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${b.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>{b.status}</div>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-10">
                        {/* QUICK ACTION HUBS */}
                        <div className="card-compact p-8 space-y-8 bg-white dark:bg-card border-border shadow-2xl">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-white italic">Operational Override</h3>
                           <div className="grid gap-3">
                              <ActionButton label="Initialize New Arena" icon={PlusCircle} onClick={() => switchTab('turfs')} color="primary" />
                              <ActionButton label="Financial Split" icon={CreditCard} onClick={() => switchTab('finance')} color="emerald" />
                              <ActionButton label="Platform Coupons" icon={Zap} onClick={() => switchTab('coupons')} color="amber" />
                              <ActionButton label="Team Governance" icon={ShieldCheck} onClick={() => switchTab('staff')} color="purple" />
                           </div>
                        </div>

                        {/* ARENA CLUSTER STATUS */}
                        <div className="card-compact p-8 bg-black dark:bg-[#060806] border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl italic text-white pointer-events-none">NODE</div>
                           <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] italic mb-6">Cluster Health</h3>
                           <div className="space-y-4">
                              {data.turfs.map((t: any) => (
                                 <div key={t.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                       <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60 italic">{t.name}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-white italic">ONLINE</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* TAB: BOOKINGS & CALENDAR */}
            {activeTab === 'bookings' && (
               <motion.div key="bookings" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-2">
                        <h2 className="text-3xl font-black uppercase italic dark:text-white tracking-widest">Tactical <span className="text-primary italic opacity-60">Scheduler</span></h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Real-time session oversight cluster</p>
                     </div>
                     <div className="flex gap-4">
                        <button className="btn-premium-primary !px-8 !text-[11px] !italic shadow-xl">Manual Protocol Entry</button>
                        <button className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-border"><Filter className="w-5 h-5 text-gray-400" /></button>
                     </div>
                  </div>

                  {/* CALENDAR ENGINE (PRODUCTION GRADE) */}
                  <div className="grid lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-12 card-compact p-8 bg-white dark:bg-card border-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-8xl font-black italic pointer-events-none uppercase">Schedule</div>
                        <div className="custom-calendar-protocol">
                           <FullCalendar
                              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                              initialView="timeGridWeek"
                              headerToolbar={{
                                 left: 'prev,next today',
                                 center: 'title',
                                 right: 'dayGridMonth,timeGridWeek,timeGridDay'
                              }}
                              allDaySlot={false}
                              slotMinTime="06:00:00"
                              slotMaxTime="24:00:00"
                              events={data.bookings.map((b: any) => ({
                                 id: b.id,
                                 title: b.turf_name,
                                 start: `${b.date}T${b.start_time}`,
                                 end: `${b.date}T${b.end_time}`,
                                 classNames: [b.status === 'confirmed' ? 'fc-event-confirmed' : 'fc-event-pending']
                              }))}
                              height="auto"
                              editable={true}
                              selectable={true}
                              selectMirror={true}
                              dayMaxEvents={true}
                              eventClick={(info) => notify.info(`Session ${info.event.id.slice(0,8)} Loaded`)}
                           />
                        </div>
                     </div>
                  </div>

                  {/* MINI ACTIVITY STREAM (CONTEXTUAL) */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 border-b border-border pb-4">
                         <div className="p-2 bg-primary/10 rounded-lg"><Activity className="w-4 h-4 text-primary" /></div>
                         <h3 className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-white italic">Session Log History</h3>
                     </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.bookings.map((b: any, i: number) => (
                           <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} className="card-compact !p-5 bg-white dark:bg-card border border-border hover:border-primary/20 group">
                              <div className="flex justify-between items-start mb-4">
                                 <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{b.status}</div>
                                 <span className="text-[9px] font-black text-gray-400 italic">ID: {b.id.slice(0, 8)}</span>
                              </div>
                              <h4 className="text-sm font-black dark:text-white uppercase italic truncate pr-4">{b.turf_name}</h4>
                              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 italic"><Clock className="w-3 h-3" /> {b.start_time} - {b.end_time}</div>
                                 <div className="text-[10px] font-black text-primary italic ml-auto">₹{b.total_price}</div>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            )}

            {/* TAB: TURFS */}
            {activeTab === 'turfs' && (
               <motion.div key="turfs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center justify-between">
                     <h2 className="text-3xl font-black uppercase italic dark:text-white tracking-widest">Arena <span className="text-primary italic opacity-60">Governance</span></h2>
                     <button className="btn-premium-primary !py-4 !px-10 shadow-2xl !italic">Initialize Site</button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {data.turfs.map((t: any, i: number) => (
                        <motion.div key={t.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.1 }}>
                           <ArenaCard arena={t} />
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* TERMINATION MODAL */}
         <AnimatePresence>
            {exitModalOpen && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExitModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-md bg-white dark:bg-[#0B0F0C] border border-white/5 rounded-[2.5rem] shadow-2xl p-10 text-center space-y-8 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-8xl font-black italic pointer-events-none">EXIT</div>
                     <div className="w-20 h-20 bg-rose-500/10 rounded-3xl mx-auto flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10 border border-rose-500/20">
                        <LogOut className="w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white leading-none">Terminate Session?</h2>
                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-8 mt-2">Operational credentials will be cleared and you will be returned to base station.</p>
                     </div>
                     <div className="flex flex-col gap-3">
                        <button onClick={() => { logout(); router.push('/'); }} className="btn-premium-primary !bg-rose-500 !shadow-rose-500/20 w-full !italic">Return to Base Station</button>
                        <button onClick={() => setExitModalOpen(false)} className="px-8 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all italic">Stay Operational</button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
    </div>
  );
}

// ── HOLO 3D CARD (PREMIUM ANALYTICS) ──
function HoloCard({ label, value, icon: Icon, trend, chart, color }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [0, 300], [10, -10]), { damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 400], [-10, 10]), { damping: 20 });

  const colors: any = {
     primary: 'text-primary bg-primary/10 border-primary/20 shadow-primary/10',
     emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
     amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
     purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10'
  };

  return (
     <motion.div 
        ref={containerRef}
        onMouseMove={(e) => {
           const rect = containerRef.current?.getBoundingClientRect();
           if (rect) { mouseX.set(e.clientX - rect.left); mouseY.set(e.clientY - rect.top); }
        }}
        onMouseLeave={() => { mouseX.set(200); mouseY.set(150); }}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="card-compact !p-6 flex flex-col justify-between h-[180px] border border-border group hover:border-primary/40 transition-all shadow-md hover:shadow-2xl bg-white dark:bg-card relative overflow-hidden"
     >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-primary/5 to-transparent rotate-45 group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
        
        <div className="flex justify-between items-start relative z-10">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6 ${colors[color]}`}>
              <Icon className="w-6 h-6" />
           </div>
           <div className="text-[11px] font-black italic text-emerald-500 tracking-tighter bg-emerald-500/5 px-2 py-0.5 rounded-lg">{trend}</div>
        </div>

        <div className="relative z-10 mt-6 overflow-hidden">
           <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 opacity-60 italic">{label}</div>
           <div className="flex items-end justify-between">
              <div className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white leading-none italic">{value}</div>
              <div className="flex items-end gap-1 h-8 w-16 px-1">
                 {chart.map((v: number, i: number) => (
                    <div key={i} className={`flex-1 rounded-full ${colors[color].split(' ')[0].replace('text-', 'bg-')} opacity-20 group-hover:opacity-60 transition-all`} style={{ height: `${(v/Math.max(...chart))*100}%` }} />
                 ))}
              </div>
           </div>
        </div>
     </motion.div>
  );
}

function ActionButton({ label, icon: Icon, onClick, color }: any) {
  const colors: any = {
     primary: 'text-primary bg-primary/5 hover:bg-primary/10 border-primary/20',
     emerald: 'text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20',
     amber: 'text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20',
     purple: 'text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20',
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group box-border ${colors[color]}`}>
       <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 font-black" />
       </div>
       <div>
          <div className="text-[11px] font-black uppercase tracking-tight dark:text-white italic">{label}</div>
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Initialize Node</div>
       </div>
       <ChevronRight className="w-4 h-4 ml-auto opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
    </button>
  );
}

function ArenaCard({ arena }: { arena: any }) {
  return (
    <div className="card-premium !p-0 overflow-hidden group hover:border-primary/40 transition-all h-[420px] flex flex-col bg-white dark:bg-card border border-border shadow-xl">
       <div className="h-[200px] relative overflow-hidden bg-black">
          <img src={arena.images || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt={arena.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute top-4 right-4"><div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20"><MoreVertical className="w-5 h-5 text-white" /></div></div>
          <div className="absolute bottom-6 left-6">
             <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Operational</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/10 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Verified Node</span>
             </div>
             <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">{arena.name}</h4>
          </div>
       </div>
       <div className="p-8 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Revenue Yield</span>
                <div className="text-xl font-black dark:text-white tracking-tighter uppercase italic leading-none">₹{arena.price_weekday} <span className="text-[10px] opacity-40">/ Hour</span></div>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Performance</span>
                <div className="text-sm font-black text-emerald-500 uppercase italic">84% Occupancy</div>
             </div>
          </div>
          <div className="pt-6 border-t border-border mt-6 flex gap-3">
             <button className="flex-1 btn-premium-primary !py-3 !text-[10px] !italic">Monitor Assets</button>
             <button className="w-12 h-12 bg-gray-50 dark:bg-white/5 flex items-center justify-center rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
          </div>
       </div>
    </div>
  );
}

// ── SUSPENSE WRAPPER ──
export default function OwnerDashboard() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#060806]">
            <RefreshCw className="w-10 h-10 text-primary animate-spin" />
         </div>
      }>
         <OwnerDashboardContent />
      </Suspense>
   );
}
