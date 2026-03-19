"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "../../components/RequireAuth";
import { useAuth } from "../../components/AuthProvider";
import { apiFetch } from "../../lib/api";
import { notify } from "../../lib/toast";
import { SkeletonRow } from "../../components/Skeletons";

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
  const date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const from = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const to   = new Date(end).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return { date, time: `${from} – ${to}` };
}

function PayBadge({ status }: { status: string }) {
  if (status === "success") return <span className="badge badge-green">✓ Paid</span>;
  if (status === "failed")  return <span className="badge badge-red">✗ Failed</span>;
  return <span className="badge badge-amber">⏳ Pending</span>;
}

export default function BookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingListItem[] | null>(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"upcoming" | "history">("upcoming");
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<BookingListItem[]>("/api/bookings", { token });
    setLoading(false);
    if (!res.ok) { notify.error(res.error.message); return; }
    setBookings(res.data);
  }

  useEffect(() => { load(); }, [token]);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(id);
    const res = await apiFetch(`/api/bookings/${id}`, { method: "DELETE", token: token! });
    setCancelling(null);
    if (!res.ok) { notify.error(res.error.message); return; }
    notify.success("Booking cancelled ✅");
    setBookings((prev) => prev?.filter((b) => b.id !== id) ?? null);
  }

  const now = new Date();
  const upcoming = useMemo(() =>
    (bookings ?? []).filter(b => new Date(b.start_time) >= now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
  [bookings]);
  const past = useMemo(() =>
    (bookings ?? []).filter(b => new Date(b.start_time) < now)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()),
  [bookings]);

  const list = tab === "upcoming" ? upcoming : past;
  const totalSpent = useMemo(() =>
    (bookings ?? []).filter(b => b.payment_status === "success")
      .reduce((s, b) => s + Number(b.total_price), 0),
  [bookings]);

  return (
    <RequireAuth roles={["customer"]}>
      <div className="grid gap-5 max-w-3xl mx-auto">

        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-black tracking-tight">📋 My Bookings</h1>
          <p className="text-sm text-black/55 dark:text-white/50 mt-1">
            All your turf reservations in one place.
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total",    value: bookings?.length ?? "—",                       icon: "📅", color: "bg-blue-500/8"   },
            { label: "Upcoming", value: upcoming.length,                                icon: "⏰", color: "bg-green-500/8"  },
            { label: "Spent",    value: `₹${totalSpent.toLocaleString()}`,             icon: "💰", color: "bg-purple-500/8" },
          ].map((s) => (
            <div key={s.label} className={`card ${s.color} p-4 text-center`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-black">{s.value}</div>
              <div className="text-[11px] font-bold text-black/45 dark:text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs + List */}
        <div className="card overflow-hidden">
          <div className="border-b border-black/5 dark:border-white/10 px-5 py-3 flex items-center justify-between">
            <div className="flex gap-1">
              {[
                { key: "upcoming" as const, label: "Upcoming", count: upcoming.length },
                { key: "history"  as const, label: "History",  count: past.length },
              ].map((t) => (
                <button key={t.key} type="button" onClick={() => setTab(t.key)}
                  className={["inline-flex items-center gap-1.5 h-8 rounded-xl px-3.5 text-sm font-bold transition-all",
                    tab === t.key ? "bg-green-500/12 text-green-700 dark:text-green-300" : "text-black/50 hover:bg-black/5 dark:text-white/45"
                  ].join(" ")}
                >
                  {t.label}
                  <span className="min-w-[1.25rem] rounded-full bg-black/8 dark:bg-white/10 px-1 text-[10px] font-black text-center">{t.count}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={load} title="Refresh" className="text-xs font-bold text-black/35 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div>{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="text-5xl">{tab === "upcoming" ? "🗓️" : "📜"}</div>
              <div className="font-bold text-black/55 dark:text-white/50">
                {tab === "upcoming" ? "No upcoming bookings" : "No booking history yet"}
              </div>
              {tab === "upcoming" && (
                <Link href="/turfs" className="btn-primary rounded-xl px-5 py-2.5 text-sm mt-1">Browse Turfs →</Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/8">
              {list.map((b) => {
                const { date, time } = fmtSlot(b.start_time, b.end_time);
                const isFuture = new Date(b.start_time) >= now;
                const cancellable = isFuture && b.payment_status !== "success";
                return (
                  <div key={b.id} className="flex items-start gap-3.5 p-4 sm:p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    {/* Sport icon */}
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/8 text-2xl">
                      {SPORT_ICONS[b.sport_type?.toLowerCase()] ?? "🏟️"}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm truncate">{b.turf_name}</div>
                      <div className="text-xs text-black/50 dark:text-white/45 mt-0.5">📍 {b.location}</div>
                      <div className="text-xs text-black/55 dark:text-white/50 mt-1.5 font-semibold">{date}</div>
                      <div className="text-xs text-black/45 dark:text-white/40">{time}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <PayBadge status={b.payment_status} />
                        <span className="text-xs text-black/45 dark:text-white/35">
                          {b.players} players · <span className="font-bold text-[color:var(--primary)]">₹{Number(b.total_price).toFixed(0)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Link
                        href={`/turfs/${b.turf_id}`}
                        className="text-[11px] font-bold text-[color:var(--primary)] hover:underline"
                      >
                        View Turf
                      </Link>
                      {cancellable && (
                        <button
                          type="button"
                          disabled={cancelling === b.id}
                          onClick={() => handleCancel(b.id)}
                          className="text-[11px] font-bold text-red-600/60 hover:text-red-600 dark:text-red-400/60 dark:hover:text-red-400 disabled:opacity-40 transition-colors"
                        >
                          {cancelling === b.id ? "Cancelling…" : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA if empty */}
        {!loading && (bookings ?? []).length === 0 && (
          <div className="text-center py-8">
            <Link href="/turfs" className="btn-primary rounded-2xl px-8 py-3 font-black text-sm">
              🏟️ Find a Turf to Book
            </Link>
          </div>
        )}

      </div>
    </RequireAuth>
  );
}
