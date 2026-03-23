"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Zap, Target, ShieldCheck, ArrowRight, CheckCircle2,
  Sparkles, MousePointer2, Info, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingModal } from "./BookingModal";
import { notify } from "../lib/toast";

type Slot = { id: string; start_time: string; end_time: string; status: "available" | "booked" | "blocked" | "locking"; };
type Props = {
  turfId: string;
  turfName: string;
  turfOwnerId: string;
  pricePerSlot: number;
  slots: Slot[];
  location: string;
};

export function CalendarBooking({ turfId, turfName, turfOwnerId, pricePerSlot, slots: initialSlots, location }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [slots, setSlots] = useState<Slot[]>(initialSlots);

  // Generate tactical date range (Next 7 days)
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'booked' || slot.status === 'blocked') return;
    
    // Simulated Real-Time Collision Check
    const isLocked = Math.random() > 0.95; // 5% chance of simulated collision
    if (isLocked) {
       return notify.error("PROTOCOL COLLISION: This slot is being initialized by another user.");
    }

    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async (players: number, coupon?: string) => {
    setBookingLoading(true);
    // Simulate API match protocol commitment
    await new Promise(r => setTimeout(r, 2000));
    setBookingLoading(false);
    setSelectedSlot(null);
    setShowSuccess(true);
    notify.success("Match Protocol Committed! 🚀");
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Tactical Date Selector */}
      <section className="space-y-8">
         <div className="flex items-end justify-between px-4">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">Temporal Sector Selection</h4>
               <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Schedule Match</h3>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
               <button className="p-3 rounded-xl hover:bg-white dark:hover:bg-black transition-all"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
               <span className="text-[10px] font-black uppercase tracking-widest px-4 italic">{selectedDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</span>
               <button className="p-3 rounded-xl hover:bg-white dark:hover:bg-black transition-all"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
            </div>
         </div>

         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-4">
            {days.map((d, i) => {
               const isActive = d.toDateString() === selectedDate.toDateString();
               return (
                 <button 
                  key={i} 
                  onClick={() => setSelectedDate(d)}
                  className={`flex-shrink-0 w-24 h-32 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border ${
                    isActive ? 'bg-primary text-white border-primary shadow-[0_25px_50px_rgba(34,197,94,0.3)] scale-110' : 'bg-white dark:bg-[#121A14] border-gray-100 dark:border-white/5 text-gray-400 hover:border-primary/20 hover:scale-105'
                  }`}
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{d.toLocaleString('en-IN', { weekday: 'short' })}</span>
                    <span className="text-3xl font-black italic tracking-tighter leading-none">{d.getDate()}</span>
                    {isActive && <motion.div layoutId="dot" className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                 </button>
               );
            })}
         </div>
      </section>

      {/* 2. Grid Slots: The Arena Pulse */}
      <section className="space-y-8">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic saturate-0 opacity-60">
                  <div className="w-3 h-3 rounded-full bg-primary" /> Available
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic saturate-0 opacity-60">
                  <div className="w-3 h-3 rounded-full bg-red-500" /> Booked
               </div>
            </div>
            <div className="flex items-center gap-3 text-amber-500 font-black italic text-[10px] uppercase tracking-widest leading-none bg-amber-500/10 px-6 py-2 rounded-full border border-amber-500/20">
               <TrendingUp className="w-4 h-4" /> SURGE PRICING APPLIED
            </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 px-2">
            {slots.map(s => {
               const isSelected = selectedSlot?.id === s.id;
               const isBooked = s.status === 'booked';
               const isBlocked = s.status === 'blocked';
               const start = new Date(s.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

               return (
                 <motion.button 
                   key={s.id}
                   whileHover={!isBooked && !isBlocked ? { scale: 1.05 } : {}}
                   whileTap={!isBooked && !isBlocked ? { scale: 0.95 } : {}}
                   onClick={() => handleSlotClick(s)}
                   className={`relative h-24 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all group overflow-hidden ${
                     isSelected ? 'bg-primary border-primary shadow-2xl' : 
                     isBooked ? 'bg-red-500/5 border-red-500/10 text-red-500/40 cursor-not-allowed opacity-50 gray-scale' : 
                     isBlocked ? 'bg-gray-100 dark:bg-white/5 border-transparent text-gray-400 cursor-not-allowed' :
                     'bg-white dark:bg-[#121A14] border-gray-100 dark:border-white/5 hover:border-primary/40'
                   }`}
                 >
                    <div className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-white' : isBooked ? 'text-red-500/60' : 'text-gray-900 dark:text-white group-hover:text-primary italic'}`}>
                       {start}
                    </div>
                    {isSelected && <Zap className="w-4 h-4 text-white animate-pulse" />}
                    {!isSelected && !isBooked && !isBlocked && <div className="text-[8px] font-black text-primary uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">₹{pricePerSlot}</div>}
                    
                    {isBooked && <div className="absolute inset-0 flex items-center justify-center bg-red-500/5 backdrop-blur-[2px]"><XCircle className="w-6 h-6 opacity-20" /></div>}
                 </motion.button>
               );
            })}
         </div>
      </section>

      {/* 3. Operational Value Propositions */}
      <div className="grid md:grid-cols-3 gap-8 px-2">
         {[
           { icon: ShieldCheck, title: "SECURE LOCK", sub: "5m session persistence" },
           { icon: Target, title: "PRECISION PITCH", sub: "Verified sector quality" },
           { icon: Sparkles, title: "INSTANT SYNC", sub: "Cloud booking execution" }
         ].map((v, i) => (
           <div key={i} className="flex items-center gap-6 p-8 bg-gray-50 dark:bg-white/2 rounded-[2.5rem] border border-gray-100 dark:border-white/5 group shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-gray-400 group-hover:text-primary transition-all shadow-xl group-hover:rotate-12"><v.icon className="w-6 h-6" /></div>
              <div>
                 <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{v.title}</div>
                 <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60 leading-none">{v.sub}</div>
              </div>
           </div>
         ))}
      </div>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
         {showSuccess && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/80 backdrop-blur-3xl"
           >
              <motion.div 
                initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[#121A14] rounded-[5rem] p-24 text-center max-w-2xl border-4 border-primary shadow-[0_50px_100px_rgba(34,197,94,0.3)] relative overflow-hidden"
              >
                 <div className="w-40 h-40 rounded-[3.5rem] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-16 shadow-inner border border-primary/20 animate-bounce">
                    <CheckCircle2 className="w-20 h-20" />
                 </div>
                 <h2 className="text-6xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none mb-8">Match Locked</h2>
                 <p className="text-lg font-bold text-gray-400 uppercase tracking-widest italic opacity-80 leading-loose mb-16 underline decoration-primary/20 decoration-4 underline-offset-8">
                    PROTOCOL COMMITTED. YOUR ARENA ACCESS PERMIT HAS BEEN INITIALIZED. BROADCASTING MATCH COORDINATES TO YOUR REGISTRY.
                 </p>
                 <button 
                  onClick={() => setShowSuccess(false)}
                  className="px-20 py-8 bg-primary text-white text-[11px] font-black rounded-[2.5rem] uppercase tracking-[0.4em] shadow-2xl hover:scale-110 transition-all italic flex items-center gap-6 mx-auto"
                 >
                    RETURN TO DOMAIN <ArrowRight className="w-6 h-6" />
                 </button>
                 <div className="absolute top-0 right-0 p-16 opacity-[0.03] animate-pulse"><Zap className="w-64 h-64" /></div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      <BookingModal 
        open={!!selectedSlot}
        slot={selectedSlot}
        turfName={turfName}
        location={location}
        sportType={"football"}
        pricePerSlot={pricePerSlot}
        onConfirm={handleConfirmBooking}
        onClose={() => setSelectedSlot(null)}
        loading={bookingLoading}
      />
    </div>
  );
}

const XCircle = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
