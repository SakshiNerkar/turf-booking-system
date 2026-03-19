"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { apiFetch } from "../../lib/api";
import type { PublicUser } from "../../lib/auth";
import { notify } from "../../lib/toast";

type AuthResponse = { token: string; user: PublicUser };

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("customer@turff.local");
  const [password, setPassword] = useState("Customer@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="animate-scale-in rounded-3xl border border-black/5 bg-white/70 p-7 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-2xl shadow-lg shadow-green-500/30">
            🔐
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/55">
            Sign in to manage your bookings.
          </p>
        </div>

        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await apiFetch<AuthResponse>("/api/auth/login", {
                method: "POST",
                body: { email, password },
              });
              if (!res.ok) {
                setError(res.error.message);
                notify.error(res.error.message);
                return;
              }
              setAuth(res.data.token, res.data.user);
              notify.success(`Welcome back, ${res.data.user.name}! 👋`);
              if (res.data.user.role === "admin")       router.push("/dashboard/admin");
              else if (res.data.user.role === "owner")  router.push("/dashboard/owner");
              else                                       router.push("/dashboard/customer");
            } finally {
              setLoading(false);
            }
          }}
        >
          {/* Email */}
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-black/65 dark:text-white/65">Email address</span>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-black/35 dark:text-white/35">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-black/10 bg-white/60 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500/40 focus:border-green-600/40 dark:border-white/15 dark:bg-black/20"
              />
            </div>
          </label>

          {/* Password */}
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-black/65 dark:text-white/65">Password</span>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-black/35 dark:text-white/35">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 11h10v10H7V11Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <input
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                required
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-black/10 bg-white/60 pl-10 pr-10 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500/40 focus:border-green-600/40 dark:border-white/15 dark:bg-black/20"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-3 grid place-items-center text-black/35 hover:text-black/70 dark:text-white/35 dark:hover:text-white/70 transition-colors"
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          {/* Error */}
          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              ⚠️ {error}
            </div>
          ) : null}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 h-11 w-full rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </span>
            ) : "Sign in →"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-5 rounded-2xl bg-[color:var(--muted)] px-4 py-3 dark:bg-black/20">
          <div className="text-xs font-bold text-black/50 dark:text-white/40 mb-2">Demo credentials</div>
          <div className="grid gap-1 text-xs text-black/60 dark:text-white/55">
            <div>Customer: <span className="font-mono">customer@turff.local</span> / <span className="font-mono">Customer@123</span></div>
            <div>Owner: <span className="font-mono">owner@turff.local</span> / <span className="font-mono">Owner@123</span></div>
            <div>Admin: <span className="font-mono">admin@turff.local</span> / <span className="font-mono">Admin@123</span></div>
          </div>
        </div>

        {/* Register link */}
        <p className="mt-5 text-center text-sm text-black/55 dark:text-white/50">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[color:var(--primary)] hover:underline">
            Register for free →
          </Link>
        </p>
      </div>
    </div>
  );
}
