"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, MapPin, Clock, Users, ShieldCheck, Ticket, 
  Trash2, ArrowRight, CheckCircle2, XCircle, Info, Sparkles 
} from "lucide-react";
import { notify } from "../lib/toast";

type Slot = { id: string; start_time: string; end_time: string; };
type Props = {
  open: boolean;
  slot: Slot | null;
  turfName: string;
  location: string;
  sportType: string;
  pricePerSlot: number;
  onConfirm: (players: number, coupon?: string) => void;
  onClose: () => void;
  loading?: boolean;
};

const SPORT_ICONS: Record<string, string> = {
  football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾",
};

export function BookingModal({
  open, slot, turfName, location, sportType, pricePerSlot,
  onConfirm, onClose, loading = false,
}: Props) {
  const [players, setPlayers] = useState(5);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes lock
  const overlayRef = useRef<HTMLDivElement>(null);

  // Time Lock Countdown
  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !slot) return null;

  const fmtTime = (dt: string) => new Date(dt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const icon = SPORT_ICONS[sportType?.toLowerCase()] ?? "🏟️";
  
  // High-Fidelity Price Breakdown
  const peakSurge = pricePerSlot * 0.15; // Simulated surge
  const platformFee = 49;
  const tax = (pricePerSlot + peakSurge) * 0.18;
  const subtotal = pricePerSlot + peakSurge + platformFee + tax;
  const discount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "TURFF20") {
      setAppliedCoupon({ code: "TURFF20", discount: 20 });
      notify.success("Tactical Discount Applied! -20%");
    } else {
      notify.error("Invalid Command Code.");
    }
  };

  const modal = (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 dark:bg-[#0B0F0C]/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-[600px] bg-white dark:bg-[#121A14] rounded-[4rem] border border-gray-100 dark:border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
         {/* 1. SECTOR HEADER */}
         <div className="p-12 pb-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] relative">
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.75rem] bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-lg border border-primary/20">{icon}</div>
                  <div>
                     <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">{turfName}</h3>
                     <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 italic">
                        <MapPin className="w-4 h-4 text-primary" /> {location}
                     </div>
                  </div>
               </div>
               <button onClick={onClose} className="p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 transition-all shadow-sm"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="mt-10 flex items-center gap-6">
               <div className="flex-1 p-6 bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <Clock className="w-5 h-5 text-primary" />
                     <div>
                        <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic tracking-widest">Match Time</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-60 leading-none mt-1">{fmtTime(slot.start_time)} – {fmtTime(slot.end_time)}</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase italic tracking-widest leading-none">
                        <Zap className="w-4 h-4" /> LOCK: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 2. OPERATIONAL CONTENT */}
         <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
            
            {/* Player Config */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] italic leading-none">Combatant Registry</h4>
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">₹{(total/players).toFixed(0)} / PLAYER</span>
               </div>
               <div className="flex items-center gap-4">
                  {[5, 10, 11, 22].map(n => (
                    <button key={n} onClick={() => setPlayers(n)} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${players === n ? 'bg-primary text-white shadow-xl shadow-green-500/20' : 'bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100'}`}>
                       {n > 10 ? n : `${n}v${n}`}
                    </button>
                  ))}
                  <div className="flex-1 flex items-center gap-3 bg-gray-50 dark:bg-white/10 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
                     <button onClick={() => setPlayers(p => Math.max(1, p-1))} className="w-10 h-10 rounded-xl bg-white dark:bg-black flex items-center justify-center font-black">-</button>
                     <span className="flex-1 text-center text-sm font-black">{players}</span>
                     <button onClick={() => setPlayers(p => p+1)} className="w-10 h-10 rounded-xl bg-white dark:bg-black flex items-center justify-center font-black">+</button>
                  </div>
               </div>
            </div>

            {/* Promo Code Hub */}
            <div className="space-y-6">
               <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] italic leading-none">Tactical Discount</h4>
               <div className="relative group">
                  <Ticket className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    value={coupon} onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter command code... (Try TURFF20)"
                    className="w-full pl-16 pr-32 py-5 bg-gray-50 dark:bg-white/2 border border-transparent focus:border-primary/20 rounded-3xl text-[11px] font-black uppercase tracking-widest outline-none transition-all placeholder:italic"
                  />
                  <button onClick={handleApplyCoupon} className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-all">VALIDATE</button>
               </div>
               {appliedCoupon && (
                 <div className="mt-4 flex items-center justify-between p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <div className="flex items-center gap-3 text-green-500 text-[10px] font-black uppercase italic tracking-widest">
                       <Sparkles className="w-4 h-4" /> CODE: {appliedCoupon.code} ACTIVE
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-green-500/60 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                 </div>
               )}
            </div>

            {/* Detailed Price Summary */}
            <div className="p-10 bg-gray-900 dark:bg-black rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 italic">
                     <span>Base Sector Rate</span>
                     <span>₹{pricePerSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-amber-500 italic">
                     <span className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Peak Hour Surge (+15%)</span>
                     <span>₹{peakSurge.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 italic">
                     <span>Platform Maintenance</span>
                     <span>₹{platformFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                     <span>GST (18%)</span>
                     <span>₹{tax.toFixed(0)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary italic">
                       <span>Tactical Discount</span>
                       <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="h-px bg-white/10 my-6" />
                  <div className="flex items-center justify-between">
                     <span className="text-lg font-black italic tracking-tighter uppercase leading-none">TOTAL LOG</span>
                     <span className="text-4xl font-black italic tracking-tighter text-primary leading-none">₹{total.toFixed(0)}</span>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 duration-[4s]"><ShieldCheck className="w-48 h-48" /></div>
            </div>
         </div>

         {/* 3. FINAL EXECUTION */}
         <div className="p-10 bg-white dark:bg-[#121A14] border-t border-gray-100 dark:border-white/5 flex gap-6">
            <button onClick={onClose} className="px-10 py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all italic underline underline-offset-4">ABORT SESSION</button>
            <button 
              onClick={() => onConfirm(players, appliedCoupon?.code)}
              disabled={loading}
              className="flex-1 bg-primary text-white py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] italic shadow-[0_40px_80px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6"
            >
               {loading ? "INITIALIZING SECURE LINK..." : <>EXECUTE BOOKING <ArrowRight className="w-6 h-6" /></>}
            </button>
         </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}

const TrendingUp = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
