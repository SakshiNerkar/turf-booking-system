"use client";

import Link from "next/link";
import { useEffect, useRef, useMemo, useState } from "react";
import { RequireAuth } from "../../../components/RequireAuth";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { notify } from "../../../lib/toast";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";

type Turf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; };
type BookingItem = { id: string; turf_name: string; customer_name: string; players: number; total_price: string; payment_status: string; start_time: string; end_time: string; };
type RevenueSummary = { today: string; weekly: string; monthly: string; all_time: string; total_bookings: number; paid_bookings: number; };

const SPORTS = ["football", "cricket", "badminton", "tennis"];
const SPORT_ICONS: Record<string, string> = { football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾" };
const BLANK = { name: "", location: "", sport_type: "football", price_per_slot: 1200, description: "" };

function fmt(dt: string) {
  return new Date(dt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
}

function PayBadge({ status }: { status: string }) {
  if (status === "success") return <span className="badge badge-green">✓ Paid</span>;
  if (status === "failed")  return <span className="badge badge-red">✗ Failed</span>;
  return <span className="badge badge-amber">⏳ Pending</span>;
}

export default function OwnerDashboard() {
  const { token, user } = useAuth();
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [bookings, setBookings] = useState<BookingItem[] | null>(null);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTurf, setNewTurf] = useState(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTurf, setEditTurf] = useState(BLANK);
  const [tab, setTab] = useState<"overview" | "turfs" | "bookings">("overview");
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !token) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      apiFetch<Turf[]>(`/api/turfs?owner_id=${user.id}&limit=50`),
      apiFetch<BookingItem[]>("/api/bookings", { token }),
      apiFetch<RevenueSummary>("/api/bookings/revenue/owner", { token }),
    ]).then(([tRes, bRes, rRes]) => {
      if (cancelled) return;
      setTurfs(tRes.ok ? tRes.data : []);
      setBookings(bRes.ok ? bRes.data : []);
      setRevenue(rRes.ok ? rRes.data : null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user, token]);

  async function handleCreate() {
    if (!token) return;
    setCreating(true);
    const res = await apiFetch<Turf>("/api/turfs", { method: "POST", token, body: newTurf });
    setCreating(false);
    if (!res.ok) { notify.error(res.error.message); return; }
    setTurfs((p) => [res.data, ...(p ?? [])]);
    setNewTurf(BLANK);
    notify.success("Turf created! 🏟️");
  }

  async function handleUpdate() {
    if (!token || !editingId) return;
    const res = await apiFetch<Turf>(`/api/turfs/${editingId}`, { method: "PUT", token, body: editTurf });
    if (!res.ok) { notify.error(res.error.message); return; }
    setTurfs((p) => p?.map((t) => t.id === editingId ? res.data : t) ?? null);
    setEditingId(null);
    notify.success("Turf updated ✅");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this turf? All slots and bookings will be removed.")) return;
    const res = await apiFetch(`/api/turfs/${id}`, { method: "DELETE", token: token! });
    if (!res.ok) { notify.error(res.error.message); return; }
    setTurfs((p) => p?.filter((t) => t.id !== id) ?? null);
    notify.success("Turf deleted");
  }

  const inputCls = "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 dark:border-white/15 dark:bg-black/30";

  const TABS = [
    { key: "overview" as const, label: "Overview", icon: "📊" },
    { key: "turfs"    as const, label: `Turfs (${turfs?.length ?? 0})`, icon: "🏟️" },
    { key: "bookings" as const, label: `Bookings (${bookings?.length ?? 0})`, icon: "📋" },
  ];

  return (
    <RequireAuth roles={["owner"]}>
      <div className="grid gap-5">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-6 bottom-2 text-7xl opacity-10 select-none">🏟️</div>
          <div className="relative">
            <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Owner Portal</div>
            <h1 className="text-2xl font-black sm:text-3xl">Welcome, {user?.name?.split(" ")[0]} 🏟️</h1>
            <p className="mt-1 text-white/65 text-sm">Manage your turfs, slots, and revenue.</p>
            {/* Tab nav in banner */}
            <div className="mt-5 flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    "inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-black transition-all",
                    tab === t.key
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/18",
                  ].join(" ")}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="grid gap-5">
            {/* Revenue stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {loading ? [1,2,3,4].map((i) => <SkeletonStat key={i} />) : (
                <>
                  <RevenueCard label="Today"     value={revenue?.today    ?? "0"} icon="☀️" color="from-amber-400/20 to-amber-500/8" />
                  <RevenueCard label="This Week"  value={revenue?.weekly   ?? "0"} icon="📅" color="from-blue-400/20 to-blue-500/8" />
                  <RevenueCard label="This Month" value={revenue?.monthly  ?? "0"} icon="📆" color="from-purple-400/20 to-purple-500/8" />
                  <RevenueCard label="All Time"   value={revenue?.all_time ?? "0"} icon="💰" color="from-green-400/20 to-green-500/8" />
                </>
              )}
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-3 gap-3">
              {loading ? [1,2,3].map(i => <SkeletonStat key={i} />) : (
                <>
                  <MiniStat icon="🏟️" label="Your Turfs"     value={turfs?.length ?? 0} />
                  <MiniStat icon="📋" label="Total Bookings" value={revenue?.total_bookings ?? 0} />
                  <MiniStat icon="✅" label="Paid Bookings"  value={revenue?.paid_bookings ?? 0} />
                </>
              )}
            </div>

            {/* Recent bookings preview */}
            {bookings && bookings.length > 0 && (
              <div className="card overflow-hidden">
                <div className="border-b border-black/5 dark:border-white/10 px-5 py-3 flex items-center justify-between">
                  <div className="text-sm font-black">Recent Bookings</div>
                  <button type="button" onClick={() => setTab("bookings")} className="text-xs font-bold text-[color:var(--primary)] hover:underline">
                    See all →
                  </button>
                </div>
                {bookings.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 border-b border-black/5 dark:border-white/8 px-5 py-3 last:border-0">
                    <div className="h-9 w-9 grid place-items-center rounded-xl bg-blue-500/10 text-lg">
                      {SPORT_ICONS[b.turf_name?.toLowerCase()] ?? "📋"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{b.customer_name}</div>
                      <div className="text-xs text-black/50 dark:text-white/40">{fmt(b.start_time)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <PayBadge status={b.payment_status} />
                      <span className="text-xs font-black text-[color:var(--primary)]">₹{Number(b.total_price).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TURFS TAB ── */}
        {tab === "turfs" && (
          <div className="grid gap-4">
            {/* Add turf form */}
            <div className="card p-5">
              <div className="text-sm font-black mb-4">➕ Add New Turf</div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input placeholder="Turf name" value={newTurf.name} onChange={(e) => setNewTurf(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                <input placeholder="Location" value={newTurf.location} onChange={(e) => setNewTurf(p => ({ ...p, location: e.target.value }))} className={inputCls} />
                <select value={newTurf.sport_type} onChange={(e) => setNewTurf(p => ({ ...p, sport_type: e.target.value }))} className={inputCls}>
                  {SPORTS.map(s => <option key={s} value={s}>{SPORT_ICONS[s]} {s}</option>)}
                </select>
                <input placeholder="Price/slot (₹)" type="number" value={newTurf.price_per_slot} onChange={(e) => setNewTurf(p => ({ ...p, price_per_slot: Number(e.target.value) }))} className={inputCls} />
                <input placeholder="Description (optional)" value={newTurf.description} onChange={(e) => setNewTurf(p => ({ ...p, description: e.target.value }))} className={inputCls + " sm:col-span-2"} />
              </div>
              <button
                type="button"
                disabled={creating || !newTurf.name || !newTurf.location}
                onClick={handleCreate}
                className="btn-primary mt-3 rounded-xl w-full sm:w-auto px-6 py-2.5 text-sm disabled:opacity-55"
              >
                {creating ? "Creating…" : "Create Turf 🏟️"}
              </button>
            </div>

            {/* Turf list */}
            <div className="card overflow-hidden">
              <div className="border-b border-black/5 dark:border-white/10 px-5 py-3 flex items-center justify-between">
                <div className="text-sm font-black">Your Turfs</div>
                <span className="badge badge-gray">{turfs?.length ?? 0} turfs</span>
              </div>
              {loading ? <div>{[1,2].map(i => <SkeletonRow key={i} />)}</div> :
               !turfs?.length ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-black/50 dark:text-white/40">
                  <span className="text-4xl">🏟️</span>
                  <span>No turfs yet. Add your first!</span>
                </div>
              ) : turfs.map((t) => (
                <div key={t.id} className="border-b border-black/5 dark:border-white/8 last:border-0">
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="h-10 w-10 grid place-items-center rounded-2xl bg-blue-500/10 text-xl shrink-0">
                      {SPORT_ICONS[t.sport_type?.toLowerCase()] ?? "🏟️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{t.name}</div>
                      <div className="text-xs text-black/50 dark:text-white/40">📍 {t.location} · ₹{Number(t.price_per_slot).toFixed(0)}/slot</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link href={`/turfs/${t.id}`} className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10 text-sm hover:bg-black/10 dark:hover:bg-white/15 transition-colors" title="View Slots">🗓️</Link>
                      <button type="button" onClick={() => { setEditingId(t.id); setEditTurf({ name: t.name, location: t.location, sport_type: t.sport_type, price_per_slot: Number(t.price_per_slot), description: "" }); setTimeout(() => editRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }}
                        className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10 text-sm hover:bg-black/10 transition-colors" title="Edit">✏️</button>
                      <button type="button" onClick={() => handleDelete(t.id)} className="h-8 w-8 grid place-items-center rounded-xl bg-red-500/10 text-sm hover:bg-red-500/18 transition-colors" title="Delete">🗑️</button>
                    </div>
                  </div>

                  {/* Inline edit */}
                  {editingId === t.id && (
                    <div ref={editRef} className="mx-5 mb-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 grid gap-2 sm:grid-cols-2">
                      <input value={editTurf.name} onChange={(e) => setEditTurf(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Name" />
                      <input value={editTurf.location} onChange={(e) => setEditTurf(p => ({ ...p, location: e.target.value }))} className={inputCls} placeholder="Location" />
                      <select value={editTurf.sport_type} onChange={(e) => setEditTurf(p => ({ ...p, sport_type: e.target.value }))} className={inputCls}>
                        {SPORTS.map(s => <option key={s} value={s}>{SPORT_ICONS[s]} {s}</option>)}
                      </select>
                      <input type="number" value={editTurf.price_per_slot} onChange={(e) => setEditTurf(p => ({ ...p, price_per_slot: Number(e.target.value) }))} className={inputCls} placeholder="Price" />
                      <div className="flex gap-2 sm:col-span-2">
                        <button type="button" onClick={handleUpdate} className="btn-primary rounded-xl px-4 py-2 text-sm flex-1">Save Changes</button>
                        <button type="button" onClick={() => setEditingId(null)} className="btn-ghost rounded-xl px-4 py-2 text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <div className="card overflow-hidden">
            <div className="border-b border-black/5 dark:border-white/10 px-5 py-3 flex items-center justify-between">
              <div className="text-sm font-black">All Bookings</div>
              <span className="badge badge-gray">{bookings?.length ?? 0}</span>
            </div>
            {loading ? <div>{[1,2,3].map(i => <SkeletonRow key={i} />)}</div> :
             !bookings?.length ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center text-sm text-black/50 dark:text-white/40">
                <span className="text-4xl">📋</span><span>No bookings yet</span>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/8">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 px-5 py-4 hover:bg-black/[0.02] transition-colors">
                    <div className="h-10 w-10 grid place-items-center rounded-2xl bg-green-500/10 text-xl shrink-0">👤</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{b.customer_name}</div>
                      <div className="text-xs text-black/50 dark:text-white/40">{b.turf_name} · {fmt(b.start_time)}</div>
                      <div className="text-xs text-black/40 dark:text-white/30">{b.players} players</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <PayBadge status={b.payment_status} />
                      <span className="text-sm font-black text-[color:var(--primary)]">₹{Number(b.total_price).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

function RevenueCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className={`card p-4 bg-gradient-to-br ${color}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xl font-black text-[color:var(--primary)]">₹{Number(value).toLocaleString()}</div>
      <div className="text-xs font-semibold text-black/50 dark:text-white/45 mt-0.5">{label}</div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl font-black">{value}</div>
      <div className="text-[11px] font-bold text-black/45 dark:text-white/40">{label}</div>
    </div>
  );
}
