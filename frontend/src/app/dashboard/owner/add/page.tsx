"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { notify } from "@/lib/toast";
import { Plus, ArrowLeft, CheckCircle2, RefreshCw, Sparkles, MapPin, MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SPORTS = ["football", "cricket", "badminton", "tennis"];
const BLANK = { name: "", location: "", sport_type: "football", price_per_slot: 1200, description: "" };

export default function AddTurfPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  async function handleCreate() {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch("/api/turfs", { method: "POST", token, body: form });
    setLoading(false);
    if (!res.ok) { notify.error(res.error.message); return; }
    notify.success("Turf created successfully! 🏟️");
    router.push("/dashboard/owner/turfs");
  }

  const inputCls = "w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1A241D] rounded-2xl text-sm font-black outline-none transition-all shadow-sm";

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-colors mb-4 uppercase tracking-widest">
             <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">Expand your <span className="text-primary italic">Empire</span></h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Register a new sports venue into the Turff network.</p>
        </div>
        <div className="w-16 h-16 rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-4xl shadow-sm border border-transparent hover:border-primary/10 transition-all">🏗️</div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Progress sidebar */}
        <div className="lg:col-span-1 space-y-8 mt-12">
           {[
             { num: 1, label: "Identity", icon: Sparkles },
             { num: 2, label: "Logistics", icon: MapPin },
             { num: 3, label: "Pricing", icon: MousePointer2 }
           ].map(s => (
             <div key={s.num} className={`flex items-center gap-4 transition-all ${step >= s.num ? 'opacity-100 scale-105' : 'opacity-30'}`}>
                <div className={`w-10 h-10 rounded-[1.25rem] border-2 flex items-center justify-center font-black text-xs ${step === s.num ? 'bg-primary border-primary text-white shadow-lg' : 'border-gray-300 dark:border-white/10 dark:text-white'}`}>
                   {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <div className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors group-hover:text-primary">{s.label}</div>
             </div>
           ))}
        </div>

        {/* Form area */}
        <div className="lg:col-span-4 bg-white dark:bg-[#121A14] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8 sm:p-12 relative overflow-hidden">
           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                   <div>
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Venue Name</label>
                     <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Skyline Sports Arena" />
                   </div>
                   <div>
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Sports Type</label>
                     <div className="grid grid-cols-2 gap-3">
                        {SPORTS.map(s => (
                          <button key={s} onClick={() => setForm(p => ({ ...p, sport_type: s }))} className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${form.sport_type === s ? 'bg-primary text-white shadow-xl shadow-green-500/20 scale-[1.02]' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border border-transparent hover:border-gray-100 dark:hover:border-white/10'}`}>
                             {s}
                          </button>
                        ))}
                     </div>
                   </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                   <div>
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Location Address</label>
                     <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className={inputCls} placeholder="e.g. Pune, Maharashtra" />
                   </div>
                   <div>
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Venue Description</label>
                     <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls + " h-32 pt-5 resize-none"} placeholder="e.g. High-performance turf with specialized lighting and amenities..." />
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                   <div>
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Hourly Rate (₹)</label>
                     <div className="text-6xl font-black text-[color:var(--primary)] flex items-center mb-8">
                        ₹
                        <input type="number" value={form.price_per_slot} onChange={e => setForm(p => ({ ...p, price_per_slot: Number(e.target.value) }))} className="bg-transparent border-0 outline-none w-full ml-4 placeholder:opacity-10" placeholder="1200" />
                     </div>
                     <p className="text-gray-500 text-sm font-medium italic underline decoration-primary/30 decoration-2">Premium venues typically charge between ₹800 and ₹1800 per booking unit.</p>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="mt-16 flex items-center justify-between">
              <button disabled={step === 1} onClick={() => setStep(step - 1)} className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-all uppercase tracking-widest">Back</button>
              {step < 3 ? (
                <button disabled={step === 1 && !form.name} onClick={() => setStep(step + 1)} className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-100 transition-all text-sm uppercase tracking-widest">Continue</button>
              ) : (
                <button onClick={handleCreate} disabled={loading} className="px-12 py-5 bg-primary text-white font-black rounded-[2rem] shadow-2xl shadow-green-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3 text-lg">
                   {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>PUBLISH VENUE <Sparkles className="w-5 h-5" /></>}
                </button>
              )}
           </div>

           <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none scale-150"><Plus className="w-96 h-96" /></div>
        </div>
      </div>
    </div>
  );
}
