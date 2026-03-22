"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { notify } from "@/lib/toast";
import { SkeletonRow } from "@/components/Skeletons";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, CreditCard, Activity, ArrowRight, RefreshCw, History, User } from "lucide-react";

type BookingListItem = {
  id: string;
  turf_id: string;
  turf_name: string;
  location: string;
  sport_type: string;
  players: number;
  total_price: string;
  payment_status: string;
  start_time: string;
  end_time: string;
};

const SPORT_ICONS: Record<string, string> = {
  football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾",
};

function fmtSlot(start: string, end: string) {
  const d = new Date(start);
  const date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const from = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const to   = new Date(end).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${date} · ${from} – ${to}`;
}

function PayBadge({ status }: { status: string }) {
  if (status === "success") return <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider">✓ Paid</span>;
  if (status === "failed")  return <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider">✗ Failed</span>;
  return <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider">⏳ Pending</span>;
}

export default function CustomerDashboard() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<BookingListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function loadBookings() {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<BookingListItem[]>("/api/bookings", { token });
    setLoading(false);
    if (!res.ok) { notify.error(res.error.message); return; }
    setBookings(res.data);
  }

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking? The slot will be released.")) return;
    setCancelling(id);
    const res = await apiFetch(`/api/bookings/${id}`, { method: "DELETE", token: token! });
    setCancelling(null);
    if (!res.ok) { notify.error(res.error.message); return; }
    notify.success("Booking cancelled. Slot released ✅");
    setBookings((prev) => prev?.filter((b) => b.id !== id) ?? null);
  }

  const now = new Date();
  const upcoming = useMemo(() => (bookings ?? []).filter((b) => new Date(b.start_time) >= now).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()), [bookings]);
  const past     = useMemo(() => (bookings ?? []).filter((b) => new Date(b.start_time) < now).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()), [bookings]);
  const totalSpent = useMemo(() => (bookings ?? []).filter(b => b.payment_status === "success").reduce((s, b) => s + Number(b.total_price), 0), [bookings]);
  const displayList = tab === "upcoming" ? upcoming : past;

  const TABS: { key: "upcoming" | "history"; label: string; count: number }[] = [
    { key: "upcoming", label: "Active Bookings", count: upcoming.length },
    { key: "history",  label: "Past Matches",  count: past.length },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Bookings" 
          value={bookings?.length ?? 0} 
          icon={Calendar} 
          trend={{ value: "+12%", isUp: true }}
        />
        <StatCard 
          title="Ongoing / Active" 
          value={upcoming.length} 
          icon={Activity} 
          trend={{ value: "Live", isUp: true }}
        />
        <StatCard 
          title="Total Spend" 
          value={`₹${totalSpent.toLocaleString()}`} 
          icon={CreditCard} 
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/[0.02] overflow-hidden">
        {/* Header/Tabs */}
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
                {t.label}
                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${tab === t.key ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <button 
            onClick={loadBookings}
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-colors pr-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH DATA
          </button>
        </div>

        {/* Content List */}
        <div className="p-2 sm:p-4">
          {loading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </div>
          ) : displayList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                 {tab === "upcoming" ? <Calendar className="w-10 h-10 text-gray-300" /> : <History className="w-10 h-10 text-gray-300" />}
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                {tab === "upcoming" ? "No Active Bookings" : "No Past Matches Found"}
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">
                {tab === "upcoming" 
                  ? "You don't have any sessions scheduled right now. Time to hit the field!" 
                  : "You haven't completed any bookings yet. Start your journey today."}
              </p>
              <Link href="/turfs" className="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/20 hover:scale-105 transition-all flex items-center gap-2">
                Explore Arenas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-2">
              {displayList.map((b) => {
                const icon = SPORT_ICONS[b.sport_type?.toLowerCase()] ?? "🏟️";
                const isFuture = new Date(b.start_time) >= now;
                return (
                  <div key={b.id} className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-[2rem] hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-3xl shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-black text-gray-900 dark:text-white truncate">{b.turf_name}</span>
                        <PayBadge status={b.payment_status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {fmtSlot(b.start_time, b.end_time)}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary" /> {b.players} Players</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
                      <div className="text-xl font-black text-gray-900 dark:text-white">
                        ₹{Number(b.total_price).toFixed(0)}
                      </div>
                      {isFuture && b.payment_status !== "success" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelling === b.id}
                          className="px-4 py-1.5 rounded-xl text-xs font-black text-red-500 hover:bg-red-500/10 transition-colors border border-red-500/20 disabled:opacity-40"
                        >
                          {cancelling === b.id ? "PROCCESSING..." : "CANCEL SESSION"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
