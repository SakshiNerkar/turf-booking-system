"use client";

import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { 
  PlusCircle, CreditCard, Clock, MapPin, ArrowUpRight, Database, 
  TrendingUp, Activity, BarChart3, Users, ChevronRight, Calendar as CalendarIcon,
  Zap, ShieldCheck, Star, Bell, Settings, LogOut, Search, Filter,
  CheckCircle2, AlertCircle, Trash2, Edit3, MoreVertical, Hash,
  RefreshCw, Power, Info, Download, Trash, UserPlus, X, Wallet,
  Check, XCircle
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
  const [data, setData] = useState<any>({ turfs: [], bookings: [], customers: [], finance: { daily: [], history: [], total: 0 } });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal States
  const [modalType, setModalType] = useState<string | null>(null);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  // Sync state with URL
  useEffect(() => { setActiveTab(currentTab); }, [currentTab]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<any>("/api/dashboards/owner");
    if (res.ok) {
       setData({
         turfs: res.data.turfsOwned || [],
         bookings: res.data.bookings || [],
         customers: [
           { id: '1', name: 'Kabir Singh', email: 'kabir@athlete.com', visits: 12, last: '2h ago' },
           { id: '2', name: 'Rohan Mehta', email: 'rohan@arena.com', visits: 8, last: '1d ago' },
           { id: '3', name: 'Sanya Gupta', email: 'sanya@sports.com', visits: 15, last: '5h ago' }
         ],
         finance: { 
           daily: [30, 45, 32, 60, 40, 55, 70], 
           total: 145000, 
           history: [
              { id: 'TX-901', amount: '₹1,200', type: 'Credit', status: 'Success', date: '2026-03-27' },
              { id: 'TX-902', amount: '₹1,500', type: 'Credit', status: 'Success', date: '2026-03-27' },
              { id: 'TX-903', amount: '₹1,100', type: 'Refund', status: 'Pending', date: '2026-03-26' },
           ]
         }
       });
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [token]);

  const switchTab = (tab: Tab) => { router.push(`/dashboard/owner?tab=${tab}`); };

  // Tactical Handlers
  const handleExport = (type: string) => {
     setActionLoading(`Exporting ${type} Protocol...`);
     setTimeout(() => {
        setActionLoading(null);
        notify.success(`${type} Data Exported Successfully`);
     }, 1500);
  };

  const handleAction = (label: string) => {
     setModalType(label);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative pb-20">
         
         {/* 1. INITIALIZATION OVERLAY */}
         <AnimatePresence>
            {loading && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-[#060806]/90 backdrop-blur-xl">
                  <div className="relative flex flex-col items-center gap-6">
                     <div className="w-48 h-48 border-2 border-primary/20 rounded-full flex items-center justify-center relative overflow-hidden">
                        <motion.div initial={{ left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute top-0 bottom-0 w-[40px] bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-12" />
                        <RefreshCw className="w-12 h-12 text-primary animate-spin opacity-40" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic">Synchronizing Operational Nodes...</span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* ── MANDATORY ONBOARDING PROTOCOL ── */}
         <AnimatePresence>
            {!loading && data.turfs.length === 0 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[150] bg-white dark:bg-[#060806] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                  <div className="absolute inset-0 bg-stadium-texture opacity-[0.03] pointer-events-none" />
                  <motion.div 
                    initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
                    className="w-full max-w-2xl bg-white dark:bg-card border border-border shadow-3xl rounded-[3rem] p-10 md:p-16 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-16 opacity-[0.02] text-9xl font-black italic text-primary pointer-events-none uppercase tracking-tighter">START</div>
                     
                     <div className="space-y-10 relative z-10">
                        <div className="space-y-2">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                              <ShieldCheck className="w-4 h-4" /> Operational Initiation
                           </div>
                           <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter dark:text-white leading-none">
                              Initialize Your <span className="text-primary italic">First Arena</span>
                           </h2>
                           <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic max-w-md">Our global network requires at least one active node to synchronize your command credentials.</p>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); notify.success('Arena Synched Successfully!'); loadData(); }}>
                           <div className="grid md:grid-cols-2 gap-6">
                              <Input label="Facility Designation*" placeholder="Ex: Camp Nou Arena" required />
                              <Input label="Operational City*" placeholder="Ex: Pune / Mumbai" required />
                           </div>
                           <div className="grid md:grid-cols-2 gap-6">
                              <Input label="Primary Discipline*" placeholder="Ex: Football, Cricket" required />
                              <Input label="Hourly Yield (₹)*" placeholder="Ex: 1800" type="number" required />
                           </div>
                           <div className="pt-6">
                              <button type="submit" className="btn-premium-primary !w-full !py-5 !text-sm !italic shadow-[0_30px_60px_rgba(34,197,94,0.3)]">
                                 Authorize & Launch Arena Node
                              </button>
                              <button 
                                onClick={() => { logout(); router.push('/'); }} 
                                type="button" 
                                className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-rose-500 transition-all italic"
                              >
                                Abort Identification & Sign Out
                              </button>
                           </div>
                        </form>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* TOP TACTICAL HEADER */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="group">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">Partner Command Active</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic dark:text-white transition-all group-hover:tracking-normal group-hover:text-primary mt-1">
                  Owner <span className="text-primary opacity-60 italic">Force</span>
               </h1>
            </motion.div>
            
            <div className="flex items-center gap-4">
               <div className="hidden xl:flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-border">
                  {(['overview', 'bookings', 'finance', 'reports'] as Tab[]).map(t => (
                     <button key={t} onClick={() => switchTab(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-gray-400 hover:text-primary'}`}>
                        {t}
                     </button>
                  ))}
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => handleExport('CSV')} className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-primary transition-all shadow-sm" title="Export Analytics"><Download className="w-5 h-5" /></button>
                  <button onClick={() => setExitModalOpen(true)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Terminate Session"><LogOut className="w-5 h-5" /></button>
               </div>
            </div>
         </div>

         {/* MAIN OPERATIONAL AREA */}
         <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
               <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
                  
                  {/* HOLOGRAPHIC ANALYTICS CARDS */}
                  <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     <HoloCard label="Arena Occupancy" value="78.2%" icon={Activity} trend="+4.5%" chart={[40, 55, 42, 68, 55, 72, 78]} color="primary" onClick={() => switchTab('reports')} />
                     <HoloCard label="Today's Revenue" value="₹12.4K" icon={TrendingUp} trend="+12.1%" chart={[30, 45, 32, 60, 40, 55, 70]} color="emerald" onClick={() => switchTab('finance')} />
                     <HoloCard label="Pending Sync" value="8 Nodes" icon={Clock} trend="Manual" chart={[10, 15, 12, 18, 14, 16, 12]} color="amber" onClick={() => switchTab('bookings')} />
                     <HoloCard label="Entity Growth" value="1.2K" icon={Users} trend="+8.4%" chart={[20, 25, 22, 30, 28, 32, 30]} color="purple" onClick={() => switchTab('customers')} />
                  </section>

                  <div className="grid lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8 space-y-12">
                        {/* PERFORMANCE CHART PROTOCOL */}
                        <div className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border shadow-2xl relative">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] italic font-black text-6xl uppercase tracking-tighter">Revenue Velocity</div>
                           <div className="p-10 border-b border-border bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                              <div>
                                 <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">Financial Intelligence Cluster</h3>
                                 <p className="text-4xl font-black tracking-tight dark:text-white mt-1">₹{data.finance.total.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                 <select className="bg-white dark:bg-black/40 border border-border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none">
                                    <option>Past 7 Days</option>
                                    <option>Past 30 Days</option>
                                 </select>
                                 <button onClick={() => setModalType('Audit Logs')} className="btn-premium-primary !px-6 !text-[10px] !italic">Audit Logs</button>
                              </div>
                           </div>
                           <div className="p-10 flex items-center justify-center min-h-[350px] border-b border-border">
                              <div className="flex items-end gap-3 h-[250px] w-full">
                                 {data.finance.daily.map((v: number, i: number) => (
                                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i*0.1, duration: 1 }} className="flex-1 bg-primary/20 rounded-t-2xl hover:bg-primary transition-all relative group shadow-sm">
                                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-2xl skew-x-[-10deg]">₹{(v * 100).toLocaleString()}</div>
                                    </motion.div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* RECENT BOOKINGS GRID */}
                        <div className="space-y-6">
                           <div className="flex items-center justify-between border-l-4 border-primary pl-4 py-1">
                              <div>
                                 <h3 className="text-sm font-black uppercase italic dark:text-white">Active Activity Stream</h3>
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time session heartbeat</p>
                              </div>
                              <button onClick={() => switchTab('bookings')} className="text-[9px] font-black text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all italic">Full Sequence</button>
                           </div>
                           <div className="grid gap-3">
                              {data.bookings.slice(0, 5).map((b: any, i: number) => (
                                 <motion.div key={b.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }}>
                                    <div className="card-compact !p-5 flex items-center justify-between border border-border bg-white/80 dark:bg-card hover:bg-primary/[0.02] transition-all group rounded-[2rem] shadow-sm hover:shadow-xl">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-black/40 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all border border-border group-hover:scale-110 group-hover:rotate-6">
                                             <CalendarIcon className="w-6 h-6" />
                                          </div>
                                          <div>
                                             <div className="text-sm font-black dark:text-white uppercase italic tracking-tight">{b.turf_name}</div>
                                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60 flex items-center gap-3">
                                                <span className="flex items-center gap-1.5 text-primary"><Clock className="w-3.5 h-3.5" /> {b.date} · {b.start_time}</span>
                                                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                <span>UID: {b.id.slice(0, 8)}</span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-10">
                                          <div className="text-right">
                                             <div className="text-lg font-black dark:text-white leading-none italic">₹{b.total_price}</div>
                                             <div className={`text-[9px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5 justify-end ${b.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                                                {b.status}
                                             </div>
                                          </div>
                                          <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"><ChevronRight className="w-5 h-5" /></button>
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-12">
                        {/* THE OPERATIONAL OVERRIDE DECK */}
                        <div className="card-compact p-10 space-y-10 bg-white dark:bg-card border-border shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-8xl font-black italic pointer-events-none group-hover:opacity-[0.05] transition-opacity">OPS</div>
                           <h3 className="text-[12px] font-black uppercase tracking-[0.4em] dark:text-white italic">Tactical Override</h3>
                           <div className="grid gap-4">
                              <ActionButton label="Initialize New Arena" desc="Register Regional Node" icon={PlusCircle} onClick={() => handleAction('Initialize Arena')} color="primary" />
                              <ActionButton label="Financial Split" desc="Revenue Share Protocol" icon={CreditCard} onClick={() => handleAction('Financial Split')} color="emerald" />
                              <ActionButton label="Platform Coupons" desc="Energy Incentive Codes" icon={Zap} onClick={() => handleAction('Platform Coupons')} color="amber" />
                              <ActionButton label="Team Governance" desc="Member Permissions" icon={ShieldCheck} onClick={() => handleAction('Team Governance')} color="purple" />
                           </div>
                        </div>

                        {/* ACTIVITY PULSE GRID */}
                        <div className="card-compact p-10 bg-black dark:bg-[#060806] border border-white/5 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl italic text-white pointer-events-none group-hover:opacity-10 transition-opacity">LIVE</div>
                           <div className="flex items-center gap-4 mb-8">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20"><Activity className="w-5 h-5 animate-pulse" /></div>
                              <h3 className="text-xs font-black uppercase text-white tracking-[0.4em] italic leading-none">Activity Pulse</h3>
                           </div>
                           <div className="space-y-6">
                              {[
                                 { msg: "Arena 'Sector 7' Booked", time: "2m ago", icon: CheckCircle2, color: 'text-emerald-500' },
                                 { msg: "Payment Interface Sync", time: "14m ago", icon: Wallet, color: 'text-blue-500' },
                                 { msg: "Operational Log Updated", time: "25m ago", icon: Database, color: 'text-gray-400' },
                                 { msg: "New Athlete Registered", time: "1h ago", icon: Users, color: 'text-purple-500' }
                              ].map((feed, idx) => (
                                 <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx*0.1 }} className="flex items-start gap-4 group/item">
                                    <feed.icon className={`w-4 h-4 mt-0.5 ${feed.color} opacity-60 group-hover/item:opacity-100 transition-opacity`} />
                                    <div>
                                       <div className="text-[11px] font-black text-white italic tracking-tight">{feed.msg}</div>
                                       <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{feed.time}</div>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* TAB: BOOKINGS & CALENDAR */}
            {activeTab === 'bookings' && (
               <motion.div key="bookings" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="space-y-2 translate-y-2">
                        <h2 className="text-4xl font-black uppercase italic dark:text-white tracking-widest">Tactical <span className="text-primary italic opacity-60">Scheduler</span></h2>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] italic">High-fidelity session oversight matrix</p>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setModalType('Initialize Arena')} className="btn-premium-primary !px-10 !text-[11px] !italic shadow-[0_20px_40px_rgba(34,197,94,0.3)]">Initialize Sequence</button>
                        <button className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl border border-border group hover:border-primary/40 transition-all"><Filter className="w-5 h-5 text-gray-400 group-hover:text-primary" /></button>
                     </div>
                  </div>

                  <div className="card-compact p-10 bg-white dark:bg-card border-border shadow-3xl relative overflow-hidden custom-calendar-protocol">
                     <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
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
                        eventClick={(info) => notify.info(`Session ${info.event.id.slice(0,8)} Identified`)}
                     />
                  </div>
               </motion.div>
            )}

            {/* TAB: FINANCE */}
            {activeTab === 'finance' && (
               <motion.div key="finance" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                  <div className="flex items-center justify-between">
                     <div className="space-y-2">
                        <h2 className="text-4xl font-black uppercase italic dark:text-white tracking-widest leading-none">Financial <span className="text-emerald-500 italic opacity-60">Intelligence</span></h2>
                        <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest italic bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                           <AlertCircle className="w-3.5 h-3.5" /> Profit Velocity High
                        </div>
                     </div>
                     <button onClick={() => handleExport('FINANCE')} className="btn-premium-primary !bg-emerald-500 !shadow-emerald-500/20 !px-10 !italic">Export Audit</button>
                  </div>
                  <div className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border shadow-2xl">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/[0.02]">
                           <tr>
                              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-gray-400 italic">TX ID</th>
                              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-gray-400 italic">DateTime</th>
                              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-gray-400 italic">Total Yield</th>
                              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-gray-400 italic">Execution Status</th>
                              <th className="p-8 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 italic">Protocol</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                           {data.finance.history.map((tx: any) => (
                              <tr key={tx.id} className="hover:bg-emerald-500/[0.01] transition-colors group">
                                 <td className="p-8 font-black text-xs dark:text-white uppercase italic tracking-tighter">{tx.id}</td>
                                 <td className="p-8 text-xs font-bold text-gray-500 italic">{tx.date}</td>
                                 <td className="p-8 font-black text-sm dark:text-white italic">{tx.amount}</td>
                                 <td className="p-8">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${tx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                       {tx.status}
                                    </span>
                                 </td>
                                 <td className="p-8 text-right">
                                    <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:text-emerald-500"><Download className="w-4 h-4" /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </motion.div>
            )}

            {/* TAB: CRM */}
            {activeTab === 'customers' && (
               <motion.div key="crm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                  <div className="flex items-center justify-between">
                     <h2 className="text-4xl font-black uppercase italic dark:text-white tracking-widest leading-none">Athlete <span className="text-primary italic opacity-60">Governance</span></h2>
                     <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input placeholder="Search Athletes..." className="w-full pl-12 pr-6 py-3 bg-white dark:bg-white/5 border border-border rounded-2xl text-xs font-black uppercase italic outline-none focus:border-primary transition-all shadow-sm" />
                     </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {data.customers.map((c: any) => (
                        <div key={c.id} className="card-premium p-8 space-y-6 hover:border-primary/40 transition-all group relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-6xl font-black italic pointer-events-none group-hover:opacity-[0.08] transition-opacity">ATHLETE</div>
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl italic border border-primary/20 shadow-xl group-hover:bg-primary group-hover:text-white transition-all">{c.name[0]}</div>
                              <div>
                                 <div className="text-lg font-black dark:text-white uppercase italic tracking-tighter leading-none">{c.name}</div>
                                 <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2">{c.email}</div>
                              </div>
                           </div>
                           <div className="flex items-center justify-between py-5 border-y border-border">
                              <div><div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Platform Syncs</div><div className="text-xl font-black dark:text-white italic">{c.visits}</div></div>
                              <div className="text-right"><div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Last Activity</div><div className="text-sm font-black text-primary italic">{c.last}</div></div>
                           </div>
                           <div className="flex gap-2 pt-2">
                              <button className="flex-1 btn-premium-primary !py-3 !text-[10px] !italic">Session History</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* ── GLOBAL MODALS ENGINE ── */}
         <AnimatePresence>
            {modalType && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="fixed inset-0 bg-black/95 backdrop-blur-xl" />
                  <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="w-full max-w-2xl bg-white dark:bg-[#0B0F0C] border border-white/5 rounded-[3rem] shadow-3xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-9xl font-black italic pointer-events-none tracking-tighter uppercase">{modalType.split(' ')[0]}</div>
                        <div className="flex items-center justify-between mb-12">
                           <div className="space-y-1">
                              <h2 className="text-3xl font-black uppercase italic tracking-tighter dark:text-white">{modalType} <span className="text-primary italic opacity-60">Protocol</span></h2>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Operational Override Execution Zone</p>
                           </div>
                           <button onClick={() => setModalType(null)} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-border"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="space-y-8">
                           {modalType === 'Initialize Arena' && (
                              <div className="grid gap-6">
                                 <div className="grid sm:grid-cols-2 gap-4">
                                    <Input label="Arena Name" placeholder="Ex: Elite Stadium X" />
                                    <Input label="Sector Coordinates" placeholder="City / Region" />
                                 </div>
                                 <div className="grid sm:grid-cols-2 gap-4">
                                    <Input label="Hourly Yield (₹)" placeholder="2000" />
                                    <Input label="Arena Dimensions" placeholder="5-a-side" />
                                 </div>
                                 <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setModalType(null)} className="px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all italic">Abort Sequence</button>
                                    <button onClick={() => { notify.success('Arena Node Created'); setModalType(null); }} className="btn-premium-primary !px-12 !italic">Initialize Site</button>
                                 </div>
                              </div>
                           )}
                           {modalType === 'Audit Logs' && (
                              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                                 {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="p-6 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 flex items-center justify-between border border-border group hover:border-emerald-500/40 transition-all">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Power className="w-5 h-5" /></div>
                                          <div>
                                             <div className="text-[10px] font-black dark:text-white uppercase italic tracking-tight">Financial Sync Successful</div>
                                             <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1 opacity-60">ID: SEC-099-0{i} · 2m ago</div>
                                          </div>
                                       </div>
                                       <div className="text-emerald-500 font-bold text-xs uppercase italic">+₹1,450</div>
                                    </div>
                                 ))}
                              </div>
                           )}
                           {modalType === 'Financial Split' && (
                              <div className="space-y-8">
                                 <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between shadow-sm">
                                    <div className="space-y-1">
                                       <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Core Share Ratio</div>
                                       <div className="text-3xl font-black dark:text-white">85 <span className="text-emerald-500 italic opacity-40">%</span></div>
                                    </div>
                                    <TrendingUp className="w-12 h-12 text-emerald-500 opacity-20" />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Adjust Operational Split</label>
                                    <input type="range" className="w-full accent-primary h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                                    <p className="text-[9px] font-black text-gray-500 uppercase italic">Turff Platform Fee: 15% (Locked)</p>
                                 </div>
                                 <button onClick={() => { notify.success('Split Configuration Saved'); setModalType(null); }} className="btn-premium-primary !bg-emerald-500 !w-full !italic py-4 shadow-xl shadow-emerald-500/20">Save Operational Hierarchy</button>
                              </div>
                           )}
                           {modalType === 'Platform Coupons' && (
                              <div className="space-y-6">
                                 <div className="grid gap-4">
                                    <Input label="Coupon Sequence" placeholder="EX: STADIUM50" />
                                    <Input label="Incentive Ratio (%)" placeholder="20" />
                                 </div>
                                 <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 text-center">
                                    <div className="text-2xl font-black text-amber-500 italic tracking-tighter uppercase animate-pulse">Energy Incentive Active</div>
                                 </div>
                                 <button onClick={() => { notify.success('Promo Protocol Initialized'); setModalType(null); }} className="btn-premium-primary !bg-amber-500 !w-full !italic py-4 shadow-xl shadow-amber-500/20">Authorize Protocol</button>
                              </div>
                           )}
                           {modalType === 'Team Governance' && (
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Operational Staff</h4>
                                    <button className="text-[9px] font-black text-primary uppercase tracking-widest">+ Add Member</button>
                                 </div>
                                 <div className="space-y-3">
                                    {['Manager', 'Custodian', 'Field Tech'].map(role => (
                                       <div key={role} className="p-5 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-center justify-between group hover:border-purple-500/40 transition-all">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold text-xs">{role[0]}</div>
                                             <div><div className="text-[10px] font-black dark:text-white uppercase italic">{role} Protocol</div><div className="text-[8px] font-black text-gray-500 uppercase italic leading-none mt-1">Status: Active</div></div>
                                          </div>
                                          <button className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash className="w-4 h-4" /></button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* TERMINATION MODAL */}
         <AnimatePresence>
            {exitModalOpen && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExitModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                  <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-md bg-white dark:bg-[#0B0F0C] border border-white/5 rounded-[2.5rem] shadow-2xl p-10 text-center space-y-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-8xl font-black italic pointer-events-none">EXIT</div>
                     <div className="w-20 h-20 bg-rose-500/10 rounded-3xl mx-auto flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10 border border-rose-500/20"><LogOut className="w-10 h-10" /></div>
                     <div className="space-y-2"><h2 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white leading-none">Terminate Session?</h2><p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-8 mt-2">Operational credentials will be cleared and you will be returned to base station.</p></div>
                     <div className="flex flex-col gap-3">
                        <button onClick={() => { logout(); router.push('/'); }} className="btn-premium-primary !bg-rose-500 !shadow-rose-500/20 w-full !italic text-[11px] py-4">Return to Base Station</button>
                        <button onClick={() => setExitModalOpen(false)} className="px-8 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all italic">Stay Operational</button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* GLOBAL PROTOCOL OVERLAY (ACTION LOADING) */}
         <AnimatePresence>
            {actionLoading && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250] flex flex-col items-center justify-center gap-6">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 bg-white dark:bg-card rounded-[2rem] flex items-center justify-center shadow-[0_30px_60px_rgba(34,197,94,0.3)] border border-primary/20 relative">
                     <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                     <div className="absolute inset-2 border-2 border-primary/10 rounded-[1.5rem] animate-[ping_3s_infinite]" />
                  </motion.div>
                  <div className="text-center space-y-2">
                     <span className="text-[11px] font-black text-white uppercase tracking-[0.8em] animate-pulse italic">{actionLoading}</span>
                     <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] opacity-60 italic">Authorized Payout Override In Progress</p>
                  </div>
               </div>
            )}
         </AnimatePresence>
    </div>
  );
}

// ── HOLO 3D CARD (PREMIUM ANALYTICS) ──
function HoloCard({ label, value, icon: Icon, trend, chart, color, onClick }: any) {
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
     <motion.div ref={containerRef} onClick={onClick}
        onMouseMove={(e) => { const rect = containerRef.current?.getBoundingClientRect(); if (rect) { mouseX.set(e.clientX - rect.left); mouseY.set(e.clientY - rect.top); } }}
        onMouseLeave={() => { mouseX.set(200); mouseY.set(150); }}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="card-compact !p-8 flex flex-col justify-between h-[200px] border border-border group hover:border-primary/40 transition-all shadow-md hover:shadow-2xl bg-white dark:bg-card relative overflow-hidden cursor-pointer"
     >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-primary/5 to-transparent rotate-45 group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
        
        <div className="flex justify-between items-start relative z-10">
           <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center border shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6 ${colors[color]}`}>
              <Icon className="w-7 h-7" />
           </div>
           <div className="text-[10px] font-black italic text-emerald-500 tracking-tighter bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">{trend}</div>
        </div>

        <div className="relative z-10">
           <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3 opacity-60 italic">{label}</div>
           <div className="flex items-end justify-between">
              <div className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-none italic">{value}</div>
              <div className="flex items-end gap-1.5 h-10 w-20 px-1 translate-y-2">
                 {chart.map((v: number, i: number) => (
                    <div key={i} className={`flex-1 rounded-full ${colors[color].split(' ')[0].replace('text-', 'bg-')} opacity-20 group-hover:opacity-80 transition-all shadow-sm`} style={{ height: `${(v/Math.max(...chart))*100}%` }} />
                 ))}
              </div>
           </div>
           <div className="mt-4 pt-4 border-t border-border/10 flex items-center gap-2 text-[8px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity leading-none">View Detailed Report <ChevronRight className="w-3 h-3" /></div>
        </div>
     </motion.div>
  );
}

function ActionButton({ label, desc, icon: Icon, onClick, color }: any) {
  const colors: any = {
     primary: 'text-primary bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40',
     emerald: 'text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
     amber: 'text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40',
     purple: 'text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40',
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all text-left group box-border relative overflow-hidden ${colors[color]}`}>
       <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100" />
       <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all border border-black/5">
          <Icon className="w-6 h-6 font-black" />
       </div>
       <div className="relative z-10 flex-1">
          <div className="text-[12px] font-black uppercase tracking-tight dark:text-white italic">{label}</div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">{desc}</div>
       </div>
       <ChevronRight className="w-5 h-5 ml-auto opacity-20 group-hover:translate-x-2 group-hover:opacity-100 transition-all" />
       <div className="absolute top-0 bottom-0 left-0 w-1 bg-current opacity-0 group-hover:opacity-40 transition-opacity" />
    </button>
  );
}

function Input({ label, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{label}</label>
       <input type={type} placeholder={placeholder} className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-border rounded-xl text-xs font-black uppercase italic outline-none focus:border-primary transition-all shadow-sm" />
    </div>
  );
}

// ── SUSPENSE WRAPPER ──
export default function OwnerDashboard() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#060806]"><RefreshCw className="w-10 h-10 text-primary animate-spin" /></div>}>
         <OwnerDashboardContent />
      </Suspense>
   );
}
