"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Rocket, RefreshCw } from "lucide-react";
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

  async function handleRegister(e: React.FormEvent) {
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
      notify.success("Account created! Welcome to Turff 🎉");
      router.push(`/dashboard/${res.data.user.role}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-8 sm:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-green-400" />
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <Rocket className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create Account</h1>
          <p className="mt-2 text-gray-500 font-medium text-lg">Join the ultimate sports community</p>
        </div>

        {/* Role Toggle */}
        <div className="relative flex p-1.5 bg-gray-50 dark:bg-white/5 rounded-2xl mb-10 border border-gray-100 dark:border-white/5">
          <motion.div 
            layout
            className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white dark:bg-white/10 rounded-xl shadow-sm z-0"
            animate={{ 
              x: role === "customer" ? 0 : "100%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setRole("customer")}
            className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${role === "customer" ? "text-primary" : "text-gray-400"}`}
          >
            I&apos;m a Player
          </button>
          <button
            onClick={() => setRole("owner")}
            className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors ${role === "owner" ? "text-primary" : "text-gray-400"}`}
          >
            I Own a Turf
          </button>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput 
            id="name" label="Full Name" icon={<User className="w-5 h-5" />} 
            value={name} onChange={setName} 
          />
          <FloatingInput 
            id="email" label="Email" type="email" icon={<Mail className="w-5 h-5" />} 
            value={email} onChange={setEmail} 
          />
          <FloatingInput 
            id="phone" label="Phone (Optional)" type="tel" icon={<Phone className="w-5 h-5" />} 
            value={phone} onChange={setPhone} 
          />
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
            >
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 text-sm font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/25 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
           <p className="text-gray-500 font-medium">
            Already registered?{" "}
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
              Access Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function FloatingInput({ id, label, type = "text", value, onChange, icon }: { 
  id: string; label: string; type?: string; value: string; onChange: (v: string) => void; icon: React.ReactNode 
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required={id !== "phone"}
        className="peer w-full px-5 py-4 pt-6 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:border-primary transition-all font-semibold"
      />
      <label 
        htmlFor={id}
        className="absolute left-5 top-4 text-gray-400 text-sm font-bold transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
      >
        {label}
      </label>
      <div className="absolute right-5 top-5 text-gray-300 pointer-events-none">
        {icon}
      </div>
    </div>
  );
}
