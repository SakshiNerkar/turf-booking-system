"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, Zap, Target, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, XCircle, Info, Activity
} from "lucide-react";
import { BookingModal } from "./BookingModal";

type Slot = { id: string; start_time: string; end_time: string; status: "available" | "booked" | "blocked"; };

export function CalendarBooking({ 
  slots, turfId, turfName, turfOwnerId, pricePerSlot, location, selectedDate, loading
}: { 
  slots: Slot[], turfId: string, turfName: string, turfOwnerId: string, pricePerSlot: number, location: string, selectedDate: string, loading: boolean
}) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
    }
  };

  // Reset selected slot when date changes
  useState(() => {
    setSelectedSlot(null);
  });

  const availableCount = slots.filter(s => s.status === 'available').length;
  const isHighDemand = availableCount < 5 && availableCount > 0;

  const formatTime = (time: string) => {
    if (!time) return "---";
    if (time.includes(':')) {
       const [h, m] = time.split(':').map(Number);
       const ampm = h! >= 12 ? 'PM' : 'AM';
       const hh = h! % 12 || 12;
       return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
    }
    return time;
  };

  return (
    <div className={`card-compact p-8 space-y-10 bg-white dark:bg-[#121A14] relative transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* 1. SECTOR HEADER & URGENCY CRITICAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-none uppercase italic italic-black">Arena Slots</h3>
            <div className="flex items-center flex-wrap gap-2.5">
               <span className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-lg border border-primary/20 flex items-center gap-1.5 uppercase tracking-widest"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
               {isHighDemand && <span className="px-2 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-black rounded-lg border border-rose-500/20 flex items-center gap-1.5 uppercase tracking-widest animate-pulse"><Zap className="w-3.5 h-3.5 fill-rose-500/40" /> HIGH DEMAND</span>}
               <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded-lg border border-blue-500/20 flex items-center gap-1.5 uppercase tracking-widest"><Activity className="w-3.5 h-3.5" /> 84% OCCUPANCY</span>
            </div>
         </div>
         <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-white/5 p-3 rounded-xl border border-border/50 shadow-inner">
            {[
               { color: 'bg-primary', label: 'Open' },
               { color: 'bg-red-500', label: 'Booked' }
            ].map(l => (
               <div key={l.label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${l.color} shadow-sm`} />
                  <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider pr-2">{l.label}</span>
               </div>
            ))}
         </div>
      </div>

      {/* 2. DYNAMIC SLOT REGISTRY */}
      <section className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
             {slots.map((s, idx) => {
                const isSelected = selectedSlot?.id === s.id || (selectedSlot?.start_time === s.start_time);
                const isBooked = s.status === 'booked';
                const isBlocked = s.status === 'blocked';
                const displayText = formatTime(s.start_time);
                
                // Urgency logic: Label 1st few available slots as "Hot"
                const firstAvailableIdx = slots.findIndex(slot => slot.status === 'available');
                const showUrgency = !isBooked && !isBlocked && idx === firstAvailableIdx;

                return (
                  <button 
                    key={idx}
                    onClick={() => handleSlotClick(s)}
                    disabled={isBooked || isBlocked}
                    className={`relative h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all group overflow-hidden ${
                      isSelected ? 'bg-primary border-primary text-white z-10 scale-[1.05] shadow-xl shadow-primary/20' : 
                      isBooked ? 'bg-gray-50 dark:bg-card border-border/20 text-gray-400 grayscale cursor-not-allowed opacity-50' : 
                      isBlocked ? 'bg-gray-100 dark:bg-white/5 border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed' :
                      'bg-white dark:bg-card-hover border-border hover:border-primary/40 hover:-translate-y-1 shadow-sm'
                    }`}
                  >
                     {showUrgency && <div className="absolute top-0 right-0 px-2 py-0.5 bg-rose-500 text-white text-[7px] font-black uppercase italic tracking-tighter">HOT</div>}
                     <div className={`text-[11px] font-black uppercase tracking-tight italic ${isSelected ? 'text-white' : isBooked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {displayText}
                     </div>
                     {!isBooked && !isBlocked && <div className={`text-[9px] font-black uppercase tracking-widest italic leading-none ${isSelected ? 'text-white opacity-80' : 'text-primary'}`}>₹{pricePerSlot}</div>}
                     {isBooked && <XCircle className="w-4 h-4 opacity-30" />}
                  </button>
                );
             })}
          </div>
          {slots.length === 0 && (
             <div className="text-center py-10 text-gray-400 uppercase font-black text-xs tracking-widest bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-border/50">No Slots Available for this Date</div>
          )}
      </section>

      {/* 3. PLATFORM PROTECTIONS (Trust Strip) */}
      <div className="pt-8 border-t border-border/60">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 dark:bg-white/5 p-6 rounded-2xl border border-border/50">
            {[
              { icon: ShieldCheck, title: "PLATFORM LOCK", sub: "Temporary session hold" },
              { icon: Clock, title: "INSTANT SYNC", sub: "Ops-level availability" },
              { icon: Target, title: "VERIFIED HUB", sub: "Audited regional assets" }
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-4 group">
                 <div className="w-12 h-12 rounded-xl bg-white dark:bg-card text-primary flex items-center justify-center border border-border shadow-sm group-hover:scale-110 transition-transform"><v.icon className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[10px] font-black uppercase text-gray-900 dark:text-white italic leading-none mb-1">{v.title}</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{v.sub}</div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="pt-2">
         <button 
           disabled={!selectedSlot}
           onClick={() => setShowModal(true)}
           className={`w-full py-4 text-xs font-black uppercase tracking-widest italic rounded-lg transition-all flex items-center justify-center gap-3 ${
             selectedSlot 
               ? 'bg-primary text-white shadow-xl shadow-green-500/20 hover:bg-primary-hover hover:scale-[1.02] active:scale-95' 
               : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
           }`}
         >
            {selectedSlot ? `RESERVE ${formatTime(selectedSlot.start_time)} SESSION` : 'SELECT A SPECTRAL SLOT'}
            <ArrowRight className="w-4 h-4" />
         </button>
      </div>

      <AnimatePresence>
        {showModal && selectedSlot && (
          <BookingModal
            slot={selectedSlot}
            turfId={turfId}
            turfName={turfName}
            turfOwnerId={turfOwnerId}
            onClose={() => setShowModal(false)}
            location={location}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
