"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { notify } from "../../../lib/toast";
import { SkeletonRow } from "../../../components/Skeletons";
import { StatCard } from "../../../components/dashboard/StatCard";
import { motion } from "framer-motion";
import { 
  Plus, Settings, MapPin, Calendar, CreditCard, Activity, 
  Users, TrendingUp, BarChart3, RefreshCw, Trash2, Edit3 
} from "lucide-react";

type Turf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; };
type BookingItem = { id: string; turf_name: string; customer_name: string; players: number; total_price: string; payment_status: string; start_time: string; end_time: string; };
type RevenueSummary = { today: string; weekly: string; monthly: string; all_time: string; total_bookings: number; paid_bookings: number; };

const SPORT_ICONS: Record<string, string> = { football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾" };
const BLANK = { name: "", location: "", sport_type: "football", price_per_slot: 1200, description: "" };

function fmt(dt: string) {
  return new Date(dt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
}

function PayBadge({ status }: { status: string }) {
  if (status === "success") return <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider">✓ Paid</span>;
  if (status === "failed")  return <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider">✗ Failed</span>;
  return <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider">⏳ Pending</span>;
}

export default function OwnerDashboard() {
  const { token, user } = useAuth();
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [bookings, setBookings] = useState<BookingItem[] | null>(null);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "turfs" | "bookings">("overview");

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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const TABS = [
    { key: "overview" as const, label: "Overview", icon: BarChart3 },
    { key: "turfs"    as const, label: "My Venues", icon: MapPin },
    { key: "bookings" as const, label: "Recent Bookings", icon: Calendar },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Revenue" 
          value={`₹${Number(revenue?.today || 0).toLocaleString()}`} 
          icon={CreditCard} 
          trend={{ value: "+8%", isUp: true }}
        />
        <StatCard 
          title="Total Earnings" 
          value={`₹${Number(revenue?.all_time || 0).toLocaleString()}`} 
          icon={TrendingUp} 
          trend={{ value: "+24%", isUp: true }}
        />
        <StatCard 
          title="Active Turfs" 
          value={turfs?.length ?? 0} 
          icon={Activity} 
        />
        <StatCard 
          title="Total Bookings" 
          value={revenue?.total_bookings ?? 0} 
          icon={Users} 
        />
      </div>

      {/* Main App-like Container */}
      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/[0.02] overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                  tab === t.key 
                    ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={loadData}
              className="p-2.5 rounded-xl text-gray-400 hover:text-primary transition-colors hover:bg-white dark:hover:bg-white/5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link 
              href="/dashboard/owner/add" 
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              ADD NEW TURF
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          {tab === "overview" && (
             <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Bookings List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white px-2">Latest Requests</h3>
                  {bookings?.slice(0, 5).map(b => (
                    <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A241D] flex items-center justify-center text-2xl shadow-sm">
                        {SPORT_ICONS[b.turf_name?.toLowerCase()] ?? "🏟️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-gray-900 dark:text-white truncate">{b.customer_name}</div>
                        <div className="text-xs font-bold text-gray-500">{fmt(b.start_time)}</div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                         <span className="text-sm font-black text-primary">₹{Number(b.total_price).toFixed(0)}</span>
                         <PayBadge status={b.payment_status} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setTab("bookings")} className="w-full py-4 text-xs font-black text-primary hover:bg-primary/5 rounded-2xl transition-colors">
                    VIEW COMPLETE HISTORY
                  </button>
                </div>

                {/* Performance Chart Placeholder/Visual */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 flex flex-col justify-between border border-gray-100 dark:border-white/5">
                   <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Store Performance</h3>
                    <p className="text-sm font-medium text-gray-500">Your engagement is up 12% from last month.</p>
                   </div>
                   <div className="h-48 flex items-end gap-3 px-4">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="flex-1 bg-primary/20 rounded-t-lg relative group"
                        >
                          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                        </motion.div>
                      ))}
                   </div>
                   <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                   </div>
                </div>
             </div>
          )}

          {tab === "turfs" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs?.map(t => (
                <div key={t.id} className="group relative bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-transparent hover:border-gray-100 dark:hover:border-white/10 p-6 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A241D] flex items-center justify-center text-3xl shadow-sm border border-gray-100 dark:border-white/5 transition-transform group-hover:scale-110">
                      {SPORT_ICONS[t.sport_type?.toLowerCase()] ?? "🏟️"}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-xl bg-white dark:bg-[#1A241D] text-gray-400 hover:text-primary transition-colors shadow-sm">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-xl bg-white dark:bg-[#1A241D] text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">{t.name}</h4>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400 mb-6">
                    <MapPin className="w-3.5 h-3.5" /> {t.location}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                    <div className="text-xl font-black text-primary">₹{Number(t.price_per_slot).toFixed(0)}<span className="text-xs text-gray-400 ml-1">/HR</span></div>
                    <Link href={`/turfs/${t.id}`} className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-green-500/20 hover:scale-110 transition-all">
                      <Calendar className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "bookings" && (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {bookings?.map(b => (
                <div key={b.id} className="flex items-center gap-4 py-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-gray-900 dark:text-white leading-none mb-1">{b.customer_name}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{b.turf_name} · {fmt(b.start_time)}</div>
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-1 px-8 border-x border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Players</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{b.players} Units</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5 pl-4">
                    <span className="text-lg font-black text-gray-900 dark:text-white">₹{Number(b.total_price).toFixed(0)}</span>
                    <PayBadge status={b.payment_status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
