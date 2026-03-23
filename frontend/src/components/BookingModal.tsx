"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckCircle2, Clock, MapPin, Star, Zap, ShieldCheck, 
  ArrowRight, Info, CreditCard, Users, Sparkles, Target
} from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (players: number, coupon?: string) => void;
  slot: { start_time: string; end_time: string } | null;
  turfName: string;
  location: string;
  sportType: string;
  pricePerSlot: number;
  loading?: boolean;
};

export function BookingModal({ open, onClose, onConfirm, slot, turfName, location, sportType, pricePerSlot, loading }: Props) {
  const [players, setPlayers] = useState(1);
  const [coupon, setCoupon] = useState("");

  if (!open || !slot) return null;

  const start = new Date(slot.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const date = new Date(slot.start_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
        
        <motion.div 
          initial={{ y: 100, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 100, scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#1a241c] rounded-[4rem] border-4 border-primary/20 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
           {/* Header Protocol */}
           <div className="p-10 bg-primary text-white flex items-center justify-between relative">
              <div className="relative z-10 space-y-2">
                 <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Confirm Match</h3>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Syncing temporal sector availability</div>
              </div>
              <button onClick={onClose} className="p-4 rounded-2xl bg-white/20 text-white hover:bg-white/30 transition-all z-10"><X className="w-5 h-5" /></button>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Zap className="w-40 h-40" /></div>
           </div>

           {/* Content Hub */}
           <div className="p-10 space-y-10">
              
              {/* Arena Identity */}
              <div className="flex gap-8 items-center bg-gray-50 dark:bg-black/20 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                 <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-gray-900 dark:text-white shadow-xl italic font-black text-xl">🏟️</div>
                 <div className="space-y-1">
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{turfName}</h4>
                    <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60"><MapPin className="w-4 h-4 text-primary" /> {location}</div>
                 </div>
              </div>

              {/* Temporal Data */}
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Match Date</div>
                    <div className="text-xl font-extrabold text-gray-900 dark:text-white uppercase italic tracking-tight">{date}</div>
                 </div>
                 <div className="space-y-2 text-right">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Start Time</div>
                    <div className="text-xl font-extrabold text-gray-900 dark:text-white uppercase italic tracking-tight">{start}</div>
                 </div>
              </div>

              {/* Price Breakdown Protocol */}
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
                 <div className="flex justify-between items-center px-2">
                    <span className="text-sm font-black text-gray-400 uppercase italic tracking-widest">Base Energy</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white italic">₹{pricePerSlot}</span>
                 </div>
                 <div className="flex justify-between items-center px-2">
                    <span className="text-sm font-black text-gray-400 uppercase italic tracking-widest">Regional Fee</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white italic">₹{(pricePerSlot * 0.1).toFixed(0)}</span>
                 </div>
                 <div className="p-8 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/20 flex justify-between items-center">
                    <span className="text-xl font-black text-primary uppercase italic tracking-tighter">Total Due</span>
                    <span className="text-4xl font-black text-primary italic tracking-tighter">₹{(pricePerSlot * 1.1).toFixed(0)}</span>
                 </div>
              </div>

              {/* Commit Button */}
              <button 
                onClick={() => onConfirm(players, coupon)}
                disabled={loading}
                className="btn-primary w-full py-8 text-xl shadow-[0_30px_60px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 italic"
              >
                 {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <>COMMIT MATCH <Target className="w-7 h-7" /></>}
              </button>

              <div className="flex items-center justify-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic opacity-40">
                 <ShieldCheck className="w-4 h-4" /> Secure regional payment synced
              </div>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function RefreshCw({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 11-9-9c2.52 0 4.85.83 6.72 2.25L21 8" /><path d="M21 3v5h-5" />
    </svg>
  );
}
