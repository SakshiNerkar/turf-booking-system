import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 py-16">
      {/* Animated sports emojis */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="text-8xl font-black text-black/5 dark:text-white/5 select-none absolute">
          404
        </div>
        <div className="relative flex gap-3 text-5xl animate-bounce">
          <span style={{ animationDelay: "0s" }}>⚽</span>
          <span style={{ animationDelay: "0.15s", display: "inline-block" }} className="animate-bounce">🏏</span>
          <span style={{ animationDelay: "0.3s", display: "inline-block" }} className="animate-bounce">🏸</span>
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-black/55 dark:text-white/50 text-base max-w-md leading-relaxed mb-8">
        Looks like this turf doesn&apos;t exist. The page you&apos;re looking for has moved, been deleted, or maybe never existed.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="btn-primary rounded-2xl px-7 py-3 font-black"
        >
          🏠 Go Home
        </Link>
        <Link
          href="/turfs"
          className="btn-ghost rounded-2xl px-7 py-3 font-bold"
        >
          🏟️ Browse Turfs
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 text-center max-w-xs">
        {[
          { href: "/login", label: "Login", icon: "🔐" },
          { href: "/register", label: "Register", icon: "✨" },
          { href: "/bookings", label: "Bookings", icon: "📋" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex flex-col items-center gap-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] p-3 text-xs font-bold text-black/60 dark:text-white/55 transition-all hover:bg-black/[0.07] hover:text-black dark:hover:text-white"
          >
            <span className="text-xl">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
