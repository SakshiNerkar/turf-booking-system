"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "../../../components/RequireAuth";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { notify } from "../../../lib/toast";
import { SkeletonStat, SkeletonRow } from "../../../components/Skeletons";

type AdminTurf = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  is_active: boolean;
  owner_name?: string;
  owner_email?: string;
};
type AdminBooking = {
  id: string;
  total_price: string;
  payment_status: string;
  turf_name?: string;
  owner_name?: string;
  customer_name?: string;
  start_time?: string;
};
type AdminRevenue = { total_amount: string };
type AdminUser = { id: string; name: string; email: string; role: string };

const ROLE_COLORS: Record<string, string> = {
  admin:    "badge-red",
  owner:    "badge-green",
  customer: "badge-gray",
};

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [turfs, setTurfs] = useState<AdminTurf[] | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [revenue, setRevenue] = useState<AdminRevenue[] | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [tab, setTab] = useState<"overview" | "users" | "turfs" | "bookings">("overview");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) return;
      setLoading(true);
      const [tRes, bRes, rRes, uRes] = await Promise.all([
        apiFetch<AdminTurf[]>("/api/admin/turfs", { token }),
        apiFetch<AdminBooking[]>("/api/admin/bookings", { token }),
        apiFetch<AdminRevenue[]>("/api/admin/revenue", { token }),
        apiFetch<AdminUser[]>("/api/admin/users", { token }),
      ]);
      if (cancelled) return;
      setLoading(false);
      if (!tRes.ok) notify.error(tRes.error.message);
      if (!bRes.ok) notify.error(bRes.error.message);
      if (!uRes.ok) notify.error(uRes.error.message);
      setTurfs(tRes.ok ? tRes.data : []);
      setBookings(bRes.ok ? bRes.data : []);
      setRevenue(rRes.ok ? rRes.data : []);
      setUsers(uRes.ok ? uRes.data : []);
    })();
    return () => { cancelled = true; };
  }, [token]);

  const totalRevenue = useMemo(() => {
    if (!revenue) return null;
    return revenue.reduce((s, r) => s + Number(r.total_amount), 0);
  }, [revenue]);

  const paidBookings = useMemo(
    () => (bookings ?? []).filter(b => b.payment_status === "success").length,
    [bookings],
  );
  const activeUsers   = useMemo(() => (users ?? []).filter(u => u.role === "customer").length, [users]);
  const activeOwners  = useMemo(() => (users ?? []).filter(u => u.role === "owner").length, [users]);
  const activeTurfs   = useMemo(() => (turfs ?? []).filter(t => t.is_active).length, [turfs]);

  return (
    <RequireAuth roles={["admin"]}>
      <div className="grid gap-5">

        {/* ── Header Banner ── */}
        <div className="animate-fade-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-950 p-6 text-white shadow-md sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-widest opacity-60">Admin Dashboard</div>
            <div className="mt-1 text-2xl font-bold">{user?.name} ⚙️</div>
            <div className="mt-1 text-sm opacity-60">{user?.email}</div>

            {/* Quick tabs */}
            <div className="mt-5 flex flex-wrap gap-2">
              {([
                ["overview",  "🏠 Overview"],
                ["users",     "👥 Users"],
                ["turfs",     "🏟️ Turfs"],
                ["bookings",  "📋 Bookings"],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
                    tab === id
                      ? "bg-white text-gray-900"
                      : "border border-white/20 text-white/75 hover:bg-white/10",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Search (non-overview) ── */}
        {tab !== "overview" && (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-black/40 dark:text-white/40">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${tab}…`}
              className="h-11 w-full rounded-xl border border-black/10 bg-white/70 pl-10 pr-4 text-sm shadow-sm outline-none transition-all focus:ring-2 focus:ring-green-500/40 focus:border-green-600/40 dark:border-white/15 dark:bg-black/30"
            />
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="grid gap-5">
            {/* Big stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {loading ? [1,2,3,4].map(i => <SkeletonStat key={i} />) : (
                <>
                  <StatCard icon="👥" label="Total Users"     value={String(users?.length ?? "—")}          color="bg-blue-500/10 text-blue-700"   />
                  <StatCard icon="🏟️" label="Active Turfs"    value={String(activeTurfs)}                   color="bg-green-500/10 text-green-700" />
                  <StatCard icon="📋" label="Total Bookings"  value={String(bookings?.length ?? "—")}        color="bg-purple-500/10 text-purple-700"/>
                  <StatCard icon="💰" label="Total Revenue"   value={totalRevenue === null ? "—" : `₹${totalRevenue.toFixed(0)}`} color="bg-amber-500/10 text-amber-700" />
                </>
              )}
            </div>

            {/* Secondary stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {loading ? [1,2,3].map(i => <SkeletonStat key={i} />) : (
                <>
                  <MiniStat label="Customers"     value={activeUsers}    icon="🏃" />
                  <MiniStat label="Turf Owners"   value={activeOwners}   icon="🏟️" />
                  <MiniStat label="Paid Bookings" value={paidBookings}   icon="✅" />
                </>
              )}
            </div>

            {/* Role breakdown */}
            {users && users.length > 0 && (
              <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
                <div className="text-sm font-bold mb-4">👥 User Role Breakdown</div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(["customer", "owner", "admin"] as const).map((role) => {
                    const count = users.filter(u => u.role === role).length;
                    const pct   = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
                    return (
                      <div key={role} className="rounded-2xl bg-[color:var(--muted)] p-4 dark:bg-black/30">
                        <div className="flex items-center justify-between">
                          <span className={`badge ${ROLE_COLORS[role]}`}>{role}</span>
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-black/50 dark:text-white/40">{pct}% of all users</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <DataTable
            title="Users"
            empty="No users found."
            columns={[
              { key: "name",  label: "Name"  },
              { key: "email", label: "Email" },
              { key: "role",  label: "Role"  },
            ]}
            rows={(users ?? []).filter((u) => match(q, `${u.name} ${u.email} ${u.role}`))}
            renderCell={(col, row) => {
              if (col === "role") return <span className={`badge ${ROLE_COLORS[row.role] ?? "badge-gray"}`}>{row.role}</span>;
              return String(row[col] ?? "—");
            }}
            actions={(row) => row.role !== "admin" ? (
              <div className="flex items-center gap-1.5 justify-end">
                <button type="button" title="Ban user"
                  className="h-7 px-2.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/18 transition-colors"
                  onClick={async () => {
                    if (!confirm(`Ban ${row.name}? They won't be able to log in.`)) return;
                    const res = await apiFetch(`/api/admin/users/${row.id}/ban`, { method: "PATCH", token: token! });
                    if (!res.ok) { notify.error(res.error.message); return; }
                    notify.success(`${row.name} banned.`);
                  }}
                >Ban</button>
                <button type="button" title="Delete user"
                  className="h-7 px-2.5 rounded-lg bg-red-500/10 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-500/18 transition-colors"
                  onClick={async () => {
                    if (!confirm(`Permanently delete ${row.name}? This cannot be undone.`)) return;
                    const res = await apiFetch(`/api/admin/users/${row.id}`, { method: "DELETE", token: token! });
                    if (!res.ok) { notify.error(res.error.message); return; }
                    setUsers((prev) => prev?.filter((u) => u.id !== row.id) ?? null);
                    notify.success(`${row.name} deleted.`);
                  }}
                >Delete</button>
              </div>
            ) : null}
          />
        )}

        {/* ── TURFS TAB ── */}
        {tab === "turfs" && (
          <DataTable
            title="Turfs"
            empty="No turfs found."
            columns={[
              { key: "name",          label: "Turf"     },
              { key: "location",      label: "Location" },
              { key: "sport_type",    label: "Sport"    },
              { key: "price_per_slot",label: "Price"    },
              { key: "is_active",     label: "Status"   },
            ]}
            rows={(turfs ?? [])
              .filter((t) => match(q, `${t.name} ${t.location} ${t.sport_type} ${t.owner_name ?? ""}`))
              .map(t => ({ ...t, price_per_slot: `₹${Number(t.price_per_slot).toFixed(0)}`, is_active: t.is_active }))}
            renderCell={(col, row) => {
              if (col === "is_active")
                return row[col]
                  ? <span className="badge badge-green">Active</span>
                  : <span className="badge badge-red">Inactive</span>;
              return String(row[col] ?? "—");
            }}
            actions={(row) => (
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-red-500/10 px-3 text-xs font-bold text-red-700 transition-all hover:bg-red-500/20 dark:text-red-300"
                onClick={async () => {
                  if (!token) return;
                  const res = await apiFetch(`/api/admin/turfs/${row.id}`, { method: "DELETE", token });
                  if (!res.ok) { notify.error(res.error.message); return; }
                  notify.success("Turf deactivated.");
                  setTurfs(prev => prev ? prev.map(t => t.id === row.id ? { ...t, is_active: false } : t) : prev);
                }}
              >
                Deactivate
              </button>
            )}
          />
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <DataTable
            title="Bookings"
            empty="No bookings found."
            columns={[
              { key: "turf_name",     label: "Turf"     },
              { key: "customer_name", label: "Customer" },
              { key: "owner_name",    label: "Owner"    },
              { key: "payment_status",label: "Payment"  },
              { key: "total_price",   label: "Total"    },
            ]}
            rows={(bookings ?? [])
              .filter((b) => match(q, `${b.turf_name ?? ""} ${b.customer_name ?? ""} ${b.owner_name ?? ""} ${b.payment_status}`))
              .map(b => ({ ...b, total_price: `₹${Number(b.total_price).toFixed(0)}` }))}
            renderCell={(col, row) => {
              if (col === "payment_status") {
                if (row[col] === "success") return <span className="badge badge-green">✓ Paid</span>;
                if (row[col] === "failed")  return <span className="badge badge-red">✗ Failed</span>;
                return <span className="badge badge-amber">⏳ Pending</span>;
              }
              return String(row[col] ?? "—");
            }}
          />
        )}

      </div>
    </RequireAuth>
  );
}

/* ── StatCard ── */
function StatCard(props: { icon: string; label: string; value: string; color?: string }) {
  const c = props.color ?? "bg-[color:var(--muted)] text-[color:var(--primary)]";
  return (
    <div className="animate-scale-in rounded-3xl border border-black/5 bg-white/70 p-5 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
      <div className={`stat-icon ${c}`}>{props.icon}</div>
      <div className="text-xs font-semibold text-black/50 dark:text-white/45">{props.label}</div>
      <div className="mt-1.5 text-2xl font-bold tracking-tight">{props.value}</div>
    </div>
  );
}

function MiniStat(props: { label: string; value: number; icon: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
      <span className="text-2xl">{props.icon}</span>
      <div>
        <div className="text-xs text-black/50 dark:text-white/45">{props.label}</div>
        <div className="text-lg font-bold">{props.value}</div>
      </div>
    </div>
  );
}

/* ── DataTable ── */
function DataTable(props: {
  title: string;
  empty: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, any>>;
  renderCell?: (col: string, row: Record<string, any>) => React.ReactNode;
  actions?: (row: any) => React.ReactNode;
}) {
  const cols = props.columns.length + (props.actions ? 1 : 0);
  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
      <div className="text-sm font-bold mb-4">{props.title}</div>
      {props.rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-sm text-black/50 dark:text-white/45">
          <div className="text-3xl">📭</div>
          {props.empty}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/15">
          <div
            className="grid bg-black/5 px-4 py-3 text-xs font-bold text-black/50 dark:bg-white/10 dark:text-white/50"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {props.columns.map((c) => <div key={c.key}>{c.label}</div>)}
            {props.actions ? <div className="text-right">Actions</div> : null}
          </div>

          {props.rows.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-2 border-t border-black/5 bg-white/50 px-4 py-3 text-sm backdrop-blur-lg transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {props.columns.map((c) => (
                <div key={c.key} className="truncate">
                  {props.renderCell ? props.renderCell(c.key, row) : String(row[c.key] ?? "—")}
                </div>
              ))}
              {props.actions ? <div className="flex justify-end">{props.actions(row)}</div> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function match(q: string, haystack: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return haystack.toLowerCase().includes(s);
}
