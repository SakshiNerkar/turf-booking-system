"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { DarkModeToggle } from "./DarkModeToggle";


export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      {/* Frosted glass bar */}
      <div className="border-b border-black/8 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#070f0a]/90">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">

          {/* ── Logo ── */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-sm font-black text-white shadow-md shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/40">
              T
            </div>
            <div>
              <div className="text-base font-black tracking-tight leading-none">Turff</div>
              <div className="text-[9px] font-bold text-black/35 dark:text-white/35 uppercase tracking-widest leading-none">Book. Play. Win.</div>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            <NavLink href="/turfs" active={isActive("/turfs")} id="nav-browse">
              🏟️ Browse
            </NavLink>
            {user && (
              <NavLink href={`/dashboard/${user.role}`} active={isActive("/dashboard")} id="nav-dashboard">
                📊 Dashboard
              </NavLink>
            )}
            {user?.role === "customer" && (
              <NavLink href="/bookings" active={isActive("/bookings")} id="nav-bookings">
                📋 Bookings
              </NavLink>
            )}
          </nav>

          {/* ── Right Section ── */}
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <DarkModeToggle />
            {user && (
              <Link
                href={user.role === 'customer' ? '/bookings' : `/dashboard/${user.role}`}
                title="Notifications"
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-black/8 bg-white/70 text-base shadow-sm transition-all hover:scale-110 dark:border-white/12 dark:bg-black/30"
              >
                🔔
              </Link>
            )}
            {user ? (
              <>
                {/* Avatar pill */}
                <div className="flex items-center gap-2 rounded-2xl border border-black/8 bg-black/[0.03] px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.05]">
                  <div
                    className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-green-400 to-green-700 text-xs font-black text-white shadow"
                    title={user.email}
                  >
                    {initials(user.name)}
                  </div>
                  <div className="leading-none">
                    <div className="text-xs font-black truncate max-w-[100px]">{user.name}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-black/40 dark:text-white/35">
                      {user.role}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="nav-logout"
                  onClick={() => { logout(); router.push("/"); }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3 text-xs font-bold text-red-700 transition-all hover:bg-red-500/15 dark:text-red-400 dark:border-red-500/15"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  id="nav-login"
                  className={`inline-flex h-9 items-center rounded-xl px-4 text-sm font-bold transition-all ${
                    isActive("/login")
                      ? "bg-green-500/10 text-green-700 dark:text-green-300"
                      : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  id="nav-register"
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-5 text-sm font-black text-white shadow-md shadow-green-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/35"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-black/8 bg-white/60 sm:hidden dark:border-white/10 dark:bg-black/20"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-black/8 bg-white/95 px-4 pb-5 pt-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#070f0a]/95 sm:hidden">
          <div className="grid gap-1">
            <MobileLink href="/turfs" onClick={() => setMenuOpen(false)}>🏟️ Browse Turfs</MobileLink>
            {user && (
              <>
                <MobileLink href={`/dashboard/${user.role}`} onClick={() => setMenuOpen(false)}>📊 Dashboard</MobileLink>
                {user.role === "customer" && (
                  <MobileLink href="/bookings" onClick={() => setMenuOpen(false)}>📋 My Bookings</MobileLink>
                )}
                <div className="my-2 border-t border-black/5 dark:border-white/10" />
                {/* User card */}
                <div className="flex items-center gap-3 rounded-2xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.05]">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-400 to-green-700 text-xs font-black text-white">
                    {initials(user.name)}
                  </div>
                  <div>
                    <div className="text-sm font-black">{user.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/35">{user.role}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { logout(); router.push("/"); setMenuOpen(false); }}
                  className="mt-1 w-full rounded-xl border border-red-500/20 bg-red-500/8 py-2.5 text-sm font-bold text-red-700 dark:text-red-400 text-left px-3"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <MobileLink href="/login" onClick={() => setMenuOpen(false)}>Login</MobileLink>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 block rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-2.5 text-center text-sm font-black text-white shadow-md shadow-green-500/20"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, active, children, id }: { href: string; active: boolean; children: React.ReactNode; id?: string }) {
  return (
    <Link
      href={href}
      id={id}
      className={[
        "inline-flex h-9 items-center rounded-xl px-3.5 text-sm font-bold transition-all duration-200",
        active
          ? "bg-green-500/12 text-green-700 dark:text-green-300"
          : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2.5 text-sm font-bold text-black/75 transition-all hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/5"
    >
      {children}
    </Link>
  );
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
}
