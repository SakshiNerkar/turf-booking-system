"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Activity, CreditCard, MapPin, ChevronRight, Settings, PlusCircle, Search, Wallet, Trophy, Calendar, Clock, Star, History, Trash2, ExternalLink
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import Link from "next/link";

function UserDashboardContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiFetch<any>("/api/dashboards/user", { token });
      if (res.ok) setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  if (!user) return null;

  const renderLoadingSkeleton = () => (
    <div className="space-y-10 px-2 animate-in fade-in duration-700">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white/5 rounded-[3rem] animate-pulse border border-white/5" />)}
       </div>
       <div className="h-[400px] bg-white/5 rounded-[3.5rem] animate-pulse border border-white/5" />
    </div>
  );

  const renderContent = () => {
    if (!data) return null;

    return (
      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="space-y-12 pb-20">
              {/* STATS DECK */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox label="Confirmed Matches" value={data.stats.upcomingMatches} sub="Next confirmed entry" icon={Calendar} color="cyan" />
                <StatBox label="Total Playing Time" value={`${data.stats.totalPlayingHours}H`} sub="Authentic Gear Data" icon={Clock} color="teal" />
                <StatBox label="My Wallet Balance" value={`₹${data.stats.walletBalance.toLocaleString()}`} sub="Current Liquid Credit" icon={Wallet} color="emerald" />
                <StatBox label="Membership Status" value={data.stats.membership} sub={user.name[0] + " Node Tier"} icon={Trophy} color="indigo" />
              </div>

              {/* CALENDAR & QUICK BOOK GRID */}
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                       <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] italic opacity-80">Syncronised Game Calendar</h3>
                       <button onClick={() => setActiveTab('matches')} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 text-[9px] font-black uppercase text-cyan-400 rounded-xl hover:bg-cyan-600 hover:text-white transition-all shadow-lg active:scale-95">
                          Launch 30-Day Matrix
                       </button>
                    </div>
                    <div className="grid grid-cols-8 border border-white/5 rounded-[2rem] overflow-hidden bg-black/40 shadow-inner">
                       <div className="p-4 border-b border-r border-white/5 bg-white/[0.02]" />
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="p-4 border-b border-r border-white/5 text-[9px] font-black text-gray-500 uppercase text-center bg-white/[0.01]">{day}</div>))}
                       {[1,2,3,4,5].map(r => (<div key={r} className="contents">{[0,1,2,3,4,5,6,7].map(c => <div key={c} className="h-14 border-b border-r border-white/5 hover:bg-white/[0.02] transition-colors" />)}</div>))}
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] italic mb-10 px-4">Direct Re-Entry Nodes</h3>
                   <div className="grid grid-cols-3 gap-6 h-full px-2">
                      {data.quickBookAgain.map((q: any) => (
                         <motion.div key={q.id} whileHover={{ y: -10 }} onClick={() => router.push(`/turfs?id=${q.id}`)} className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col group cursor-pointer hover:border-cyan-500/30 transition-all shadow-xl">
                            <div className="h-24 bg-gray-900 overflow-hidden relative">
                               <img src={q.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                            </div>
                            <div className="p-4 flex flex-col gap-4">
                               <h4 className="text-[10px] font-black text-white uppercase truncate italic">{q.name}</h4>
                               <button className="w-full py-2.5 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-widest rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-lg active:scale-95">Initiate</button>
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
              </div>

              {/* TRANSACTION TABLE */}
              <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-2xl">
                 <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Athlete Transaction Grid</h3>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-60">Verified Activity Cluster Logs (Confirmed Sessions)</p>
                    </div>
                    <button onClick={() => router.push('/turfs')} className="bg-cyan-600 py-4 px-10 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(8,145,178,0.3)] transition-all shadow-2xl active:scale-95 shadow-cyan-600/20">New Field Induction</button>
                 </div>
                 
                 <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-5">
                       <thead>
                          <tr>
                             <th className="px-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">Temporal Node</th>
                             <th className="px-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">Venue Sector</th>
                             <th className="px-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">Discipline</th>
                             <th className="px-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">Yield</th>
                             <th className="px-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                             <th className="px-8 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody>
                          {data.bookings.map((b: any, i: number) => (
                             <motion.tr 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                key={b.id} className="group/row bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all rounded-[2.5rem] overflow-hidden shadow-xl"
                             >
                                <td className="px-8 py-8 text-[13px] font-black text-gray-200 uppercase italic opacity-90">{new Date(b.booking_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                <td className="px-8 py-8 text-[14px] font-black text-white uppercase tracking-tight italic drop-shadow-lg">{b.turf_name}</td>
                                <td className="px-8 py-8">
                                   <div className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase text-gray-500 tracking-widest inline-block group-hover/row:border-cyan-500/20 group-hover/row:text-cyan-400 transition-all">{b.sport_type || 'Football'} (Matrix Node)</div>
                                </td>
                                <td className="px-8 py-8 text-[16px] font-black text-white tracking-tighter italic">₹{Number(b.total_price).toLocaleString()}</td>
                                <td className="px-8 py-8">
                                   <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all shadow-lg ${b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                                      {b.status}
                                   </span>
                                </td>
                                <td className="px-8 py-8 text-right">
                                   <div className="flex justify-end gap-3 opacity-20 group-hover/row:opacity-100 transition-all">
                                      <button onClick={() => router.push(`/turfs?id=${b.turf_id}`)} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-[9px] font-black uppercase text-cyan-400 hover:text-white hover:bg-cyan-600 transition-all rounded-xl border border-white/5 shadow-xl"><ExternalLink className="w-3.5 h-3.5" /> Re-index</button>
                                      <button className="w-10 h-10 flex items-center justify-center bg-white/5 text-rose-500 hover:bg-rose-600 hover:text-white transition-all rounded-xl border border-white/5 shadow-xl"><Trash2 className="w-4 h-4" /></button>
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

          {activeTab === 'matches' && (
            <motion.div key="matches" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
               <div className="w-32 h-32 rounded-[3.5rem] bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center relative overflow-hidden group">
                  <Calendar className="w-16 h-16 text-cyan-600 animate-bounce" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Operational Sessions</h2>
                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">Synchronizing confirmed field reservations...</p>
               </div>
               <button onClick={() => setActiveTab('overview')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase text-cyan-500 tracking-widest hover:bg-cyan-600 hover:text-white transition-all shadow-2xl active:scale-95">Return to Main hub</button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
               <div className="w-32 h-32 rounded-[3.5rem] bg-teal-500/5 border border-teal-500/10 flex items-center justify-center relative overflow-hidden">
                  <History className="w-16 h-16 text-teal-600 animate-pulse" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Transaction History</h2>
                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">Indexing previously booked sessions...</p>
               </div>
               <button onClick={loadData} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase text-teal-500 tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-2xl active:scale-95">Export Data Nodes</button>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div key="favorites" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
               <div className="w-32 h-32 rounded-[3.5rem] bg-amber-500/5 border border-amber-500/10 flex items-center justify-center relative overflow-hidden">
                  <Star className="w-16 h-16 text-amber-500 animate-spin-slow" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Favorite Arenas</h2>
                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">Accessing your saved venue nodes...</p>
               </div>
               <button onClick={() => router.push('/turfs')} className="px-10 py-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] font-black uppercase text-amber-500 tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-2xl active:scale-95">Discover New arenas</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* TOP BAR BRANDING */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 relative z-10 gap-8 pt-2">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic drop-shadow-2xl">
               Athlete <span className="text-cyan-500">Terminal</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] opacity-60 flex items-center gap-2 italic">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Authorized Athlete Feed · Live Session Tracking
            </p>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="bg-white/5 border border-white/5 p-4 rounded-[2rem] flex flex-col gap-3 shadow-xl min-w-[300px] backdrop-blur-md">
               <span className="text-[9px] font-black text-white uppercase tracking-widest italic flex items-center gap-2 px-2">
                  Find a Field & Book Now!
               </span>
               <div className="relative group">
                  <form onSubmit={(e) => { e.preventDefault(); router.push('/turfs'); }} className="w-full">
                    <input 
                       placeholder="Search for arena..." 
                       className="w-full bg-black/40 border border-white/10 px-5 py-3.5 rounded-2xl text-[10px] font-bold text-white placeholder-gray-600 focus:border-cyan-500/50 outline-none transition-all group-hover:bg-black/60 shadow-inner" 
                    />
                    <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2">
                      <Search className="w-4 h-4 text-gray-600 group-hover:text-cyan-500 transition-colors cursor-pointer" />
                    </button>
                  </form>
               </div>
            </div>
            <button onClick={() => router.push('/turfs')} className="group flex flex-col items-end gap-1 pr-4">
               <span className="text-[11px] font-black text-white uppercase tracking-widest italic group-hover:text-cyan-400 transition-all flex items-center gap-2">
                  Explore Venues <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </span>
               <span className="text-[8px] font-black text-cyan-600 uppercase tracking-[0.3em]">80+ Active Sectors</span>
            </button>
         </div>
      </div>

      {loading ? renderLoadingSkeleton() : renderContent()}
    </div>
  );
}

function StatBox({ label, value, sub, icon: Icon, color }: any) {
   const colors: any = {
      cyan: 'from-cyan-600 to-cyan-400 text-cyan-500 shadow-cyan-500/20',
      teal: 'from-teal-600 to-teal-400 text-teal-500 shadow-teal-500/20',
      emerald: 'from-emerald-600 to-emerald-400 text-emerald-500 shadow-emerald-500/20',
      indigo: 'from-indigo-600 to-indigo-400 text-indigo-500 shadow-indigo-500/20'
   };
   
   return (
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all shadow-2xl hover:shadow-cyan-500/10">
         <div className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-[0.02] group-hover:scale-125 group-hover:rotate-12 transition-transform"><Icon className="w-full h-full" /></div>
         <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] italic group-hover:text-cyan-500/60 transition-all">{label}</h4>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${colors[color].split(' text-')[0]} flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform`}>
               <Icon className="w-6 h-6 text-white" />
            </div>
         </div>
         <div className="space-y-1 relative z-10">
            <div className="text-5xl font-black text-white tracking-tighter italic leading-none">{value}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest mt-4 flex items-center gap-3 ${colors[color].split(' shadow-')[1]}`}>
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.8)]" /> {sub}
            </div>
         </div>
      </div>
   );
}

export default function UserDashboard() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center bg-[#0B0F0C]">
            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-2xl shadow-cyan-500/20" />
         </div>
      }>
         <UserDashboardContent />
      </Suspense>
   );
}
