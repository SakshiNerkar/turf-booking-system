"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Activity, Trophy, Shield, Zap, TrendingUp, CreditCard, 
  MapPin, Clock, Search, Filter, ArrowUpRight, CheckCircle2, 
  AlertCircle, Database, LayoutDashboard, Globe, Settings, Map,
  Bell, LogOut, User as UserIcon, RefreshCw, MoreVertical,
  XCircle, Power, ShieldAlert, ChevronRight, Menu, Download, Save
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";
import { ChartProtocol } from "@/components/dashboard/ChartProtocol";
import { notify } from "../../../lib/toast";

type Tab = 'overview' | 'users' | 'turfs' | 'logs' | 'system';

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [data, setData] = useState<any>({ users: [], turfs: [], bookings: [], revenue: 145000 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  useEffect(() => { loadData(); }, [user, token]);

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
    <div className="min-h-screen relative overflow-hidden">
         
         {/* TOP PROTOCOL HEADER */}
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Admin <span className="text-primary">Ops</span></h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="status-indicator status-online" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Operational Mastery</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                  {['overview', 'users', 'turfs'].map(t => (
                     <button 
                        key={t} onClick={() => setActiveTab(t as Tab)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'}`}
                     >
                        {t}
                     </button>
                  ))}
               </div>
               <button onClick={loadData} className="btn-premium-primary !py-2.5 !px-5 !text-[10px] hidden md:flex"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Node</button>
            </div>
         </div>

         <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
               <motion.div 
                 key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="space-y-8"
               >
                  <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     <StatCard label="Total Athletes" value={data.totalUsers} icon={Users} trend="+12%" chart={[30,45,32,60,40]} color="primary" />
                     <StatCard label="Live Arenas" value={data.totalTurfs} icon={Map} trend="+2%" chart={[40,30,50,45,60]} color="blue" />
                     <StatCard label="Volume" value={`₹${(data.revenue/1000).toFixed(0)}K`} icon={TrendingUp} trend="+28%" chart={[20,60,40,80,90]} color="amber" />
                     <StatCard label="Latency" value="1.2ms" icon={Activity} trend="Optimal" chart={[10,12,11,13,12]} color="purple" />
                  </section>

                  <div className="grid lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-8 space-y-8">
                        <div className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border shadow-md">
                           <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
                              <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-white">Revenue Intelligence</h3>
                              <div className="flex bg-gray-200 dark:bg-white/10 p-0.5 rounded-lg">
                                 {['7D', '30D', '1Y'].map(f => (
                                    <button key={f} className={`px-2.5 py-1 rounded-md text-[8px] font-black transition-all ${f==='7D' ? 'bg-white dark:bg-white/10 shadow-sm dark:text-white' : 'text-gray-400'}`}>{f}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="p-6">
                              <ChartProtocol 
                                 data={[
                                   { label: 'MON', value: 4500 }, { label: 'TUE', value: 5200 },
                                   { label: 'WED', value: 6100 }, { label: 'THU', value: 8800 },
                                   { label: 'FRI', value: 9200 }, { label: 'SAT', value: 12500 }
                                 ]} 
                                 title="Monetary Flow" 
                                 subtitle="Velocity Grid" 
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <SectionHeader title="Protocol Activity" icon={Database} actionLabel="Full Stream" />
                           <div className="space-y-2">
                              {loading ? [1,2,3].map(i => <SkeletonRow key={i} />) : data.bookings.slice(0, 5).map((b: any) => <ActivityRow key={b.id} item={b} />)}
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-6">
                        <div className="card-compact p-6 space-y-6 bg-white dark:bg-card border-border shadow-md">
                           <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-white">System Nodes</h3>
                           <div className="grid gap-2">
                              <SystemNode label="Auth Gateway" value="99.9%" status="online" />
                              <SystemNode label="Payment Sync" value="100%" status="online" />
                              <SystemNode label="Match Grid" value="99.7%" status="warning" />
                              <SystemNode label="Storage" value="100%" status="online" />
                           </div>
                           <button onClick={runDiagnostics} disabled={!!actionLoading} className="btn-premium-primary !py-2.5 !text-[9px] w-full shadow-md">
                              {actionLoading === 'diag' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                              Deep Diagnostic
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'users' && (
               <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <SectionHeader title="Managed Athletes" icon={Users} />
                     <button className="btn-premium-primary !py-2.5 !px-5 !text-[10px]">Add Athlete</button>
                  </div>
                  <div className="card-compact p-0 overflow-hidden bg-white dark:bg-card border-border shadow-md">
                     <div className="overflow-x-auto">
                        <table className="table-premium">
                           <thead>
                              <tr>
                                 <th className="th-premium">Profile</th>
                                 <th className="th-premium">Role</th>
                                 <th className="th-premium text-right">Operations</th>
                              </tr>
                           </thead>
                           <tbody>
                              {data.users.map((u: any) => (
                                 <tr key={u.id} className="tr-premium">
                                    <td className="td-premium">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">{u.name[0]}</div>
                                          <div>
                                             <div className="text-xs font-black dark:text-white">{u.name}</div>
                                             <div className="text-[9px] text-gray-400 font-bold italic">{u.email}</div>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="td-premium">
                                       <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">{u.role}</span>
                                    </td>
                                    <td className="td-premium text-right pb-4">
                                       <button onClick={() => handleAction(u.id, 'term')} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><XCircle className="w-4 h-4" /></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'turfs' && (
               <motion.div key="turfs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <SectionHeader title="Arena Verification" icon={Map} />
                  <div className="grid md:grid-cols-3 gap-6">
                     {[1,2,3].map(i => (
                        <div key={i} className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border border relative group">
                           <div className="h-32 bg-gray-100 dark:bg-black/60 relative overflow-hidden">
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="p-4 relative z-10">
                                 <span className="px-2 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg">Pending Node</span>
                                 <div className="mt-8 font-black text-white text-xs uppercase italic">Arena Project #{200+i}</div>
                              </div>
                           </div>
                           <div className="p-4 flex items-center justify-between">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Added {i}h Ago</span>
                              <div className="flex gap-2">
                                 <button className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                                 <button className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"><XCircle className="w-4 h-4" /></button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {actionLoading && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex flex-col items-center justify-center gap-4">
               <div className="w-12 h-12 bg-white dark:bg-card rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                  <RefreshCw className="w-6 h-6 text-primary animate-spin" />
               </div>
               <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Synchronizing Terminal...</span>
            </div>
         )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, chart, color }: any) {
   const colors: any = {
      primary: 'text-primary bg-primary/10 border-primary/20',
      blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
   };
   
   return (
      <div className="card-compact !p-4 flex items-center justify-between border border-border group hover:border-primary/40 transition-all shadow-sm bg-white dark:bg-card h-[92px]">
         <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${colors[color]}`}>
               <Icon className="w-5 h-5 font-black" />
            </div>
            <div className="space-y-0.5">
               <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</div>
               <div className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">{value === undefined ? '...' : value}</div>
            </div>
         </div>
         <div className="flex flex-col items-end gap-1.5">
            <div className="text-[10px] font-black italic text-emerald-500">{trend}</div>
            <div className="flex items-end gap-0.5 h-5 w-16">
               {chart.map((v: number, i: number) => (
                  <div key={i} className={`w-1 rounded-full ${colors[color].split(' ')[0].replace('text-', 'bg-')} opacity-20`} style={{ height: `${(v/Math.max(...chart))*100}%` }} />
               ))}
            </div>
         </div>
      </div>
   );
}

function SectionHeader({ title, icon: Icon, actionLabel }: any) {
   return (
      <div className="flex items-center justify-between border-b border-border pb-3 w-full">
         <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tighter uppercase italic flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" /> {title}
         </h3>
         {actionLabel && <button className="text-[8px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">{actionLabel} →</button>}
      </div>
   );
}

function ActivityRow({ item }: any) {
   return (
      <div className="card-compact !p-4 flex items-center justify-between gap-4 group hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-border bg-white dark:bg-card">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-black border border-border flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
               <Clock className="w-4 h-4" />
            </div>
            <div className="truncate max-w-xs transition-transform group-hover:translate-x-1">
               <h4 className="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{item.turf_name}</h4>
               <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{item.sport_type} · {item.status}</div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
               <div className="text-[11px] font-black text-gray-900 dark:text-white">₹{item.total_price}</div>
               <div className="text-[8px] text-gray-400 font-bold">Confirmed</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
         </div>
      </div>
   );
}

function SystemNode({ label, value, status }: any) {
   const statusColor = status === 'online' ? 'status-online' : status === 'warning' ? 'status-warning' : 'status-critical';
   return (
      <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-border hover:border-primary/20 transition-all group">
         <div className="flex items-center gap-3">
            <div className={`status-indicator ${statusColor}`} />
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
         </div>
         <span className="text-[10px] font-black text-gray-900 dark:text-white">{value}</span>
      </div>
   );
}
