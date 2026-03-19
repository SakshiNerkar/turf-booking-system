"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, type ApiResponse } from "../../lib/api";
import { SkeletonCard } from "../../components/Skeletons";

type Turf = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  description: string | null;
};

const SPORT_META: Record<string, { icon: string; bg: string; badge: string }> = {
  football:  { icon: "⚽", bg: "from-green-200/70  to-green-300/40  dark:from-green-900/40  dark:to-green-800/20",  badge: "badge-green" },
  cricket:   { icon: "🏏", bg: "from-amber-200/70  to-amber-300/40  dark:from-amber-900/40  dark:to-amber-800/20",  badge: "badge-amber" },
  badminton: { icon: "🏸", bg: "from-blue-200/70   to-blue-300/40   dark:from-blue-900/40   dark:to-blue-800/20",   badge: "badge-gray"  },
  tennis:    { icon: "🎾", bg: "from-orange-200/70 to-orange-300/40 dark:from-orange-900/40 dark:to-orange-800/20", badge: "badge-amber" },
};

function getSportMeta(sport: string) {
  return SPORT_META[sport?.toLowerCase()] ?? {
    icon: "🏟️",
    bg: "from-gray-200/60 to-gray-300/30 dark:from-gray-800/40 dark:to-gray-700/20",
    badge: "badge-gray",
  };
}

const SPORT_OPTIONS = [
  { value: "", label: "🏅 All Sports" },
  { value: "football",  label: "⚽ Football" },
  { value: "cricket",   label: "🏏 Cricket"  },
  { value: "badminton", label: "🏸 Badminton" },
  { value: "tennis",    label: "🎾 Tennis"   },
];

export default function TurfsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [turfs, setTurfs]     = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Filter state (synced with URL)
  const [q,          setQ]          = useState(searchParams.get("q")          ?? "");
  const [location,   setLocation]   = useState(searchParams.get("location")   ?? "");
  const [sport_type, setSportType]  = useState(searchParams.get("sport_type") ?? "");
  const [min_price,  setMinPrice]   = useState(searchParams.get("min_price")  ?? "");
  const [max_price,  setMaxPrice]   = useState(searchParams.get("max_price")  ?? "");

  const fetchTurfs = useCallback(async (params?: {
    q?: string; location?: string; sport_type?: string; min_price?: string; max_price?: string;
  }) => {
    setLoading(true);
    setError(null);
    setIsOffline(false);

    const qs = new URLSearchParams();
    const p = params ?? { q, location, sport_type, min_price, max_price };
    if (p.q)          qs.set("q",          p.q);
    if (p.location)   qs.set("location",   p.location);
    if (p.sport_type) qs.set("sport_type", p.sport_type);
    if (p.min_price)  qs.set("min_price",  p.min_price);
    if (p.max_price)  qs.set("max_price",  p.max_price);
    qs.set("limit", "50");

    const res = await apiFetch<Turf[]>(`/api/turfs?${qs.toString()}`);
    setLoading(false);

    if (!res.ok) {
      const code = (res as any).error?.code;
      setIsOffline(code === "NETWORK_ERROR");
      setError((res as any).error?.message ?? "Failed to load turfs");
      setTurfs([]);
      return;
    }
    setTurfs(res.data);
  }, [q, location, sport_type, min_price, max_price]);

  // Load on mount and when URL changes
  useEffect(() => {
    const p = {
      q:          searchParams.get("q")          ?? "",
      location:   searchParams.get("location")   ?? "",
      sport_type: searchParams.get("sport_type") ?? "",
      min_price:  searchParams.get("min_price")  ?? "",
      max_price:  searchParams.get("max_price")  ?? "",
    };
    setQ(p.q); setLocation(p.location); setSportType(p.sport_type);
    setMinPrice(p.min_price); setMaxPrice(p.max_price);
    fetchTurfs(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q)          qs.set("q",          q);
    if (location)   qs.set("location",   location);
    if (sport_type) qs.set("sport_type", sport_type);
    if (min_price)  qs.set("min_price",  min_price);
    if (max_price)  qs.set("max_price",  max_price);
    router.push(`/turfs?${qs.toString()}`);
  }

  function handleClear() {
    setQ(""); setLocation(""); setSportType(""); setMinPrice(""); setMaxPrice("");
    router.push("/turfs");
  }

  const hasFilters = !!(q || location || sport_type || min_price || max_price);
  const inputCls = "h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 dark:border-white/15 dark:bg-black/20";

  return (
    <div className="grid gap-6">

      {/* ── Header & Filters ── */}
      <div className="animate-fade-in rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h1 className="text-xl font-black tracking-tight">🏟️ Browse Turfs</h1>
            <p className="mt-0.5 text-sm text-black/55 dark:text-white/50">
              {loading ? "Loading…" : `${turfs?.length ?? 0} turf${turfs?.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchTurfs()}
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/10 bg-white/60 px-3 text-xs font-bold text-black/60 hover:bg-black/5 dark:border-white/15 dark:bg-black/20 dark:text-white/55"
          >
            ↻ Refresh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-6">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <div className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-black/35 dark:text-white/35">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <input name="q" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, location, or sport…"
              className={inputCls + " pl-10"}
            />
          </div>

          <input name="location" value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="📍 Location" className={inputCls + " sm:col-span-2"} />

          <select name="sport_type" value={sport_type} onChange={(e) => setSportType(e.target.value)}
            className={inputCls + " sm:col-span-2"}>
            {SPORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <input name="min_price" value={min_price} onChange={(e) => setMinPrice(e.target.value)}
            placeholder="₹ Min" inputMode="numeric" className={inputCls} />
          <input name="max_price" value={max_price} onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="₹ Max" inputMode="numeric" className={inputCls} />

          <button type="submit" className="sm:col-span-6 btn-primary h-11 w-full rounded-xl text-sm font-bold">
            🔍 Apply Filters
          </button>
          {hasFilters && (
            <button type="button" onClick={handleClear}
              className="sm:col-span-6 h-9 w-full rounded-xl border border-black/10 bg-white/60 text-sm font-semibold text-black/60 transition hover:bg-black/5 dark:border-white/15 dark:bg-black/20 dark:text-white/55">
              ✕ Clear filters
            </button>
          )}
        </form>
      </div>

      {/* ── Sport quick-links ── */}
      <div className="flex flex-wrap gap-2">
        {SPORT_OPTIONS.slice(1).map((s) => (
          <button key={s.value} type="button"
            onClick={() => { setSportType(s.value); router.push(`/turfs?sport_type=${s.value}`); }}
            className={[
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-all",
              sport_type === s.value
                ? "bg-green-600/15 text-green-700 dark:text-green-300 border border-green-500/30"
                : "bg-black/[0.04] text-black/65 hover:bg-black/[0.08] dark:bg-white/[0.06] dark:text-white/65 dark:hover:bg-white/10",
            ].join(" ")}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Offline / Error Banner ── */}
      {error && !loading && (
        <div className={`rounded-2xl border p-5 ${
          isOffline
            ? "border-orange-500/30 bg-orange-500/10"
            : "border-red-500/20 bg-red-500/8"
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">{isOffline ? "🔌" : "⚠️"}</span>
            <div className="flex-1">
              <div className={`font-black text-sm mb-1 ${isOffline ? "text-orange-800 dark:text-orange-200" : "text-red-700 dark:text-red-300"}`}>
                {isOffline ? "Backend server not running" : "API Error"}
              </div>
              <div className={`text-sm ${isOffline ? "text-orange-700/85 dark:text-orange-300/80" : "text-red-600/80"}`}>
                {error}
              </div>
              {isOffline && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <code className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600/12 px-3 py-1.5 font-mono text-xs text-orange-800 dark:text-orange-200">
                    cd backend &amp;&amp; npm run dev
                  </code>
                  <button type="button" onClick={() => fetchTurfs()}
                    className="inline-flex h-8 items-center rounded-xl bg-orange-600 px-3 text-xs font-bold text-white transition hover:bg-orange-700">
                    Retry ↻
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Skeleton loading ── */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Empty state (no results, not loading, no error) ── */}
      {!loading && !error && turfs?.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white/70 p-16 text-center shadow-sm dark:border-white/10 dark:bg-black/30">
          <div className="text-5xl">🏟️</div>
          <p className="text-base font-bold text-black/65 dark:text-white/60">
            No turfs found matching your filters.
          </p>
          {hasFilters && (
            <button type="button" onClick={handleClear} className="btn-primary rounded-xl px-6 py-2.5 text-sm">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Turf Cards ── */}
      {!loading && turfs && turfs.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {turfs.map((t, i) => {
            const meta = getSportMeta(t.sport_type);
            return (
              <div
                key={t.id}
                className={`group animate-fade-in stagger-${Math.min(i + 1, 6)} overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm backdrop-blur-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:border-white/10 dark:bg-black/30`}
              >
                {/* Image area */}
                <div className={`relative h-40 w-full bg-gradient-to-br ${meta.bg} overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-25 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110">
                    {meta.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className={`badge ${meta.badge} absolute left-3 top-3`}>
                    {meta.icon} {t.sport_type}
                  </span>
                  <div className="absolute right-3 top-3 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-black text-green-700 shadow-sm dark:bg-black/70 dark:text-green-300">
                    ₹{Number(t.price_per_slot).toFixed(0)}
                    <span className="ml-1 text-[10px] font-semibold opacity-60">/slot</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="font-black text-sm truncate">{t.name}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-black/55 dark:text-white/50">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" strokeWidth="2.2" />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.2" />
                    </svg>
                    <span className="truncate">{t.location}</span>
                  </div>
                  {t.description ? (
                    <p className="mt-2 line-clamp-2 text-xs text-black/55 dark:text-white/50 leading-relaxed">{t.description}</p>
                  ) : (
                    <p className="mt-2 text-xs text-black/40 dark:text-white/35">Premium sports turf. Click to book.</p>
                  )}

                  <div className="mt-3.5 flex items-center gap-2">
                    <Link
                      href={`/turfs/${t.id}`}
                      id={`turf-${t.id}`}
                      className="btn-primary flex-1 rounded-xl py-2.5 text-xs font-black"
                    >
                      View &amp; Book
                    </Link>
                    <Link
                      href={`/turfs/${t.id}`}
                      title="View calendar"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-black/10 bg-white/80 text-base transition hover:bg-green-50 dark:border-white/15 dark:bg-black/20 dark:hover:bg-green-950/30"
                    >
                      📅
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
