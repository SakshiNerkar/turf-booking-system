import Link from "next/link";

const NAV_LINKS = [
  { label: "Browse Turfs", href: "/turfs" },
  { label: "Login",        href: "/login" },
  { label: "Register",     href: "/register" },
];

const ROLE_LINKS = [
  { label: "Customer Dashboard", href: "/dashboard/customer" },
  { label: "Owner Dashboard",    href: "/dashboard/owner" },
  { label: "Admin Dashboard",    href: "/dashboard/admin" },
];

const SPORTS = ["⚽ Football", "🏏 Cricket", "🏸 Badminton", "🎾 Tennis"];

export function Footer() {
  return (
    <footer className="mt-6 border-t border-black/5 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-sm font-black text-white shadow-md shadow-green-500/30">
                T
              </div>
              <span className="text-base font-bold tracking-tight">Turff</span>
            </Link>
            <p className="mt-3 text-sm text-black/60 dark:text-white/55 leading-relaxed">
              Book sports turfs. Play more. Stress less.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {SPORTS.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-green-500/8 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              Platform
            </div>
            <ul className="grid gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-semibold text-black/70 dark:text-white/65 transition-colors hover:text-green-600 dark:hover:text-green-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              Dashboards
            </div>
            <ul className="grid gap-2">
              {ROLE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-semibold text-black/70 dark:text-white/65 transition-colors hover:text-green-600 dark:hover:text-green-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              Contact & Support
            </div>
            <ul className="grid gap-2 text-sm text-black/70 dark:text-white/65">
              <li className="font-semibold">support@turff.local</li>
              <li>Mon–Sun • 6:00 AM – 11:00 PM</li>
              <li className="mt-2">
                <a
                  href="mailto:support@turff.local"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-[color:var(--primary)] px-4 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-xl"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-6 dark:border-white/10 sm:flex-row">
          <p className="text-xs text-black/45 dark:text-white/40">
            © {new Date().getFullYear()} Turff Booking System. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-black/40 dark:text-white/35">
            Built with{" "}
            <span className="text-red-500">♥</span>{" "}
            using Next.js &amp; TypeScript
          </div>
        </div>
      </div>
    </footer>
  );
}
