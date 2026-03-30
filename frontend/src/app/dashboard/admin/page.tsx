"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Users, Activity, Trophy, Shield, Zap, TrendingUp, CreditCard, 
  MapPin, Clock, Search, Filter, ArrowUpRight, CheckCircle2, 
  AlertCircle, Database, LayoutDashboard, Globe, Settings, Map,
  Bell, LogOut, User as UserIcon, RefreshCw, MoreVertical,
  XCircle, Power, ShieldAlert, ChevronRight, Menu, Download, Save,
  Terminal, Command, Hash, X, PlusCircle
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";
import { ChartProtocol } from "@/components/dashboard/ChartProtocol";
import { notify } from "../../../lib/toast";
import { useTheme, VIBES } from "../../../components/ThemeContext";
import { Suspense } from "react";

type Tab = 'overview' | 'users' | 'turfs' | 'history' | 'settings';

function AdminDashboardContent() {
  const { user, token, logout } = useAuth();
  const { vibe, setVibe } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentTab = (searchParams.get('tab') || 'overview') as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(currentTab);
  const [data, setData] = useState<any>({ users: [], turfs: [], bookings: [], revenue: 145000 });
  const [loading, setLoading] = useState(true);

  // Sync state with URL - MISSION CRITICAL
  useEffect(() => {
    if (currentTab) setActiveTab(currentTab);
  }, [currentTab]);

  const switchTab = (tab: Tab) => {
    router.push(`/dashboard/admin?tab=${tab}`);
  };
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [hudOpen, setHudOpen] = useState(false);
  const [hudSearch, setHudSearch] = useState("");
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState({ name: '', email: '', password: 'User@123', role: 'owner' as 'user' | 'owner' });

  const handleOnboardAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('onboarding');
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: assetForm
      });
      if (res.ok) {
        notify.success('Security Asset Node Onboarded Successfully');
        setModalType(null);
        loadData();
      } else {
        notify.error(res.error.message);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<any>("/api/dashboards/admin");
    if (res.ok) {
       setData({
         users: res.data.recentUsers || [],
         turfs: Array(res.data.totalTurfs).fill({}), 
         bookings: res.data.recentBookings || [],
         revenue: 145200,
         totalUsers: res.data.totalUsers,
         totalTurfs: res.data.totalTurfs,
         totalBookings: res.data.totalBookings
       });
    }
    setLoading(false);
  }

  const handleLogout = () => {
     logout();
     router.push('/');
  };

  useEffect(() => { loadData(); }, [user, token]);

  // Command HUD Protocol (Shift+K)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setHudOpen(prev => !prev);
      }
      if (e.key === 'Escape') setHudOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleAction = async (id: string, action: string) => {
    setActionLoading(id);
    await new Promise(r => setTimeout(r, 1000));
    notify.success(`Protocol '${action}' complete on node ${id.slice(0,8)}`);
    setActionLoading(null);
  };

  const runDiagnostics = async () => {
    setActionLoading('diag');
    await new Promise(r => setTimeout(r, 2000));
    notify.success("All systems operational. No issues detected.");
    setActionLoading(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
         
         {/* 1. BIOMETRIC INITIALIZATION SCAN (WOW FACTOR) */}
         <AnimatePresence>
            {loading && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-[#060806]/90 backdrop-blur-xl"
               >
                  <div className="relative w-64 h-64 flex flex-col items-center justify-center gap-6">
                     <div className="w-48 h-48 border border-primary/20 rounded-full flex items-center justify-center relative overflow-hidden">
                        <motion.div 
                          initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(46,125,50,0.8)] z-10"
                        />
                        <RefreshCw className="w-12 h-12 text-primary animate-spin opacity-40" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Initializing Protocol...</span>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* TOP PROTOCOL HEADER */}
         <div className="flex items-center justify-between mb-10">
            <div className="group cursor-default">
               <h1 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white transition-all group-hover:tracking-normal group-hover:text-primary">Admin <span className="text-primary opacity-60">Operations</span></h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="status-indicator status-online" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">System Core Authorized</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Contextual Tab Toggles */}
               <div className="hidden xl:flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-border mr-4">
                  {(['overview', 'users', 'turfs'] as Tab[]).map(t => (
                     <button 
                        key={t} onClick={() => switchTab(t)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-gray-400 hover:text-primary'}`}
                     >
                        {t}
                     </button>
                  ))}
               </div>

               <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-2xl border border-border group cursor-pointer" onClick={() => setHudOpen(true)}>
                  <Command className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">+ K</span>
               </div>
               <button onClick={loadData} className="btn-premium-primary !py-3 !px-6 !text-[11px]"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Nodes</button>
               <button onClick={() => setExitModalOpen(true)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><LogOut className="w-5 h-5" /></button>
            </div>
         </div>

         <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
               <motion.div 
                 key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                 className="space-y-10"
               >
                  {/* HOLO CARDS DECK */}
                  <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     <HoloCard label="Active Athletes" value={data.totalUsers} icon={Users} trend="+12.4%" chart={[30,45,32,60,40]} color="primary" />
                     <HoloCard label="Verified Arenas" value={data.totalTurfs} icon={Map} trend="+2.1%" chart={[40,30,50,45,60]} color="blue" />
                     <HoloCard label="Trading Volume" value={`₹${(data.revenue/1000).toFixed(0)}K`} icon={TrendingUp} trend="+28.5%" chart={[20,60,40,80,90]} color="amber" />
                     <HoloCard label="Node Latency" value="1.2ms" icon={Activity} trend="Optimal" chart={[10,12,11,13,12]} color="purple" />
                  </section>

                  <div className="grid lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8 space-y-10">
                        {/* REVENUE INTEL */}
                        <div className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border shadow-xl hover:shadow-2xl transition-all relative">
                           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none italic font-black text-6xl uppercase tracking-tighter">Velocity</div>
                           <div className="px-8 py-5 border-b border-border flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                 <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-white">Revenue Intelligence Corridor</h3>
                              </div>
                              <div className="flex bg-gray-200 dark:bg-white/10 p-0.5 rounded-xl">
                                 {['7D', '30D', '1Y'].map(f => (
                                    <button key={f} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${f==='7D' ? 'bg-white dark:bg-white/10 shadow-sm dark:text-white' : 'text-gray-400'}`}>{f}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="p-10 pt-6">
                              <ChartProtocol 
                                 data={[
                                   { label: 'MON', value: 4500 }, { label: 'TUE', value: 5200 },
                                   { label: 'WED', value: 6100 }, { label: 'THU', value: 8800 },
                                   { label: 'FRI', value: 9200 }, { label: 'SAT', value: 12500 }
                                 ]} 
                                 title="Monetary Velocity" 
                                 subtitle="Global Feed" 
                              />
                           </div>
                        </div>

                        {/* PROTOCOL FEED */}
                        <div className="space-y-6">
                           <SectionHeader title="Protocol Feed Stream" icon={Database} actionLabel="Open Matrix" />
                           <div className="space-y-3">
                              {loading ? [1,2,3].map(i => <SkeletonRow key={i} />) : data.bookings.slice(0, 5).map((b: any, i: number) => (
                                 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }}>
                                    <ActivityRow item={b} />
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-8">
                        {/* SYSTEM HEALTH HUD */}
                        <div className="card-compact p-8 space-y-8 bg-white dark:bg-card border-border shadow-xl hover:border-primary/30 transition-all">
                           <div className="flex items-center justify-between">
                              <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-white italic">Active Node Cluster</h3>
                              <div className="flex gap-1">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              </div>
                           </div>
                           <div className="grid gap-3">
                              <SystemNode label="Auth Gateway" value="99.9%" status="online" />
                              <SystemNode label="Exchange Protocol" value="100%" status="online" />
                              <SystemNode label="Match Coordinator" value="99.7%" status="warning" />
                              <SystemNode label="Data Vault" value="100%" status="online" />
                           </div>
                           <div className="pt-2">
                              <button onClick={runDiagnostics} disabled={!!actionLoading} className="btn-premium-primary !py-4 !text-[10px] w-full shadow-lg hover:shadow-primary/30 group">
                                 {actionLoading === 'diag' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 group-hover:text-amber-400 group-hover:scale-125 transition-all" />}
                                 Execute Deep Scan
                              </button>
                           </div>
                        </div>

                        {/* MINI TASKS */}
                        <div className="card-compact p-6 bg-primary/5 border border-primary/20 rounded-3xl group cursor-pointer hover:bg-primary/10 transition-all overflow-hidden relative">
                           <div className="absolute -right-4 -bottom-4 w-24 h-24 text-primary opacity-5 group-hover:scale-150 transition-transform"><Trophy className="w-full h-full" /></div>
                           <div className="relative z-10">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Protocol Tip</span>
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-2 leading-relaxed italic">Use <Command className="w-3 h-3 inline" /> + <span className="text-primary font-black">K</span> to trigger the Command Protocol HUD for master platform governance.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* TAB: USERS */}
            {activeTab === 'users' && (
               <motion.div key="users" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-10">
                  <div className="flex items-center justify-between">
                     <SectionHeader title="Athlete Governance" icon={Users} />
                     <button onClick={() => setModalType('Onboard Asset')} className="btn-premium-primary !py-3 !px-8 !text-[11px] shadow-lg">Onboard Asset</button>
                  </div>
                  <div className="card-compact p-0 overflow-hidden bg-white dark:bg-card border-border shadow-2xl relative">
                     <div className="overflow-x-auto">
                        <table className="table-premium">
                           <thead>
                              <tr className="bg-gray-50/50 dark:bg-white/[0.01]">
                                 <th className="th-premium">Entity Profile</th>
                                 <th className="th-premium">Clearence</th>
                                 <th className="th-premium">State</th>
                                 <th className="th-premium text-right">Ops</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border/50">
                              {data.users.map((u: any, i: number) => (
                                 <motion.tr 
                                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}
                                   key={u.id} className="tr-premium group"
                                 >
                                    <td className="td-premium relative overflow-hidden">
                                       <div className="flex items-center gap-4 relative z-10">
                                          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black italic shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">{u.name[0]}</div>
                                          <div>
                                             <div className="text-sm font-black dark:text-white uppercase tracking-tight">{u.name}</div>
                                             <div className="text-[10px] text-gray-400 font-bold italic tracking-wide lowercase">{u.email}</div>
                                          </div>
                                       </div>
                                       <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </td>
                                    <td className="td-premium">
                                       <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-block ${u.role === 'admin' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-primary/20 text-primary border border-primary/20 italic'}`}>
                                          {u.role}
                                       </div>
                                    </td>
                                    <td className="td-premium">
                                       <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                          <span className="text-[10px] font-black uppercase text-emerald-500">Active Node</span>
                                       </div>
                                    </td>
                                    <td className="td-premium text-right">
                                       <div className="flex items-center justify-end gap-2 pr-4">
                                          <button onClick={() => handleAction(u.id, 'restrict')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm"><ShieldAlert className="w-4 h-4" /></button>
                                          <button onClick={() => handleAction(u.id, 'term')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><XCircle className="w-4 h-4" /></button>
                                       </div>
                                    </td>
                                 </motion.tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* TAB: ARENAS */}
            {activeTab === 'turfs' && (
               <motion.div key="turfs" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10">
                  <SectionHeader title="Arena Verification Grid" icon={Map} actionLabel="Global Audit" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[1,2,3,4,5,6].map(i => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.1 }}
                          key={i} className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border border-2 border-transparent hover:border-primary group cursor-pointer shadow-xl transition-all"
                        >
                           <div className="h-44 bg-gray-100 dark:bg-black relative overflow-hidden">
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                              <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                                 <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
                              </div>
                              <div className="p-6 relative z-20 flex flex-col h-full justify-between">
                                 <div className="flex justify-between items-start">
                                    <span className="px-3 py-1.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-[0_5px_20px_rgba(245,158,11,0.5)]">Pending Validation</span>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"><MapPin className="w-4 h-4" /></div>
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-white text-lg uppercase tracking-tight italic drop-shadow-md">Arena Matrix #{300+i}</h4>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Initialization Pending · Pune Node</p>
                                 </div>
                              </div>
                           </div>
                           <div className="p-6 flex items-center justify-between border-t border-border bg-white dark:bg-card">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic flex items-center gap-2"><Clock className="w-3 h-3" /> {i*2}h Left</span>
                              <div className="flex gap-3">
                                 <button onClick={() => notify.success("Arena Approved")} className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-90"><CheckCircle2 className="w-5 h-5" /></button>
                                 <button onClick={() => notify.error("Arena Terminated")} className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-90"><XCircle className="w-5 h-5" /></button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* 3. SHIFT+K COMMAND HUD PROTOCOL (EXTREME WOW) */}
         <AnimatePresence>
            {hudOpen && (
               <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHudOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="w-full max-w-2xl bg-white dark:bg-card border border-border rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden relative"
                  >
                     <div className="p-6 border-b border-border bg-gray-50/50 dark:bg-white/[0.01] flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-primary" />
                        <input 
                           autoFocus placeholder="Initialize command logic..." 
                           className="bg-transparent border-none outline-none w-full text-base font-bold dark:text-white placeholder-gray-400" 
                           value={hudSearch} onChange={e => setHudSearch(e.target.value)}
                        />
                        <div className="px-2 py-1 rounded bg-gray-200 dark:bg-white/10 text-[9px] font-black text-gray-500 uppercase">CMD Protocol</div>
                     </div>
                     <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar space-y-1">
                        <HudItem label="Overview Cluster" desc="Sync global telemetry" icon={LayoutDashboard} onClick={() => {setActiveTab('overview'); setHudOpen(false)}} />
                        <HudItem label="Managed Athletes" desc="Open entity governance" icon={Users} onClick={() => {setActiveTab('users'); setHudOpen(false)}} />
                        <HudItem label="Arena Matrix" desc="Verification grid control" icon={Map} onClick={() => {setActiveTab('turfs'); setHudOpen(false)}} />
                        <div className="py-2 px-4 text-[9px] font-black uppercase tracking-widest text-primary italic opacity-60">Identity Vibe Protocol</div>
                        <div className="grid grid-cols-2 gap-2 p-2 pt-0">
                           {VIBES.map(v => (
                              <button key={v.name} onClick={() => {setVibe(v); setHudOpen(false); notify.info(`Vibe Protocol: ${v.name} Loaded`)}} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-left">
                                 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: v.color }} />
                                 <span className="text-[10px] font-bold uppercase tracking-tight dark:text-white">{v.name}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="p-4 border-t border-border bg-gray-50 dark:bg-black/20 flex justify-between items-center px-8">
                        <div className="flex items-center gap-4">
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest"><span className="text-primary tracking-normal">↑↓</span> NAVIGATE</span>
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest"><span className="text-primary tracking-normal">⏎</span> EXECUTE</span>
                        </div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">NODE v1.0.4-TURFF</span>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

          {/* MODAL ENGINE */}
          <AnimatePresence>
             {modalType && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="fixed inset-0 bg-black/95 backdrop-blur-xl" />
                   <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="w-full max-w-xl bg-white dark:bg-[#0B0F0C] border border-white/5 rounded-[3rem] shadow-3xl p-12 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-9xl font-black italic pointer-events-none tracking-tighter uppercase">{modalType.split(' ')[0]}</div>
                         <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                               <h2 className="text-3xl font-black uppercase italic tracking-tighter dark:text-white">{modalType}</h2>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Management Portal</p>
                            </div>
                            <button onClick={() => setModalType(null)} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-border"><X className="w-5 h-5" /></button>
                         </div>
                         
                         <form className="space-y-8" onSubmit={handleOnboardAsset}>
                            {modalType === 'Onboard Asset' && (
                               <div className="grid gap-6">
                                  <Input 
                                    label="Entity Legal name" placeholder="Rajesh Kumar" required 
                                    value={assetForm.name} onChange={(v: string) => setAssetForm({...assetForm, name: v})}
                                  />
                                  <Input 
                                    label="Credential Email" placeholder="owner@turff.local" type="email" required 
                                    value={assetForm.email} onChange={(v: string) => setAssetForm({...assetForm, email: v})}
                                  />
                                  <div className="grid grid-cols-2 gap-4">
                                     <Input 
                                       label="Access Cipher" placeholder="••••••••" type="password" required 
                                       value={assetForm.password} onChange={(v: string) => setAssetForm({...assetForm, password: v})}
                                     />
                                     <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">Operational Clearance</label>
                                        <select 
                                          value={assetForm.role} onChange={(e: any) => setAssetForm({...assetForm, role: e.target.value})}
                                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-border rounded-xl text-xs font-black uppercase italic outline-none focus:border-primary transition-all shadow-sm dark:text-white outline-none"
                                        >
                                           <option value="owner">Owner Node</option>
                                           <option value="user">Athlete Node</option>
                                        </select>
                                     </div>
                                  </div>
                                  <div className="flex justify-end pt-4">
                                     <button type="submit" disabled={!!actionLoading} className="btn-premium-primary !px-12 !italic flex items-center gap-2">
                                        {actionLoading === 'onboarding' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /> Add New User</>}
                                     </button>
                                  </div>
                               </div>
                            )}
                         </form>
                   </motion.div>
                </div>
             )}
             {exitModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExitModalOpen(false)} className="fixed inset-0 bg-black/95 backdrop-blur-xl" />
                   <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="w-full max-w-sm bg-white dark:bg-[#0B0F0C] border border-white/5 rounded-[3rem] shadow-3xl p-12 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-9xl font-black italic pointer-events-none tracking-tighter uppercase">EXIT</div>
                      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl mx-auto flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10 border border-rose-500/20"><LogOut className="w-10 h-10" /></div>
                      <div className="space-y-2"><h2 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white leading-none">Logout?</h2><p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest px-8 mt-2">You will be securely logged out and returned to the main page.</p></div>
                      <div className="flex flex-col gap-3">
                         <button onClick={() => { logout(); window.location.href = "/"; }} className="btn-premium-primary !bg-rose-500 !shadow-rose-500/20 w-full !italic text-[11px] py-4">Logout</button>
                         <button onClick={() => setExitModalOpen(false)} className="px-8 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all italic">Stay Logged In</button>
                      </div>
                   </motion.div>
                </div>
             )}
          </AnimatePresence>

         {/* GLOBAL PROTOCOL OVERLAY */}
         <AnimatePresence>
            {actionLoading && (
               <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[120] flex flex-col items-center justify-center gap-6">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-20 h-20 bg-white dark:bg-card rounded-3xl flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-primary/20">
                     <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  </motion.div>
                  <div className="text-center space-y-2">
                     <span className="text-[12px] font-black text-white uppercase tracking-[0.8em] animate-pulse italic">Rewriting Node Matrix...</span>
                     <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] opacity-60">Authorized Protocol Only</p>
                  </div>
               </div>
            )}
         </AnimatePresence>
    </div>
  );
}

// ── HOLO 3D CARD COMPONENT (SUPREME WOW) ──
function HoloCard({ label, value, icon: Icon, trend, chart, color }: any) {
   const containerRef = useRef<HTMLDivElement>(null);
   const mouseX = useMotionValue(0);
   const mouseY = useMotionValue(0);

   const rotateX = useSpring(useTransform(mouseY, [0, 300], [10, -10]), { damping: 20 });
   const rotateY = useSpring(useTransform(mouseX, [0, 400], [-10, 10]), { damping: 20 });

   const handleMouseMove = (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
   };

   const colors: any = {
      primary: 'text-primary bg-primary/10 border-primary/20 shadow-primary/10',
      blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10',
      amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
      purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10'
   };
   
   return (
      <motion.div 
         ref={containerRef}
         onMouseMove={handleMouseMove}
         onMouseLeave={() => { mouseX.set(200); mouseY.set(150); }}
         style={{ rotateX, rotateY, perspective: 1000 }}
         className="card-compact !p-5 flex items-center justify-between border border-border group hover:border-primary/40 transition-shadow shadow-md hover:shadow-2xl bg-white dark:bg-card h-[110px] relative overflow-hidden"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
         {/* Holographic Rainbow Glint */}
         <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-primary/5 to-transparent rotate-45 group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
         
         <div className="flex items-center gap-5 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6 ${colors[color]}`}>
               <Icon className="w-6 h-6 font-black" />
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 opacity-60 italic">{label}</div>
               <div className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white leading-none italic">{value === undefined ? '...' : value}</div>
            </div>
         </div>
         <div className="flex flex-col items-end gap-2 relative z-10">
            <div className="text-[11px] font-black italic text-emerald-500 tracking-tighter bg-emerald-500/5 px-2 py-0.5 rounded-lg">{trend}</div>
            <div className="flex items-end gap-0.5 h-6 w-20">
               {chart.map((v: number, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }} animate={{ height: `${(v/Math.max(...chart))*100}%` }}
                    className={`w-1.5 rounded-full ${colors[color].split(' ')[0].replace('text-', 'bg-')} opacity-20 group-hover:opacity-40 transition-all`} 
                  />
               ))}
            </div>
         </div>
      </motion.div>
   );
}

// ENTRY POINT WRAPPED IN SUSPENSE FOR NEXT.JS COMPATIBILITY
export default function AdminDashboard() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#060806]">
            <RefreshCw className="w-10 h-10 text-primary animate-spin" />
         </div>
      }>
         <AdminDashboardContent />
      </Suspense>
   );
}

function HudItem({ label, desc, icon: Icon, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full text-left p-4 rounded-[1.5rem] hover:bg-primary/10 group transition-all flex items-center gap-6 border border-transparent hover:border-primary/20">
       <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-md group-hover:shadow-primary/30">
          <Icon className="w-5 h-5" />
       </div>
       <div>
          <div className="text-[11px] font-black uppercase tracking-tight dark:text-white group-hover:text-primary transition-colors">{label}</div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-primary/60">{desc}</div>
       </div>
       <ChevronRight className="w-4 h-4 ml-auto text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
  );
}

function SectionHeader({ title, icon: Icon, actionLabel }: any) {
   return (
      <div className="flex items-center justify-between border-b border-border pb-4 w-full">
         <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase italic flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Icon className="w-4 h-4 text-primary" /></div> {title}
         </h3>
         {actionLabel && <button className="text-[9px] font-black text-primary uppercase tracking-[0.3em] hover:opacity-70 transition-opacity flex items-center gap-2">{actionLabel} <ArrowUpRight className="w-3 h-3" /></button>}
      </div>
   );
}

function ActivityRow({ item }: any) {
   return (
      <motion.div 
         whileHover={{ x: 5 }}
         className="card-compact !p-5 flex items-center justify-between gap-4 group hover:bg-gray-50/80 dark:hover:bg-white/[0.03] transition-all border border-border/60 bg-white/80 dark:bg-card backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-black border border-border flex items-center justify-center text-gray-400 group-hover:text-primary transition-all group-hover:scale-105 group-hover:rotate-3 shadow-inner">
               <Clock className="w-5 h-5" />
            </div>
            <div className="truncate max-w-xs">
               <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight italic group-hover:text-primary transition-colors">{item.turf_name}</h4>
               <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2 opacity-60">
                  <Hash className="w-2.5 h-2.5" /> {item.id.slice(0, 10)} · {item.sport_type}
               </div>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
               <div className="text-sm font-black text-gray-900 dark:text-white tracking-tighter">₹{item.total_price}</div>
               <div className={`text-[8px] font-black uppercase tracking-[0.2em] mt-0.5 ${item.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {item.status}
               </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-border opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:border-primary/20"><ChevronRight className="w-4 h-4" /></div>
         </div>
      </motion.div>
   );
}

function SystemNode({ label, value, status }: any) {
   const statusColor = status === 'online' ? 'status-online' : status === 'warning' ? 'status-warning' : 'status-critical';
   return (
      <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-white/[0.01] rounded-[1.25rem] border border-border group hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
         <div className="flex items-center gap-4">
            <div className={`status-indicator ${statusColor}`} />
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
         </div>
         <span className="text-[10px] font-black text-gray-900 dark:text-white group-hover:scale-110 transition-transform">{value}</span>
      </div>
   );
}

function Input({ label, placeholder, type = "text", value, onChange, required }: any) {
  return (
    <div className="space-y-2 text-left">
       <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">{label}</label>
       <input 
         type={type} placeholder={placeholder} value={value} required={required}
         onChange={(e) => onChange?.(e.target.value)}
         className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-border rounded-xl text-xs font-black uppercase italic outline-none focus:border-primary transition-all shadow-sm dark:text-white" 
       />
    </div>
  );
}
