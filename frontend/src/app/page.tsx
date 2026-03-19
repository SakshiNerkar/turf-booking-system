import Link from "next/link";

const STATS = [
  { value: "500+", label: "Turfs Listed",    icon: "🏟️" },
  { value: "12K+", label: "Bookings Done",   icon: "📅" },
  { value: "4.8★", label: "Average Rating",  icon: "⭐" },
  { value: "24/7", label: "Always Open",     icon: "⚡" },
];

const FEATURES = [
  { icon: "📅", title: "Real-Time Calendar", desc: "See live slot availability and book instantly. No double-booking, ever.", color: "from-green-500/15 to-emerald-500/8" },
  { icon: "🔒", title: "Safe Payments",      desc: "Pay online or at venue. Secure JWT auth protects every transaction.", color: "from-blue-500/15 to-blue-600/8" },
  { icon: "🏟️", title: "Any Sport",          desc: "Football, cricket, badminton, tennis — find your ideal turf.", color: "from-orange-500/15 to-amber-500/8" },
  { icon: "📍", title: "Location Maps",      desc: "Every turf pinned on a live OpenStreetMap so you never get lost.", color: "from-purple-500/15 to-violet-500/8" },
  { icon: "⚡", title: "Instant Confirm",    desc: "Booking confirmed in seconds. Animated receipt delivered immediately.", color: "from-yellow-500/15 to-amber-400/8" },
  { icon: "👤", title: "Role Dashboards",    desc: "Customer, Owner, Admin — each with their own tailored workspace.", color: "from-pink-500/15 to-rose-500/8" },
];

const SPORTS = [
  { name: "Football",  icon: "⚽", count: "180+ turfs", color: "bg-green-500/10  hover:bg-green-500/18  text-green-700  dark:text-green-300" },
  { name: "Cricket",   icon: "🏏", count: "120+ turfs", color: "bg-amber-500/10  hover:bg-amber-500/18  text-amber-700  dark:text-amber-300" },
  { name: "Badminton", icon: "🏸", count: "90+ turfs",  color: "bg-blue-500/10   hover:bg-blue-500/18   text-blue-700   dark:text-blue-300" },
  { name: "Tennis",    icon: "🎾", count: "60+ turfs",  color: "bg-orange-500/10 hover:bg-orange-500/18 text-orange-700 dark:text-orange-300" },
];

const STEPS = [
  { n: "01", title: "Choose Your Sport",  desc: "Browse 500+ verified turfs for your sport.", icon: "🏅" },
  { n: "02", title: "Pick a Time Slot",   desc: "Use the live calendar to find an open slot.", icon: "📅" },
  { n: "03", title: "Confirm & Pay",      desc: "Book instantly and pay online or at venue.", icon: "💳" },
  { n: "04", title: "Play!",              desc: "Show your booking confirmation and play.",   icon: "🏆" },
];

const ROLES = [
  {
    role: "Customer",
    emoji: "🏃",
    headline: "Play More, Stress Less",
    desc: "Browse turfs, pick slots on a live calendar, and get instant booking confirmation — all in seconds.",
    features: ["Real-time availability", "Booking history", "Payment tracking", "Maps & directions"],
    cta: "Start Booking",
    href: "/register",
    gradient: "from-green-600 to-emerald-700",
    glow: "shadow-green-500/25",
  },
  {
    role: "Owner",
    emoji: "🏟️",
    headline: "Run Your Turf Smarter",
    desc: "List your turf, manage time slots, track bookings and revenue — all from one powerful dashboard.",
    features: ["Add & manage turfs", "Slot management", "Revenue analytics", "Booking insight"],
    cta: "List Your Turf",
    href: "/register",
    gradient: "from-blue-600 to-indigo-700",
    glow: "shadow-blue-500/25",
  },
  {
    role: "Admin",
    emoji: "⚙️",
    headline: "Platform at Your Fingertips",
    desc: "Full visibility into users, turfs, bookings, and revenue. Manage everything from a single command centre.",
    features: ["User management", "Turf oversight", "Booking overview", "Revenue reports"],
    cta: "Admin Login",
    href: "/login",
    gradient: "from-purple-600 to-violet-700",
    glow: "shadow-purple-500/25",
  },
];

const REVIEWS = [
  { name: "Arjun M.",  role: "Customer", text: "Booked a football turf for our Sunday league in under 2 minutes. The calendar is super slick!", stars: 5, sport: "⚽" },
  { name: "Priya S.",  role: "Customer", text: "Finally an app that shows real slot availability. No more calling the turf and waiting!", stars: 5, sport: "🏸" },
  { name: "Ramesh K.", role: "Owner",    text: "Added my cricket turf in 5 minutes. The owner dashboard shows all bookings in real time.", stars: 5, sport: "🏏" },
];

export default function HomePage() {
  return (
    <div className="grid gap-0">

      {/* ══════════════════════════════════
          HERO — BookMyShow-level
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-[#071a0e] to-[#0a2e16] px-6 py-16 text-white sm:px-12 sm:py-24">
        {/* Dot grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        {/* Blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Live badge */}
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-green-300">
          <span className="badge-live inline-block h-2 w-2 rounded-full bg-green-400" />
          LIVE — Real-time slot booking
        </div>

        {/* Headline */}
        <div className="animate-slide-up max-w-3xl">
          <h1 className="text-hero font-black leading-[1.06] tracking-tight">
            Book{" "}
            <span className="gradient-text">Sports Turfs</span>
            <br />
            in Under 60 Seconds.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/65 leading-relaxed">
            500+ verified turfs. Live calendars. Instant confirmation.
            Pay online or at venue — the choice is yours.
          </p>
        </div>

        {/* Sport pills */}
        <div className="animate-fade-in stagger-2 mt-6 flex flex-wrap gap-2">
          {SPORTS.map((s) => (
            <Link
              key={s.name}
              href={`/turfs?sport_type=${s.name.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-3.5 py-1.5 text-xs font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white hover:border-white/25"
            >
              {s.icon} {s.name}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="animate-fade-in stagger-3 mt-8 flex flex-wrap gap-3">
          <Link
            href="/turfs"
            id="hero-browse"
            className="inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-7 text-sm font-black text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/40"
          >
            🏟️ Browse Turfs
          </Link>
          <Link
            href="/register"
            id="hero-register"
            className="inline-flex h-13 items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-0.5"
          >
            Get Started Free →
          </Link>
        </div>

        {/* Floating sport icons */}
        <div className="animate-float pointer-events-none absolute right-8 top-12 text-5xl opacity-20 sm:text-7xl sm:opacity-15">⚽</div>
        <div className="animate-float pointer-events-none absolute right-28 bottom-8 text-4xl opacity-15" style={{ animationDelay: "1.5s" }}>🏏</div>
        <div className="animate-float pointer-events-none absolute right-14 top-1/2 text-3xl opacity-10" style={{ animationDelay: "0.7s" }}>🏸</div>
      </section>

      {/* ══════════════════════════════════
          STATS STRIP
      ══════════════════════════════════ */}
      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`animate-scale-in stagger-${i + 1} card flex flex-col items-center justify-center gap-1 py-6 text-center`}
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="text-2xl font-black tracking-tight">{s.value}</div>
            <div className="text-xs font-semibold text-black/50 dark:text-white/45">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════
          SPORTS CATEGORIES
      ══════════════════════════════════ */}
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">Browse by Sport</h2>
          <Link href="/turfs" className="text-sm font-bold text-[color:var(--primary)] hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SPORTS.map((s, i) => (
            <Link
              key={s.name}
              href={`/turfs?sport_type=${s.name.toLowerCase()}`}
              className={`animate-scale-in stagger-${i + 1} group flex flex-col items-center gap-2.5 rounded-2xl ${s.color} px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
              <div className="font-black text-sm">{s.name}</div>
              <div className="text-[11px] font-semibold opacity-65">{s.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section className="mt-12">
        <div className="mb-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 text-xs font-bold text-green-700 dark:text-green-300 mb-3">
            Simple process
          </div>
          <h2 className="text-2xl font-black tracking-tight">Book in 4 Easy Steps</h2>
          <p className="mt-1.5 text-sm text-black/55 dark:text-white/50">From browsing to playing in under 2 minutes.</p>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className={`animate-fade-in stagger-${i + 1} card p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/8 text-xl">
                  {step.icon}
                </div>
                <div className="text-xs font-black text-black/25 dark:text-white/20 tracking-widest">{step.n}</div>
              </div>
              <div className="font-black text-sm mb-1">{step.title}</div>
              <div className="text-xs text-black/55 dark:text-white/50 leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════ */}
      <section className="mt-12">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-black tracking-tight">Everything You Need</h2>
          <p className="mt-1.5 text-sm text-black/55 dark:text-white/50">Built for players, owners, and platform admins.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-in stagger-${Math.min(i + 1, 6)} card-hover card bg-gradient-to-br ${f.color} p-5`}
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <div className="font-black text-sm mb-1.5">{f.title}</div>
              <div className="text-xs text-black/60 dark:text-white/55 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          ROLE CARDS — Zomato style
      ══════════════════════════════════ */}
      <section className="mt-12">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-black tracking-tight">For Every Role</h2>
          <p className="mt-1.5 text-sm text-black/55 dark:text-white/50">Three tailored experiences in one platform.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {ROLES.map((r, i) => (
            <div
              key={r.role}
              className={`animate-fade-in stagger-${i + 1} overflow-hidden rounded-3xl border border-black/5 dark:border-white/8 flex flex-col`}
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-br ${r.gradient} px-5 py-6 text-white`}>
                <div className="text-3xl mb-2">{r.emoji}</div>
                <div className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">{r.role}</div>
                <div className="text-lg font-black leading-tight">{r.headline}</div>
              </div>
              {/* Body */}
              <div className="flex flex-1 flex-col bg-white p-5 dark:bg-[#0d1a10]">
                <p className="text-xs text-black/60 dark:text-white/55 leading-relaxed mb-4">{r.desc}</p>
                <ul className="grid gap-1.5 mb-5 flex-1">
                  {r.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs font-semibold text-black/70 dark:text-white/65">
                      <span className="h-4 w-4 shrink-0 rounded-full bg-green-500/15 text-[10px] font-black text-green-700 dark:text-green-300 grid place-items-center">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={r.href} className={`btn-primary bg-gradient-to-r ${r.gradient} rounded-xl text-xs font-black shadow-md shadow-black/15 py-2.5`}>
                  {r.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          REVIEWS
      ══════════════════════════════════ */}
      <section className="mt-12">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-black tracking-tight">What Players Say</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <div key={r.name} className={`animate-fade-in stagger-${i + 1} card p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-xl font-black text-green-700 dark:text-green-300">
                  {r.sport}
                </div>
                <div>
                  <div className="text-sm font-black">{r.name}</div>
                  <div className="text-[11px] text-black/45 dark:text-white/35">{r.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-xs text-black/65 dark:text-white/60 leading-relaxed italic">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
      ══════════════════════════════════ */}
      <section className="mt-10 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 px-8 py-10 text-center text-white sm:px-16 sm:py-14">
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <div className="text-5xl mb-4 animate-float">🏆</div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Ready to Play?</h2>
            <p className="mt-2 text-white/75 text-sm max-w-md mx-auto">
              Join thousands of players booking turfs every day. Free to sign up — takes 30 seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-8 text-sm font-black text-green-700 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                🎉 Create Free Account
              </Link>
              <Link
                href="/turfs"
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/25 px-8 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                Browse Turfs
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
