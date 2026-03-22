"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
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

  async function handleLogin(e: React.FormEvent) {
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
      notify.success(`Success! Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      
      const dashboard = res.data.user.role === "admin" ? "admin" : 
                       res.data.user.role === "owner" ? "owner" : "customer";
      router.push(`/dashboard/${dashboard}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-green-400" />
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Access Account</h1>
          <p className="mt-2 text-gray-500 font-medium">Continue your sports journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="peer w-full px-5 py-4 pt-6 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:border-primary transition-all font-semibold"
              />
              <label 
                htmlFor="email"
                className="absolute left-5 top-4 text-gray-400 text-sm font-bold transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
              >
                Email Address
              </label>
              <Mail className="absolute right-5 top-5 w-5 h-5 text-gray-300 pointer-events-none" />
            </div>

            {/* Password */}
            <div className="relative">
               <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                className="peer w-full px-5 py-4 pt-6 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:border-primary transition-all font-semibold"
              />
              <label 
                htmlFor="password"
                className="absolute left-5 top-4 text-gray-400 text-sm font-bold transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
              >
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-5 top-5 text-gray-300 hover:text-gray-500 transition-colors"
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/25 flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:bg-primary-hover"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
           <p className="text-center text-gray-500 font-medium">
            New to Turff?{" "}
            <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
              Join for Free
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
           <DemoBadge role="Customer" onClick={() => { setEmail("customer@turff.local"); setPassword("Customer@123"); }} />
           <DemoBadge role="Owner" onClick={() => { setEmail("owner@turff.local"); setPassword("Owner@123"); }} />
           <DemoBadge role="Admin" onClick={() => { setEmail("admin@turff.local"); setPassword("Admin@123"); }} />
        </div>
      </motion.div>
    </div>
  );
}

function DemoBadge({ role, onClick }: { role: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-widest border border-transparent hover:border-primary/20"
    >
      Demo {role}
    </button>
  );
}
