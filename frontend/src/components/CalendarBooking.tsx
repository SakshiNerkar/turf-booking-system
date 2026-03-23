"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Zap, Target, ShieldCheck, ArrowRight, CheckCircle2,
  Sparkles, MousePointer2, Info, TrendingUp, XCircle
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
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 1)); 
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [slots, setSlots] = useState<Slot[]>(initialSlots);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'booked' || slot.status === 'blocked') return;
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async (players: number, coupon?: string) => {
    setBookingLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setBookingLoading(false);
    setSelectedSlot(null);
    setShowSuccess(true);
  };

  return (
    <div className="space-y-16">
      
      {/* 1. CLEAN DATE SELECTOR */}
      <section className="space-y-8 px-4">
         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Temporal Sector</h4>
               <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Select Match Schedule</h3>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-[#1a241c] p-2 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm self-start">
               <button className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
               <span className="text-[10px] font-black uppercase tracking-widest px-4 italic">{selectedDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</span>
               <button className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
            </div>
         </div>

         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {days.map((d, i) => {
               const isActive = d.toDateString() === selectedDate.toDateString();
               return (
                 <button 
                  key={i} 
                  onClick={() => setSelectedDate(d)}
                  className={`flex-shrink-0 w-24 h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${
                    isActive ? 'bg-primary text-white border-primary shadow-[0_30px_60px_rgba(34,197,94,0.3)] scale-110' : 'bg-white dark:bg-[#1a241c] border-gray-100 dark:border-white/5 text-gray-400 hover:border-primary/20 hover:scale-105'
                  }`}
                 >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">{d.toLocaleString('en-IN', { weekday: 'short' })}</span>
                    <span className="text-3xl font-black italic tracking-tighter leading-none">{d.getDate()}</span>
                    {isActive && <motion.div layoutId="dot" className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                 </button>
               );
            })}
         </div>
      </section>

      {/* 2. SIMPLE GRID SLOTS (High Contrast) */}
      <section className="space-y-10 px-4">
         <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                  <div className="w-4 h-4 rounded-lg bg-primary" /> Available
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                  <div className="w-4 h-4 rounded-lg bg-red-500" /> Booked
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                  <div className="w-4 h-4 rounded-lg bg-gray-200 dark:bg-white/10" /> Blocked
               </div>
            </div>
            <div className="flex items-center gap-4 text-primary font-black italic text-[10px] uppercase tracking-widest leading-none bg-primary/5 px-6 py-2.5 rounded-full border border-primary/20">
               <Clock className="w-4 h-4" /> 60m PER SLOT SYNC
            </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
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
                   className={`relative h-28 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all group overflow-hidden ${
                     isSelected ? 'bg-primary border-primary shadow-2xl scale-110 z-10' : 
                     isBooked ? 'bg-red-500/5 border-red-500/10 text-red-500/40 cursor-not-allowed grayscale' : 
                     isBlocked ? 'bg-gray-100 dark:bg-white/5 border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed' :
                     'bg-white dark:bg-[#1a241c] border-gray-100 dark:border-white/5 hover:border-primary/40'
                   }`}
                 >
                    <div className={`text-xs font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-white' : isBooked ? 'text-red-500/40' : 'text-gray-900 dark:text-white group-hover:text-primary italic'}`}>
                       {start}
                    </div>
                    {isSelected ? <Zap className="w-4 h-4 text-white animate-pulse" /> : !isBooked && !isBlocked && <div className="text-[10px] font-black text-primary uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">₹{pricePerSlot}</div>}
                    {isBooked && <XCircle className="w-6 h-6 opacity-10" />}
                 </button>
               );
            })}
         </div>
      </section>

      {/* 3. CORE BENEFITS GRID */}
      <div className="grid md:grid-cols-3 gap-8 px-4">
         {[
           { icon: ShieldCheck, title: "SECURE SLOT", sub: "Session locked for 5m" },
           { icon: Target, title: "VERIFIED", sub: "Regional sector quality" },
           { icon: Sparkles, title: "INSTANT SYNC", sub: "Cloud commit protocol" }
         ].map((v, i) => (
           <div key={i} className="flex items-center gap-6 p-10 bg-white dark:bg-[#1a241c] rounded-[3.5rem] border border-gray-100 dark:border-white/10 group shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500"><v.icon className="w-8 h-8" /></div>
              <div>
                 <div className="text-base font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">{v.title}</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60 leading-none">{v.sub}</div>
              </div>
           </div>
         ))}
      </div>

      {/* SUCCESS OVERLAY (Premium Minimalist) */}
      <AnimatePresence>
         {showSuccess && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/70 backdrop-blur-3xl"
           >
              <motion.div 
                initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[#1a241c] rounded-[5rem] p-20 text-center max-w-2xl border-4 border-primary shadow-2xl relative overflow-hidden"
              >
                 <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-12 shadow-inner border border-primary/20 animate-bounce">
                    <CheckCircle2 className="w-16 h-16" />
                 </div>
                 <h2 className="text-6xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none mb-6">Match Committed</h2>
                 <p className="text-base font-bold text-gray-400 uppercase tracking-widest italic opacity-80 leading-loose mb-12 underline decoration-primary/20 decoration-2 underline-offset-8">
                    PROTOCOL SUCCESSFUL. YOUR REGIONAL ARENA ACCESS HAS BEEN INITIALIZED. BROADCASTING MATCH COORDINATES TO YOUR REGISTRY.
                 </p>
                 <button 
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary px-16 py-6 text-sm mx-auto shadow-2xl"
                 >
                    RETURN TO SECTOR <ArrowRight className="w-6 h-6" />
                 </button>
                 <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none animate-pulse"><Zap className="w-64 h-64" /></div>
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
