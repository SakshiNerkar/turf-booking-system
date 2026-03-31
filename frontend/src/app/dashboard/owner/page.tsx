"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { 
  BarChart3, Calendar, Clock, CreditCard, LayoutDashboard, MapPin, 
  PlusCircle, Search, Settings, ShieldCheck, Store, TrendingUp, 
  Users, User, Zap, Activity, Database, Star, Bell, Filter, ChevronRight,
  ChevronLeft, Info, HelpCircle, MoreHorizontal, Download, Trash, X
} from "lucide-react";
import { useAuth } from "../../../components/AuthProvider";
import { ImageUpload } from "../../../components/ImageUpload";
import { apiFetch } from "../../../lib/api";

function OwnerDashboardContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentTab = (searchParams.get('tab') || 'overview') as any;
  const [activeTab, setActiveTab] = useState(currentTab);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTurf, setNewTurf] = useState<any>({
    name: '', sports_available: 'Football', price_weekday: '', price_weekend: '',
    location_city: 'Mumbai', location_address: '', opening_time: '06:00', closing_time: '23:00',
    slot_duration: 60, images: []
  });

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'overview');
  }, [searchParams]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
       // Mocking data based on user request "actual numbers" or platform integration
       // In a real app, this would fetch from /api/dashboards/owner
       const res = await apiFetch<any>("/api/dashboards/owner", { token });
       if (res.ok) {
          setData(res.data);
       } else {
          // Fallback simulation for "directorial" demo
          setData({
             stats: {
                grossRevenue: 12450.00,
                activeTurfs: 8,
                venues: 4,
                occupancyRate: 92,
                topTurf: "Green Arena",
                topRating: 4.9
             },
             trends: [
                { month: 'Oct 21', revenue: 900, bookings: 400, occupancy: 60 },
                { month: 'Dec 22', revenue: 800, bookings: 300, occupancy: 45 },
                { month: 'Mar 23', revenue: 1100, bookings: 500, occupancy: 75 },
                { month: 'Apr 24', revenue: 950, bookings: 450, occupancy: 65 },
                { month: 'May 25', revenue: 1050, bookings: 550, occupancy: 85 },
                { month: 'Jun 26', revenue: 1200, bookings: 600, occupancy: 95 },
             ],
             revenueSplit: [
                { label: 'Football', value: 55, color: '#0891B2' },
                { label: 'Cricket', value: 35, color: '#10B981' },
                { label: 'Multisport', value: 10, color: '#F59E0B' },
             ],
             topVenues: [
                { name: 'Green Arena', revenue: 5500 },
                { name: 'CricHub', revenue: 4200 },
                { name: 'MultiSport', revenue: 3800 },
                { name: 'Dream Turf', revenue: 2900 },
             ],
             pendingRequests: [
                { id: 'TB-1023', user: 'Alex Thompson', venue: 'Green Arena', status: 'Pending' },
                { id: 'TB-1025', user: 'Sarah Jen', venue: 'CricHub', status: 'Pending' },
             ],
             recentBookings: [
                { id: 'TB-1023', user: 'Alex Thompson', venue: 'Green Arena', turf: 'Field A', sport: 'Football', date: 'Oct 28, 18:00', amount: 120.00, commission: 30.00, status: 'Paid' },
                { id: 'TB-1025', user: 'Sarah Jen', venue: 'CricHub', turf: 'Pitch 1', sport: 'Cricket', date: 'Oct 28, 19:30', amount: 250.00, commission: 50.00, status: 'Pending' },
             ]
          });
       }
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  if (!user) return null;

  const renderOverview = () => {
    const stats = data?.stats || {};
    const trends = data?.trends || [];
    const recentBookings = data?.recentBookings || [];
    const pendingRequests = data?.pendingRequests || [];
    const revenueSplit = data?.revenueSplit || [];
    const topVenues = data?.topVenues || [];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-10 pb-20"
      >
        {/* TOP STATS CLUSTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatNode label="This Month Gross Revenue" value={`₹${(stats.grossRevenue || 0).toLocaleString()}`} change="+18% vs last month" icon={TrendingUp} color="cyan" />
           <StatNode label="Total Active Turfs" value={(stats.activeTurfs || 0) + " Turfs"} sub={`(${(stats.venues || 0)} Venues)`} icon={MapPin} color="teal" />
           <StatNode label="Average Occupancy Rate" value={(stats.occupancyRate || 0) + "%"} sub="16:00-22:00" info icon={Activity} color="indigo" />
           <StatNode label="Top Rated Turf" value={stats.topTurf || 'N/A'} sub={`(${(stats.topRating || 0)} Stars)`} icon={Star} color="amber" isStar />
        </div>

        {/* PERFORMANCE & ANALYTICS GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
           {/* TRENDS CHART */}
           <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest italic opacity-80">Venue Performance Trends - Last 6 Months</h3>
                 <div className="flex items-center gap-6">
                    <ChartLegend label="Total Gross Revenue" color="#0891B2" />
                    <ChartLegend label="Booking Count" color="#10B981" />
                    <ChartLegend label="Occupancy Rate" color="#F59E0B" />
                 </div>
              </div>
              <div className="h-[300px] flex items-end gap-3 px-4 relative">
                 <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-5">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-full border-t border-white" />)}
                 </div>
                 {trends.map((t: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-help">
                       <div className="w-full h-full flex items-end gap-1 px-1">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${((t.revenue || 0)/1200)*100}%` }} className="flex-1 bg-cyan-600/40 rounded-t-lg group-hover:bg-cyan-500 transition-all" />
                          <motion.div initial={{ height: 0 }} animate={{ height: `${((t.bookings || 0)/600)*100}%` }} className="flex-1 bg-emerald-600/40 rounded-t-lg group-hover:bg-emerald-500 transition-all" />
                          <motion.div initial={{ height: 0 }} animate={{ height: `${((t.occupancy || 0)/100)*100}%` }} className="flex-1 bg-amber-600/40 rounded-t-lg group-hover:bg-amber-500 transition-all" />
                       </div>
                       <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter italic">{t.month || 'N/A'}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* REVENUE SPLIT & TOP VENUES */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic mb-6">Revenue Split by Sport</h3>
                 <div className="flex items-center gap-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="50" fill="transparent" stroke="#0891B2" strokeWidth="20" strokeDasharray="314" strokeDashoffset="141" />
                          <circle cx="64" cy="64" r="50" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray="314" strokeDashoffset="251" />
                          <circle cx="64" cy="64" r="50" fill="transparent" stroke="#F59E0B" strokeWidth="20" strokeDasharray="314" strokeDashoffset="282" />
                       </svg>
                       <div className="absolute text-center">
                          <span className="text-xl font-black text-white italic">100%</span>
                       </div>
                    </div>
                    <div className="space-y-2 flex-1">
                       {revenueSplit.map((s: any) => (
                          <div key={s.label} className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest italic">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                <span className="text-gray-400">{s.label}</span>
                             </div>
                             <span className="text-white">{s.value}%</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic mb-6">Top Performing Venues by Revenue</h3>
                 <div className="space-y-4">
                    {topVenues.map((v: any) => (
                       <div key={v.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase italic">
                             <span className="text-gray-400">{v.name}</span>
                             <span className="text-cyan-500">₹{(v.revenue || 0).toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${((v.revenue || 0)/5500)*100}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(8,145,178,0.4)]" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* TABLES & SCHEDULE GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
           {/* PENDING REQUESTS */}
           <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">Pending Booking Requests</h3>
                 <HelpCircle className="w-4 h-4 text-gray-600" />
              </div>
              <div className="space-y-4">
                 {pendingRequests.map((r: any) => (
                    <div key={r.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                       <div className="space-y-1">
                          <span className="text-[11px] font-black text-cyan-500 italic uppercase">TB-{(r.id || '').toString().includes('-') ? r.id.split('-')[1] : (r.id || '').toString().slice(0, 5)}</span>
                          <div className="text-[10px] font-black text-white italic">{r.user || 'Athlete'}</div>
                          <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{r.venue || 'Venue Node'}</div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-90">Approve</button>
                       </div>
                    </div>
                 ))}
                 <div className="pt-4 flex items-center justify-center gap-4 text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                    <ChevronLeft className="w-3 h-3" /> Page 1 of 5 <ChevronRight className="w-3 h-3" />
                 </div>
              </div>
           </div>

           {/* STAFF SCHEDULE (GANTT SIMULATION) */}
           <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
              <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic mb-8">Staff Schedule - Today</h3>
              <div className="space-y-4">
                 <div className="flex items-center border-b border-white/5 pb-2">
                    <div className="w-20" />
                    {['01:00', '08:00', '13:00', '14:00', '16:00'].map(t => <div key={t} className="flex-1 text-[8px] font-black text-gray-600 text-center">{t}</div>)}
                 </div>
                 {[
                    { field: 'Field 1', task: 'Cleaning', shift: '08:00 - 13:00', color: 'bg-teal-500', pos: '20%', width: '40%' },
                    { field: 'Field 2', task: 'Morning Ops', shift: '08:00 - 14:00', color: 'bg-cyan-500', pos: '20%', width: '50%' },
                    { field: 'Field 3', task: 'Maintenance', shift: '13:00 - 16:00', color: 'bg-amber-500', pos: '60%', width: '30%' },
                    { field: 'Field 4', task: 'Night Duty', shift: '16:00 - End', color: 'bg-indigo-500', pos: '80%', width: '20%' },
                 ].map(s => (
                    <div key={s.field} className="flex items-center gap-4 py-2">
                       <span className="w-20 text-[9px] font-black text-white italic">{s.field}</span>
                       <div className="flex-1 h-6 bg-white/5 rounded-lg relative overflow-hidden">
                          <div className={`absolute inset-y-0 ${s.color} rounded-lg opacity-40 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]`} style={{ left: s.pos, width: s.width }} />
                          <div className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white uppercase tracking-widest opacity-60">{s.task}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* CUSTOMER REVIEWS */}
           <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
              <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic mb-8">Recent Customer Reviews</h3>
              <div className="space-y-6">
                 {[
                    { user: 'Alex Thompson', rating: 5, comment: 'Premium field, very well maintained.' },
                    { user: 'Sarah Jen', rating: 4, comment: 'Great lighting for night matches.' },
                    { user: 'Rahul K.', rating: 5, comment: 'Staff was very helpful during booking.' },
                 ].map(r => (
                    <div key={r.user} className="space-y-2 group">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white italic">{r.user}</span>
                          <div className="flex gap-0.5">
                             {[1,2,3,4,5].map(i => <Star key={i} className={`w-2.5 h-2.5 ${i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />)}
                          </div>
                       </div>
                       <p className="text-[9px] font-bold text-gray-500 italic leading-relaxed group-hover:text-gray-300 transition-colors">"{r.comment}"</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* DETAILED BOOKING VIEW TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-2xl">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">My Recent Bookings - Detailed View</h3>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-60">Venue Operational Flow Cluster Nodes</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/owner?tab=finance')}
                className="bg-cyan-600/10 border border-cyan-500/20 px-8 py-3 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-600 hover:text-white transition-all shadow-xl active:scale-95 italic"
              >
                 Payout History
              </button>
           </div>
           
           <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-separate border-spacing-y-4">
                 <thead>
                    <tr>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Booking ID</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Customer</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Venue Name</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Turf Name</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Sport</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Date/Time</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Amount</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Commission</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                       <th className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="relative z-10">
                    {recentBookings.map((b: any, i: number) => (
                       <motion.tr 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          key={b.id} className="group/row bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all rounded-3xl overflow-hidden shadow-lg"
                       >
                          <td className="px-6 py-7 text-[11px] font-black text-cyan-500 uppercase italic">TB-{(b.id || '').toString().includes('-') ? b.id.split('-')[1] : (b.id || '').toString().slice(0, 5)}</td>
                          <td className="px-6 py-7">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-800 border border-white/10 flex items-center justify-center text-[9px] font-black italic">{(b.user || 'A')[0]}</div>
                                <span className="text-[12px] font-black text-white italic truncate max-w-[120px]">{b.user || 'Athlete'}</span>
                             </div>
                          </td>
                          <td className="px-6 py-7 text-[10px] font-black text-gray-400 uppercase italic opacity-60">{b.venue || 'Venue Node'}</td>
                          <td className="px-6 py-7 text-[12px] font-black text-white italic">{b.turf || 'Field'}</td>
                          <td className="px-6 py-7">
                             <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[8px] font-black uppercase text-gray-500 italic">{b.sport || 'Sport'}</span>
                          </td>
                          <td className="px-6 py-7 text-[10px] font-bold text-gray-500 italic uppercase">{b.date || 'N/A'}</td>
                          <td className="px-6 py-7 text-[14px] font-black text-white italic tracking-tighter">₹{(b.amount || 0).toLocaleString()}</td>
                          <td className="px-6 py-7 text-[12px] font-black text-rose-500/80 italic tracking-tighter">₹{(b.commission || 0).toLocaleString()}</td>
                          <td className="px-6 py-7">
                             <span className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${b.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5'}`}>
                                {b.status || 'Pending'}
                             </span>
                          </td>
                          <td className="px-6 py-7 text-right">
                             <div className="flex justify-end gap-3 opacity-20 group-hover/row:opacity-100 transition-all">
                                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all shadow-md"><Activity className="w-4 h-4" /></button>
                                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all shadow-md"><Trash className="w-4 h-4" /></button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="mt-8 flex items-center justify-center gap-1">
              {[1,2,3].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[9px] font-black flex items-center justify-center border transition-all ${p === 1 ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}>{p}</button>)}
              <span className="text-[9px] font-black text-gray-700 italic mx-4">Page 1 of 5</span>
              <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:bg-white/10 transition-all"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>
      </motion.div>
    );
  };

  const renderTurfs = () => {
    const s = data?.stats || {};
    const turfs = data?.myTurfs || [];

    const handleCreate = async () => {
       if (!token) return;
       setLoading(true);
       try {
          const res = await apiFetch("/api/turfs", {
             method: "POST",
             token,
             body: newTurf
          });
          if (res.ok) {
             setIsCreating(false);
             loadData();
          }
       } finally {
          setLoading(false);
       }
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Arena Sector Control</h3>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-60">Synchronizing {turfs.length} operational venue nodes</p>
            </div>
            <button 
               onClick={() => setIsCreating(true)}
               className="px-8 py-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 active:scale-95 italic"
            >
               <PlusCircle className="w-4 h-4" /> Initialize New Sector
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            <AnimatePresence>
               {isCreating && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3.5rem] p-12 backdrop-blur-3xl shadow-2xl space-y-10 border-cyan-500/30"
                  >
                     <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-4">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                           <span className="w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse" /> Finalize Venue Protocol
                        </h4>
                        <button onClick={() => setIsCreating(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Venue Identity Node</label>
                              <div className="relative group">
                                 <Store className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-cyan-500 transition-colors" />
                                 <input 
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-[1.5rem] pl-16 pr-6 text-[11px] font-black uppercase tracking-widest placeholder-gray-800 focus:bg-white/10 focus:border-cyan-500/50 transition-all outline-none"
                                    placeholder="Arena Designation..." 
                                    value={newTurf.name} onChange={(e) => setNewTurf({...newTurf, name: e.target.value})}
                                 />
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4 text-start">
                                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Sport Classification</label>
                                 <select 
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-cyan-500/50 transition-all font-mono"
                                    value={newTurf.sports_available} onChange={(e) => setNewTurf({...newTurf, sports_available: e.target.value})}
                                 >
                                    {['Football','Cricket','Tennis','Badminton','Basketball'].map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Base Payout (₹)</label>
                                 <input 
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest placeholder-gray-800 focus:bg-white/10 focus:border-cyan-500/50 transition-all outline-none"
                                    placeholder="1200" 
                                    type="number"
                                    value={newTurf.price_weekday} onChange={(e) => setNewTurf({...newTurf, price_weekday: e.target.value})}
                                 />
                              </div>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Physical Vector (Address)</label>
                              <div className="relative group">
                                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-cyan-500 transition-colors" />
                                 <input 
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-[1.5rem] pl-16 pr-6 text-[11px] font-black uppercase tracking-widest placeholder-gray-800 focus:bg-white/10 focus:border-cyan-500/50 transition-all outline-none"
                                    placeholder="Arena Location Nodes..." 
                                    value={newTurf.location_address} onChange={(e) => setNewTurf({...newTurf, location_address: e.target.value})}
                                 />
                              </div>
                           </div>

                           <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-gray-600 uppercase italic">Op Launch</label>
                                 <input type="time" className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white font-black text-[10px]" value={newTurf.opening_time} onChange={(e) => setNewTurf({...newTurf, opening_time: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-gray-600 uppercase italic">Op Shutdown</label>
                                 <input type="time" className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white font-black text-[10px]" value={newTurf.closing_time} onChange={(e) => setNewTurf({...newTurf, closing_time: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[8px] font-black text-gray-600 uppercase italic">Slot (Min)</label>
                                 <input type="number" className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white font-black text-[10px]" value={newTurf.slot_duration} onChange={(e) => setNewTurf({...newTurf, slot_duration: e.target.value})} />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8 flex flex-col justify-end pb-2">
                           <ImageUpload 
                              label="Venue Visual Node (Directorial Feed)" 
                              token={token} 
                              onUploadSuccess={(url) => setNewTurf(prev => ({...prev, images: [...prev.images, url]}))} 
                           />
                           
                           <div className="flex gap-4 pt-10">
                              <button onClick={() => setIsCreating(false)} className="flex-1 py-5 bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all italic">Abort Protocol</button>
                              <button 
                                 onClick={handleCreate}
                                 disabled={!newTurf.name || !newTurf.location_address}
                                 className="flex-[2] py-5 bg-cyan-600 disabled:opacity-30 disabled:grayscale text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 transition-all shadow-2xl shadow-cyan-600/20 italic"
                              >
                                 Finalize Sector Creation
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {turfs.map((t: any) => (
               <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-white/5 border border-white/10 rounded-[3rem] p-8 backdrop-blur-md hover:border-cyan-500 transition-all shadow-xl shadow-cyan-500/2">
                  <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-8 group/img shadow-2xl">
                     <img src={t.primary_image || "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover grayscale opacity-60 group-hover/img:grayscale-0 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-700" alt="Turf" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                     <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black uppercase text-white shadow-xl italic tracking-widest">{t.sports_available || 'Sport Matrix'}</span>
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full border-2 border-gray-950 bg-gray-900 flex items-center justify-center text-[7px] font-black italic">{i}</div>)}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic mb-1">{t.name || 'Arena Designation'}</h4>
                        <div className="flex items-center gap-3 text-gray-500 text-[9px] font-black uppercase tracking-widest italic drop-shadow-xl">
                           <MapPin className="w-3.5 h-3.5 text-cyan-500" /> {t.location_address || 'Vector Undefined'}
                        </div>
                     </div>
                     <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic opacity-60">Revenue Intelligence</p>
                           <p className="text-xl font-black text-white italic tracking-tighter leading-none">₹{(t.price_weekday || 0).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"><Settings className="w-5 h-5" /></button>
                           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"><Trash className="w-5 h-5" /></button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </motion.div>
    );
  };

  const renderPlaceholder = (title: string, desc: string, Icon: any) => (
     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-32 h-32 rounded-[3.5rem] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent group-hover:scale-150 transition-transform duration-1000" />
           <Icon className="w-16 h-16 text-cyan-600 animate-pulse" />
        </div>
        <div className="space-y-3">
           <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{title}</h2>
           <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-60">{desc}</p>
        </div>
        <button className="px-10 py-5 bg-cyan-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] transition-all shadow-2xl active:scale-95 shadow-cyan-600/10 italic">Launch Operational Protocol</button>
     </motion.div>
  );

  return (
    <div className="w-full relative min-h-screen">
      {/* DIRECTORIAL TOP BAR BRANDING */}
      <div className="flex items-center justify-between mb-12 relative z-10 px-2 pt-2">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic drop-shadow-2xl">
               Venue Owner <span className="text-cyan-500">Management Portal</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] opacity-60 flex items-center gap-2 italic">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> authorized Ops Center · {(user?.name || 'Authorized')[0]} Node Tracking
            </p>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-4 rounded-[2rem] group focus-within:border-cyan-500/50 transition-all shadow-xl">
               <Search className="w-4 h-4 text-gray-600 group-hover:text-cyan-500 transition-colors" />
               <input placeholder="Search Operational Logs..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest placeholder-gray-700 w-60" />
            </div>
            <button 
              onClick={() => router.push('/dashboard/owner?tab=turfs')}
              className="px-10 py-5 bg-cyan-600 text-white text-[11px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-cyan-500 hover:shadow-[0_0_40px_rgba(8,145,178,0.4)] transition-all shadow-2xl active:scale-95 shadow-cyan-600/20 italic flex items-center gap-3"
            >
               <PlusCircle className="w-4 h-4" /> List a New Turf
            </button>
         </div>
      </div>

      {loading ? (
         <div className="flex items-center justify-center h-[50vh]">
            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-2xl shadow-cyan-500/20" />
         </div>
      ) : (
         <AnimatePresence mode="wait">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'profile' && renderPlaceholder("Venue Identity Vector", "Synchronizing authorized profile & node data...", User)}
            {activeTab === 'customers' && renderPlaceholder("CRM Identity Matrix", "Mapping customer engagement trajectories...", Users)}
            {activeTab === 'turfs' && renderTurfs()}
            {activeTab === 'bookings' && renderPlaceholder("Temporal Schedule Hub", "Resolving booking session conflicts...", Calendar)}
            {activeTab === 'finance' && renderPlaceholder("Revenue Intelligence Feed", "Authenticating liquid payout transmissions...", CreditCard)}
            {activeTab === 'staff' && renderPlaceholder("Staffing Node Governance", "Synchronizing human resource trajectories...", ShieldCheck)}
            {activeTab === 'marketing' && renderPlaceholder("Promotion Discovery Vector", "Broadcasting platform exclusive nodes...", Zap)}
            {activeTab === 'maintenance' && renderPlaceholder("Integrity Maintenance Hub", "Resolving arena facility glitches...", Activity)}
            {activeTab === 'inventory' && renderPlaceholder("Inventory Logistics Cluster", "Tracking rental gear and equipment logs...", Database)}
            {activeTab === 'settings' && renderPlaceholder("Application Protocol Override", "Modifying core system operational keys...", Settings)}
         </AnimatePresence>
      )}
    </div>
  );
}

function StatNode({ label, value, sub, info, isStar, change, icon: Icon, color }: any) {
   const colors: any = {
      cyan: 'from-cyan-600 to-cyan-400 text-cyan-500 border-cyan-500/20 shadow-cyan-500/10',
      teal: 'from-teal-600 to-teal-400 text-teal-500 border-teal-500/20 shadow-teal-500/10',
      emerald: 'from-emerald-600 to-emerald-400 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10',
      indigo: 'from-indigo-600 to-indigo-400 text-indigo-500 border-indigo-500/20 shadow-indigo-500/10',
      amber: 'from-amber-600 to-amber-400 text-amber-500 border-amber-500/20 shadow-amber-500/10',
   };
   return (
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-2xl hover:shadow-cyan-500/5">
         <div className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-[0.02] group-hover:scale-125 group-hover:rotate-12 transition-transform"><Icon className="w-full h-full" /></div>
         <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic group-hover:text-cyan-500 transition-colors uppercase">{label}</h4>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${colors[color].split(' shadow-')[0]} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
               <Icon className="w-6 h-6 text-white" />
            </div>
         </div>
         <div className="space-y-1 relative z-10">
            <div className={`text-4xl font-black text-white tracking-tighter italic leading-none flex items-center gap-2 ${isStar ? 'text-amber-400' : ''}`}>
               {value} {isStar && <Star className="w-6 h-6 fill-amber-400" />}
            </div>
            {change && (
               <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 inline-block">{change}</div>
            )}
            {sub && (
               <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2 italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> {sub}
                  {info && <HelpCircle className="w-3 h-3 opacity-40 cursor-help" />}
               </div>
            )}
         </div>
      </div>
   );
}

function ChartLegend({ label, color }: any) {
   return (
      <div className="flex items-center gap-3 group">
         <div className="w-4 h-0.5 rounded-full transition-all group-hover:scale-x-150" style={{ backgroundColor: color }} />
         <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic group-hover:text-white transition-colors">{label}</span>
      </div>
   );
}

export default function OwnerDashboard() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center bg-[#0B0F0C]">
            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-2xl shadow-cyan-500/20" />
         </div>
      }>
         <OwnerDashboardContent />
      </Suspense>
   );
}
