"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Activity, CreditCard, MapPin, ChevronRight, Settings, PlusCircle, Search, ShieldCheck
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";

function AdminDashboardContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiFetch<any>("/api/dashboards/admin", { token });
      if (res.ok) setStats(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  if (!user) return null;

  // Operational Sub-renderers to prevent JSX deep nesting dissonance
  const renderLoadingSkeleton = () => (
    <div className="space-y-10 px-2 animate-in fade-in duration-700">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white/5 rounded-[3rem] animate-pulse border border-white/5" />)}
       </div>
       <div className="h-[400px] bg-white/5 rounded-[3.5rem] animate-pulse border border-white/5" />
    </div>
  );

  const renderContent = () => {
    if (!stats) return null;

    return (
      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview" 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} 
              className="space-y-12 pb-20"
            >
              {/* STATS DECK */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox label="Registered Owners" value={stats.totalOwners} change={`+${stats.ownersThisWeek} this week`} icon={Users} color="cyan" />
                <StatBox label="Active Venues" value={stats.totalTurfs} change={`+${stats.turfsThisWeek} this week`} icon={MapPin} color="teal" />
                <StatBox label="Commission Revenue" value={`₹${stats.revenueToday.toLocaleString()}`} change="10% Applied" icon={CreditCard} color="emerald" />
                <StatBox label="Platform Traffic" value={stats.bookingsToday} change="Live Transactions" icon={Activity} color="indigo" />
              </div>

              {/* CHART & APPROVALS GRID */}
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                       <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] opacity-80 italic">Directorial Intelligence Trends (30D)</h3>
                       <div className="flex items-center gap-6">
                          <TrendLegend label="Bookings" color="#0891B2" />
                          <TrendLegend label="Revenue" color="#10B981" />
                       </div>
                    </div>
                    <div className="h-[300px] flex items-end gap-3 px-2">
                       {stats.trends.map((t: any, i: number) => {
                          const maxB = Math.max(...stats.trends.map((x:any)=>x.bookings)) || 1;
                          return (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end gap-1 group/bar relative">
                               <div className="absolute inset-x-0 bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity flex justify-center">
                                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[8px] font-black text-cyan-400">{t.bookings}</div>
                               </div>
                               <motion.div 
                                 initial={{ height: 0 }} animate={{ height: `${(t.bookings / maxB) * 100}%` }}
                                 className="w-full bg-cyan-600/20 rounded-t-xl group-hover/bar:bg-cyan-500/40 transition-all shadow-[0_0_20px_rgba(8,145,178,0.1)] border-t border-cyan-500/20" 
                               />
                               <span className="text-[7px] font-black text-gray-700 uppercase text-center mt-4 tracking-tighter">{t.date.split('-')[2]}</span>
                            </div>
                       )})}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[3.5rem] p-12 flex flex-col backdrop-blur-md group hover:border-cyan-500/20 transition-all shadow-2xl">
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] inline-flex items-center gap-3 italic mb-12">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping shadow-[0_0_10px_rgba(8,145,178,0.8)]" /> Approval Vector
                   </h3>
                   <div className="space-y-5 flex-1">
                      {stats.ownerApprovals.map((o: any, i: number) => (
                         <div key={o.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/[0.08] transition-all group/item shadow-lg">
                            <div className="space-y-1">
                               <span className="text-[13px] font-black text-white italic tracking-tight">{o.name}</span>
                               <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Facility Node Induction</p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${i % 2 === 0 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5'}`}>
                               {i % 2 === 0 ? 'Review' : 'Active'}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* RECENT BOOKING ACTIVITY TABLE */}
              <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-2xl">
                 <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Global Transaction Relay</h3>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-60">Live Platform Operational Matrix (Latest 10 Units)</p>
                    </div>
                    <button onClick={() => router.push('/turfs')} className="bg-cyan-600 py-4 px-10 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] transition-all shadow-2xl active:scale-95 shadow-cyan-600/20">Manual Node Entry</button>
                 </div>
                 
                 <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                       <thead>
                          <tr>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Unit ID</th>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Athlete</th>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Sector Venue</th>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Time Node</th>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Yield</th>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                             <th className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="z-10 relative">
                          {stats.recentBookings.map((b: any, i: number) => (
                             <motion.tr 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                key={b.id} className="group/row bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all rounded-[2rem] overflow-hidden shadow-xl"
                             >
                                <td className="px-6 py-7 text-[12px] font-black text-cyan-500 uppercase italic opacity-80">TB-{b.id.slice(0, 4).toUpperCase()}</td>
                                <td className="px-6 py-7">
                                   <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-2xl bg-gray-800 border border-white/10 flex items-center justify-center text-[10px] font-black italic shadow-inner">TH</div>
                                      <span className="text-[13px] font-black text-white uppercase tracking-tight italic drop-shadow-lg">{b.customer_name || 'Athleted Node'}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-7">
                                   <div className="flex flex-col">
                                      <span className="text-[13px] font-black text-gray-400 uppercase tracking-tighter truncate max-w-[180px] italic">{b.turf_name}</span>
                                      <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1 opacity-60">Matrix Sector 0x{b.id.slice(-4)}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-7 text-[11px] font-bold text-gray-500 italic uppercase">Today, 20:00</td>
                                <td className="px-6 py-7 text-[16px] font-black text-white tracking-tighter italic drop-shadow-xl">₹{Number(b.total_price).toLocaleString()}</td>
                                <td className="px-6 py-7">
                                   <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/5">Transmitted</span>
                                </td>
                                <td className="px-6 py-7 text-right">
                                   <div className="flex justify-end gap-3 opacity-20 group-hover/row:opacity-100 transition-all">
                                      <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all"><Activity className="w-4 h-4" /></button>
                                      <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 hover:border-rose-400/20 transition-all">
                                         <ShieldCheck className="w-4 h-4" />
                                      </button>
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

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
               <div className="w-32 h-32 rounded-[3.5rem] bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center relative overflow-hidden group">
                  <Users className="w-16 h-16 text-cyan-600 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Global Athlete registry</h2>
                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">Indexing Directorial Identity Matrix...</p>
               </div>
               <button onClick={loadData} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase text-cyan-500 tracking-widest hover:bg-cyan-600 hover:text-white transition-all shadow-2xl active:scale-95">Synchronize User Nodes</button>
            </motion.div>
          )}

          {activeTab === 'turfs' && (
            <motion.div key="turfs" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
               <div className="w-32 h-32 rounded-[3.5rem] bg-teal-500/5 border border-teal-500/10 flex items-center justify-center relative overflow-hidden">
                  <MapPin className="w-16 h-16 text-teal-600 animate-bounce" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Arena Sector governance</h2>
                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">Scanning Active Operational Venue Nodes...</p>
               </div>
               <button onClick={() => router.push('/turfs')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase text-teal-500 tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-2xl active:scale-95">Re-map Global Sectors</button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
               <div className="w-32 h-32 rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center relative overflow-hidden">
                  <Activity className="w-16 h-16 text-indigo-600 animate-spin-slow" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">System Intelligence logs</h2>
                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">Streaming Real-time Intelligence Feed...</p>
               </div>
               <button onClick={loadData} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase text-indigo-500 tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95">Purge Expired Data Nodes</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* TOP BAR BRANDING */}
      <div className="flex items-center justify-between mb-12 relative z-10 px-2 pt-2">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic drop-shadow-2xl">
               Admin <span className="text-cyan-500">Terminal</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] opacity-60 flex items-center gap-2 italic">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Authorized Directorial Feed · Live Data Stream
            </p>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl group focus-within:border-cyan-500/50 transition-all">
               <Search className="w-4 h-4 text-gray-600 group-hover:text-cyan-500 transition-colors" />
               <input placeholder="Global Search..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder-gray-700 w-40" />
            </div>
            <button 
              onClick={() => setActiveTab('users')}
              className="px-8 py-4 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3 shadow-cyan-600/10"
            >
               <PlusCircle className="w-4 h-4" /> Owner Queue
            </button>
         </div>
      </div>

      {loading ? renderLoadingSkeleton() : renderContent()}
    </div>
  );
}

function StatBox({ label, value, change, icon: Icon, color }: any) {
   const colors: any = {
      cyan: 'from-cyan-600 to-cyan-400 shadow-cyan-500/20 text-cyan-500',
      teal: 'from-teal-600 to-teal-400 shadow-teal-500/20 text-teal-500',
      emerald: 'from-emerald-600 to-emerald-400 shadow-emerald-500/20 text-emerald-500',
      indigo: 'from-indigo-600 to-indigo-400 shadow-indigo-500/20 text-indigo-500'
   };
   
   return (
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all shadow-2xl hover:shadow-cyan-500/5">
         <div className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-[0.02] group-hover:scale-125 group-hover:rotate-12 transition-transform"><Icon className="w-full h-full" /></div>
         <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] italic group-hover:text-cyan-500/60 transition-colors">{label}</h4>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${colors[color].split(' shadow-')[0]} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
               <Icon className="w-6 h-6 text-white" />
            </div>
         </div>
         <div className="space-y-1 relative z-10">
            <div className="text-4xl font-black text-white tracking-tighter italic leading-none">{value}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2 ${colors[color].split(' shadow-')[1].split(' text-')[0]}`}>
               <span className="w-1 h-1 rounded-full bg-current animate-pulse" /> {change}
            </div>
         </div>
      </div>
   );
}

function TrendLegend({ label, color }: any) {
   return (
      <div className="flex items-center gap-3 group cursor-default">
         <div className="w-1.5 h-6 rounded-full group-hover:scale-y-125 transition-transform" style={{ backgroundColor: color }} />
         <span className="text-[9px] font-black text-gray-600 group-hover:text-white uppercase tracking-widest transition-colors">{label}</span>
      </div>
   );
}

export default function AdminDashboard() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center bg-[#0B0F0C]">
            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-2xl shadow-cyan-500/20" />
         </div>
      }>
         <AdminDashboardContent />
      </Suspense>
   );
}
