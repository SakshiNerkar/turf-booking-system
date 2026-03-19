"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "../../../components/RequireAuth";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { notify } from "../../../lib/toast";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";

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
  if (status === "success") return <span className="badge badge-green">✓ Paid</span>;
  if (status === "failed")  return <span className="badge badge-red">✗ Failed</span>;
  return <span className="badge badge-amber">⏳ Pending</span>;
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
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "history",  label: "History",  count: past.length },
  ];

  return (
    <RequireAuth roles={["customer"]}>
      <div className="grid gap-5">

        {/* Banner */}
        <div className="animate-fade-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-900 p-6 text-white shadow-lg shadow-green-500/20 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute right-6 bottom-2 text-7xl opacity-10 select-none">⚽</div>
          <div className="relative">
            <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Customer Portal</div>
            <h1 className="text-2xl font-black sm:text-3xl">Hey, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="mt-1 text-white/65 text-sm">Your turf bookings — all in one place.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/turfs" className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white/15 px-4 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/25">
                🏟️ Browse Turfs
              </Link>
              <Link href="/bookings" className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/20 px-4 text-sm font-bold transition-all hover:bg-white/10">
                📋 All Bookings
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => <SkeletonStat key={i} />)
          ) : (
            <>
              <StatCard icon="📅" label="Total Bookings" value={bookings?.length ?? 0} color="bg-blue-500/10 text-blue-600" />
              <StatCard icon="⏰" label="Upcoming"       value={upcoming.length}       color="bg-green-500/10 text-green-700" />
              <StatCard icon="💰" label="Total Spent"    value={`₹${totalSpent.toLocaleString()}`} color="bg-purple-500/10 text-purple-600" className="col-span-2 sm:col-span-1" />
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="card overflow-hidden">
          <div className="border-b border-black/5 dark:border-white/10 flex items-center justify-between px-5 py-3 gap-3">
            <div className="flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    "inline-flex items-center gap-1.5 h-8 rounded-xl px-3.5 text-sm font-bold transition-all",
                    tab === t.key
                      ? "bg-green-600/12 text-green-700 dark:text-green-300"
                      : "text-black/55 hover:bg-black/5 dark:text-white/50",
                  ].join(" ")}
                >
                  {t.label}
                  <span className="min-w-[1.25rem] rounded-full bg-black/8 dark:bg-white/10 px-1 text-[10px] font-black text-center">
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <button type="button" onClick={loadBookings} className="text-xs font-bold text-black/40 dark:text-white/35 hover:text-black dark:hover:text-white transition-colors">
              ↻ Refresh
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div>{[1, 2, 3].map((i) => <SkeletonRow key={i} />)}</div>
          ) : displayList.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="text-5xl">{tab === "upcoming" ? "🗓️" : "📜"}</div>
              <div className="font-bold text-black/60 dark:text-white/55">
                {tab === "upcoming" ? "No upcoming bookings" : "No booking history"}
              </div>
              {tab === "upcoming" && (
                <Link href="/turfs" className="btn-primary rounded-xl px-4 py-2 text-sm mt-1">Browse Turfs →</Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/8">
              {displayList.map((b) => {
                const icon = SPORT_ICONS[b.sport_type?.toLowerCase()] ?? "🏟️";
                const isFuture = new Date(b.start_time) >= now;
                return (
                  <div key={b.id} className="flex items-center gap-3 p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/8 text-xl">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{b.turf_name}</div>
                      <div className="text-xs text-black/50 dark:text-white/45 mt-0.5">{fmtSlot(b.start_time, b.end_time)}</div>
                      <div className="text-xs text-black/40 dark:text-white/35 mt-0.5">
                        {b.players} players · ₹{Number(b.total_price).toFixed(0)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <PayBadge status={b.payment_status} />
                      {isFuture && b.payment_status !== "success" && (
                        <button
                          type="button"
                          disabled={cancelling === b.id}
                          onClick={() => handleCancel(b.id)}
                          className="text-[11px] font-bold text-red-600/70 hover:text-red-600 dark:text-red-400/70 dark:hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          {cancelling === b.id ? "…" : "Cancel"}
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
    </RequireAuth>
  );
}

function StatCard({ icon, label, value, color, className = "" }: { icon: string; label: string; value: string | number; color: string; className?: string }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className={`grid h-10 w-10 place-items-center rounded-2xl ${color} text-xl mb-3`}>{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold text-black/50 dark:text-white/45 mt-0.5">{label}</div>
    </div>
  );
}
