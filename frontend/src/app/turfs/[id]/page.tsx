import Link from "next/link";
import { API_BASE_URL, type ApiResponse } from "../../../lib/api";
import { CalendarBooking } from "../../../components/CalendarBooking";
import { TurfMap } from "../../../components/TurfMap";

type Turf = {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  description: string | null;
};

type Slot = {
  id: string;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "blocked";
};

type TurfDetails = { turf: Turf; slots: Slot[] };

const SPORT_META: Record<string, { icon: string; gradient: string; textColor: string }> = {
  football:  { icon: "⚽", gradient: "from-green-600  to-emerald-800", textColor: "text-green-100" },
  cricket:   { icon: "🏏", gradient: "from-amber-600  to-orange-800",   textColor: "text-amber-100" },
  badminton: { icon: "🏸", gradient: "from-blue-600   to-indigo-800",   textColor: "text-blue-100"  },
  tennis:    { icon: "🎾", gradient: "from-orange-500 to-red-700",      textColor: "text-orange-100"},
};

export default async function TurfDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let json: ApiResponse<TurfDetails>;
  try {
    const res = await fetch(`${API_BASE_URL}/api/turfs/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    json = (await res.json()) as ApiResponse<TurfDetails>;
  } catch {
    return (
      <div className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🔌</span>
          <div>
            <div className="text-lg font-black text-orange-900 dark:text-orange-100 mb-2">
              Backend not running
            </div>
            <p className="text-sm text-orange-800/80 dark:text-orange-200/75 mb-4">
              The backend server is offline. Start it to load turf details.
            </p>
            <code className="inline-block rounded-xl bg-orange-600/15 px-4 py-2 font-mono text-sm text-orange-900 dark:text-orange-200 mb-4">
              cd backend &amp;&amp; npm run dev
            </code>
            <div className="flex gap-2">
              <Link href="/turfs" className="btn-primary rounded-xl px-5 py-2.5 text-sm inline-flex">
                ← Browse Turfs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (!json.ok) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-700 dark:text-red-300">
        ⚠️ {json.error.message}
      </div>
    );
  }

  const { turf, slots } = json.data;
  const meta = SPORT_META[turf.sport_type?.toLowerCase()] ?? {
    icon: "🏟️",
    gradient: "from-gray-700 to-gray-900",
    textColor: "text-gray-100",
  };

  const available = slots.filter(s => s.status === "available").length;
  const booked    = slots.filter(s => s.status === "booked").length;
  const blocked   = slots.filter(s => s.status === "blocked").length;

  return (
    <div className="grid gap-5">

      {/* ── Hero Banner — BookMyShow style ── */}
      <div className="animate-fade-in overflow-hidden rounded-3xl shadow-lg">
        {/* Dark gradient hero with big sport emoji */}
        <div className={`relative bg-gradient-to-br ${meta.gradient} overflow-hidden`} style={{ minHeight: 220 }}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          {/* Large icon watermark */}
          <div className="absolute right-6 bottom-0 text-[10rem] leading-none opacity-15 select-none"
            style={{ filter: "drop-shadow(0 0 40px rgba(255,255,255,0.3))" }}
          >
            {meta.icon}
          </div>

          {/* Back button */}
          <Link
            href="/turfs"
            className="absolute left-4 top-4 inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/20 bg-black/25 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/40"
          >
            ← Back
          </Link>

          {/* Content */}
          <div className="relative p-6 pt-16 sm:p-8 sm:pt-16">
            <div className={`inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ${meta.textColor} mb-3 backdrop-blur-sm`}>
              {meta.icon} {turf.sport_type}
            </div>
            <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight leading-tight">
              {turf.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/75">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              {turf.location}
            </div>
          </div>
        </div>

        {/* Info strip below hero */}
        <div className="bg-white dark:bg-[#0d1a10] border-t-0 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Description */}
            <div className="flex-1 min-w-0">
              {turf.description ? (
                <p className="text-sm text-black/65 dark:text-white/60 leading-relaxed">{turf.description}</p>
              ) : (
                <p className="text-sm text-black/45 dark:text-white/40">Premium sports turf with bookable hourly slots.</p>
              )}

              {/* Slot stats strip */}
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-300">{available} Available</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-red-700 dark:text-red-300">{booked} Booked</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-400/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{blocked} Blocked</span>
                </div>
              </div>
            </div>

            {/* Price badge */}
            <div className="shrink-0">
              <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-700/5 p-4 text-center min-w-[120px]">
                <div className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/35 mb-0.5">per slot</div>
                <div className="text-3xl font-black text-[color:var(--primary)] leading-tight">
                  ₹{Number(turf.price_per_slot).toFixed(0)}
                </div>
                <div className="text-[10px] text-black/40 dark:text-white/30 mt-0.5">incl. taxes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout: Calendar + Map ── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

        {/* Calendar */}
        <CalendarBooking
          turfId={turf.id}
          turfName={turf.name}
          turfOwnerId={turf.owner_id}
          pricePerSlot={Number(turf.price_per_slot)}
          slots={slots}
          location={turf.location}
        />

        {/* Right column — Map + Amenities */}
        <div className="grid gap-4 content-start">
          {/* Map */}
          <TurfMap locationName={turf.location} turfName={turf.name} />

          {/* Quick Info */}
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1a10]">
            <div className="border-b border-black/5 dark:border-white/10 px-4 py-3">
              <div className="text-sm font-black">🏟️ Turf Info</div>
            </div>
            <div className="p-4 grid gap-3">
              {[
                { label: "Sport", value: `${meta.icon} ${turf.sport_type}` },
                { label: "Location", value: `📍 ${turf.location}` },
                { label: "Price", value: `₹${Number(turf.price_per_slot).toFixed(0)} / slot` },
                { label: "Total slots", value: `${slots.length} slots available` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-black/50 dark:text-white/40 font-semibold">{row.label}</span>
                  <span className="font-bold text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
