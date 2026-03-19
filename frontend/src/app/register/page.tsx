"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { apiFetch } from "../../lib/api";
import type { PublicUser } from "../../lib/auth";
import { notify } from "../../lib/toast";

type AuthResponse = { token: string; user: PublicUser };

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "owner">("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="animate-scale-in rounded-3xl border border-black/5 bg-white/70 p-7 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-2xl shadow-lg shadow-green-500/30">
            🚀
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/55">
            Join as a customer or turf owner.
          </p>
        </div>

        {/* Role picker */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-black/8 p-1.5 dark:border-white/10">
          {(["customer", "owner"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={[
                "rounded-xl py-2.5 text-sm font-bold transition-all duration-300",
                role === r
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md shadow-green-500/25"
                  : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white",
              ].join(" ")}
            >
              {r === "customer" ? "🏃 Customer" : "🏟️ Turf Owner"}
            </button>
          ))}
        </div>

        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await apiFetch<AuthResponse>("/api/auth/register", {
                method: "POST",
                body: { name, email, phone: phone || undefined, password, role },
              });
              if (!res.ok) {
                setError(res.error.message);
                notify.error(res.error.message);
                return;
              }
              setAuth(res.data.token, res.data.user);
              notify.success("Account created! Welcome 🎉");
              if (res.data.user.role === "owner") router.push("/dashboard/owner");
              else                                 router.push("/dashboard/customer");
            } finally {
              setLoading(false);
            }
          }}
        >
          {/* Full name */}
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-black/65 dark:text-white/65">Full name</span>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-black/35 dark:text-white/35">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="h-11 w-full rounded-xl border border-black/10 bg-white/60 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500/40 focus:border-green-600/40 dark:border-white/15 dark:bg-black/20"
              />
            </div>
          </label>

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
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-black/10 bg-white/60 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500/40 focus:border-green-600/40 dark:border-white/15 dark:bg-black/20"
              />
            </div>
          </label>

          {/* Phone */}
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-black/65 dark:text-white/65">Phone <span className="font-normal opacity-60">(optional)</span></span>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-black/35 dark:text-white/35">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 3h4l2 5-3 2c1.2 2.6 3.4 4.8 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C11.3 21 3 12.7 3 5c0-1.1.9-2 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                required
                placeholder="Min. 8 characters"
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

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              ⚠️ {error}
            </div>
          ) : null}

          <button
            id="reg-submit"
            type="submit"
            disabled={loading}
            className="btn-primary mt-1 h-11 w-full rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account…
              </span>
            ) : "Create account 🎉"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-5 text-center text-sm text-black/55 dark:text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[color:var(--primary)] hover:underline">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
