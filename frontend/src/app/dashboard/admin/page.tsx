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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<any>("/api/dashboards/admin");
    if (res.ok) {
       setData({
         users: res.data.recentUsers || [],
         turfs: Array(res.data.totalTurfs).fill({}), // Placeholder till we get full list
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
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    notify.success(`Action '${action}' completed for ID: ${id}`);
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
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#060806] flex transition-colors duration-500 overflow-hidden">
      
      {/* 1. SIDEBAR NAVIGATION - DYNAMIC LAYOUT */}
      <aside className={`
        w-64 border-r border-border bg-white dark:bg-[#0B0F0C] flex flex-col h-screen 
        transition-all duration-300 z-50
        fixed lg:static top-0 left-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarOpen ? 'shadow-2xl lg:shadow-none' : ''}
      `}>
         <div className="p-6 pb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">T</div>
            <span className="text-sm font-black uppercase tracking-tighter dark:text-white">Admin <span className="text-primary italic">Core</span></span>
         </div>

         <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4 opacity-50">Management</div>
            <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <NavItem icon={Map} label="Arenas" active={activeTab === 'turfs'} onClick={() => setActiveTab('turfs')} />
            
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-10 mb-4 px-4 opacity-50">Operations</div>
            <NavItem icon={Database} label="System Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
            <NavItem icon={ShieldAlert} label="Overrides" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
            <NavItem icon={Settings} label="Config" active={false} onClick={() => {}} />
         </nav>

         <div className="p-6 border-t border-border bg-gray-50/50 dark:bg-white/[0.02]">
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-xs font-black text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-widest">
               <LogOut className="w-4 h-4" /> Sign Out
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative border-l border-border/10">
         
         {/* TOP HEADERBAR */}
         <header className="h-16 border-b border-border bg-white/80 dark:bg-[#080B09]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
               <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
                  <Menu className="w-5 h-5 dark:text-white" />
               </button>
               <div className="relative group max-w-sm w-full hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input placeholder="Search protocol..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-border rounded-lg text-[11px] font-bold focus:border-primary outline-none transition-all dark:text-white" />
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-full group cursor-pointer border border-emerald-500/20">
                  <div className="status-indicator status-online" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Healthy</span>
               </div>
               <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-white dark:border-[#080B09]" />
               </button>
               <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black dark:text-white border border-border group cursor-pointer relative">
                  {user.name[0]}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card border border-border rounded-xl shadow-2xl p-1.5 hidden group-hover:block transition-all">
                     <div className="p-3 border-b border-border mb-1">
                        <div className="text-[10px] font-black dark:text-white truncate">{user.name}</div>
                        <div className="text-[9px] font-bold text-gray-500 truncate">{user.email}</div>
                     </div>
                     <button className="w-full text-left px-3 py-2 text-[9px] font-black uppercase text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">Profile</button>
                     <button className="w-full text-left px-3 py-2 text-[9px] font-black uppercase text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">Settings</button>
                  </div>
               </div>
            </div>
         </header>

         {/* CONTENT SCROLL AREA */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
            <AnimatePresence mode="wait">
               {activeTab === 'overview' && (
                  <motion.div 
                    key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                     {/* STATS DECK - HIGH DENSITY */}
                     <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Athletes" value={data.totalUsers} icon={Users} trend="+12%" chart={[30,45,32,60,40]} color="primary" />
                        <StatCard label="Live Arenas" value={data.totalTurfs} icon={Map} trend="+2%" chart={[40,30,50,45,60]} color="blue" />
                        <StatCard label="Volume" value={`₹${(data.revenue/1000).toFixed(0)}K`} icon={TrendingUp} trend="+28%" chart={[20,60,40,80,90]} color="amber" />
                        <StatCard label="Latency" value="1.2ms" icon={Activity} trend="Optimal" chart={[10,12,11,13,12]} color="purple" />
                     </section>

                     <div className="grid lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-6">
                           {/* PRIMARY CHART */}
                           <div className="card-compact !p-0 overflow-hidden bg-white dark:bg-card border-border shadow-md">
                              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
                                 <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-white">Monetary Flow</h3>
                                 </div>
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
                                    title="Revenue Intelligence" 
                                    subtitle="Gross Trading Velocity" 
                                 />
                              </div>
                           </div>

                           {/* FEED */}
                           <div className="space-y-4">
                              <SectionHeader title="System Activity Feed" icon={Database} actionLabel="View Streams" />
                              <div className="space-y-2">
                                 {loading ? (
                                    [1,2,3].map(i => <SkeletonRow key={i} />)
                                 ) : (
                                    data.bookings.slice(0, 5).map((b: any) => (
                                       <ActivityRow key={b.id} item={b} />
                                    ))
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* RIGHT SYSTEM PANEL */}
                        <div className="lg:col-span-4 space-y-6">
                           <div className="card-compact p-6 space-y-6 bg-white dark:bg-card border-border shadow-md">
                              <div className="space-y-1">
                                 <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-white">Active Nodes</h3>
                                 <div className="flex items-center gap-1.5 overflow-hidden">
                                     <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Services Operational</span>
                                 </div>
                              </div>

                              <div className="grid gap-2">
                                 <SystemNode label="Auth Gateway" value="99.9%" status="online" />
                                 <SystemNode label="Payment Sync" value="100%" status="online" />
                                 <SystemNode label="Match Grid" value="99.7%" status="warning" />
                                 <SystemNode label="Storage" value="100%" status="online" />
                              </div>

                              <div className="space-y-2 pt-2 border-t border-border">
                                 <button 
                                    onClick={runDiagnostics} disabled={!!actionLoading}
                                    className="btn-premium-primary !py-2.5 !text-[9px] w-full shadow-md"
                                 >
                                    {actionLoading === 'diag' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                                    Run Protocol Check
                                 </button>
                                 <button className="btn-secondary w-full !text-[8px] !py-2.5">Export logs</button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'users' && (
                  <motion.div 
                    key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                     <div className="flex items-center justify-between">
                        <SectionHeader title="Managed Athletes" icon={Users} />
                        <button className="btn-premium-primary !py-2.5 !px-5 !text-[10px]">Add New User</button>
                     </div>

                     <div className="card-compact p-0 overflow-hidden bg-white dark:bg-card border-border shadow-2xl">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
                           <div className="relative w-96 font-bold">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input placeholder="Filter by name, email or role..." className="w-full pl-11 pr-4 py-2 bg-white dark:bg-[#0B0F0C] border border-border rounded-xl text-xs outline-none focus:border-primary dark:text-white" />
                           </div>
                           <div className="flex gap-2">
                              <button className="p-2 border border-border rounded-lg bg-white dark:bg-white/5 hover:text-primary transition-colors"><Filter className="w-4 h-4" /></button>
                              <button className="p-2 border border-border rounded-lg bg-white dark:bg-white/5 hover:text-primary transition-colors"><Download className="w-4 h-4" /></button>
                           </div>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="table-premium">
                              <thead>
                                 <tr>
                                    <th className="th-premium">User Profile</th>
                                    <th className="th-premium">Role</th>
                                    <th className="th-premium">Status</th>
                                    <th className="th-premium">Joined</th>
                                    <th className="th-premium text-right">Operations</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {loading ? (
                                    [1,2,3,4,5].map(i => <SkeletonRow key={i} />)
                                 ) : data.users.length === 0 ? (
                                    <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase text-xs">No users found</td></tr>
                                 ) : (
                                    data.users.map((u: any) => (
                                       <tr key={u.id} className="tr-premium">
                                          <td className="td-premium">
                                             <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                                   {u.name[0]}
                                                </div>
                                                <div className="space-y-0.5">
                                                   <div className="text-sm font-black dark:text-white">{u.name}</div>
                                                   <div className="text-[10px] text-gray-500 font-bold italic">{u.email}</div>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="td-premium">
                                             <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${u.role==='admin' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : u.role==='owner' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                                {u.role}
                                             </span>
                                          </td>
                                          <td className="td-premium text-emerald-500">Active</td>
                                          <td className="td-premium text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                          <td className="td-premium text-right">
                                             <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleAction(u.id, 'suspend')} className="p-2 text-gray-400 hover:text-amber-500 transition-colors"><Shield className="w-4 h-4" /></button>
                                                <button onClick={() => handleAction(u.id, 'delete')} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><XCircle className="w-4 h-4" /></button>
                                                <button className="p-2 text-gray-400 hover:text-primary transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'turfs' && (
                  <motion.div 
                    key="turfs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <SectionHeader title="Arena Governance" icon={Map} />
                        <div className="flex gap-3">
                           <button className="btn-secondary !text-[10px] !py-2.5">Reject All New</button>
                           <button className="btn-premium-primary !text-[10px] !py-2.5 shadow-lg">Approve Outstanding</button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                           [1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-gray-50 dark:bg-white/5 rounded-3xl animate-pulse border border-border" />)
                        ) : data.turfs.length === 0 ? (
                           <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest border-2 border-dashed border-border rounded-3xl">No arenas found for review</div>
                        ) : (
                           [1,2,3,4,5,6].map(i => (
                              <div key={i} className="card-premium group !p-0 overflow-hidden cursor-default">
                                 <div className="h-32 bg-gray-100 dark:bg-black relative">
                                    <div className="absolute top-4 left-4 z-10">
                                       <span className="px-2 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg">Pending Review</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 font-black text-white text-xs uppercase tracking-tight italic">Arena Omega #{100+i}</div>
                                 </div>
                                 <div className="p-5 flex items-center justify-between">
                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Added {i}h ago</div>
                                    <div className="flex gap-2">
                                       <button className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20 hover:bg-green-500 hover:text-white transition-all shadow-sm"><CheckCircle2 className="w-4 h-4" /></button>
                                       <button className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><XCircle className="w-4 h-4" /></button>
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* GLOBAL LOADING OVERLAY FOR ACTIONS */}
      {actionLoading && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-white dark:bg-card rounded-2xl flex items-center justify-center shadow-2xl scale-125">
               <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Processing Protocol...</span>
         </div>
      )}

    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`admin-nav-item w-full ${active ? 'admin-nav-item-active' : ''}`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-gray-400'}`} />
      <span>{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </button>
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
            <div className="flex items-end gap-1 h-5 w-16">
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
      <div className="card-compact !p-5 flex items-center justify-between gap-4 group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all border border-border/50 bg-white dark:bg-card">
         <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-[#0B0F0C] border border-border flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
               <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 truncate max-w-xs">
               <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{item.turf_name}</h4>
               <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">TXN {item.id.slice(0, 10)} · {item.sport_type}</div>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
               <div className="text-sm font-black text-gray-900 dark:text-white">₹{item.total_price}</div>
               <div className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {item.status}
               </div>
            </div>
            <button className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-border hover:text-primary"><ChevronRight className="w-4 h-4" /></button>
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
