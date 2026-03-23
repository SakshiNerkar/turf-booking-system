"use client";

import { useState, useEffect } from "react";
import { Clock, Zap, Target, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

type Booking = {
  id: string;
  turf_name: string;
  location: string;
  start_time: string;
};

export function CountdownModule({ booking }: { booking: Booking }) {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(booking.start_time).getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [booking.start_time]);

  if (!timeLeft) return null;

  return (
    <div className="bg-primary rounded-[4rem] p-12 text-white relative overflow-hidden group shadow-[0_60px_120px_rgba(34,197,94,0.2)]">
       <div className="relative z-10 space-y-10">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <span className="px-5 py-2 bg-white/20 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.4em] italic border border-white/20">Active Protocol Target</span>
                <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
             </div>
             <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{booking.turf_name}</h3>
             <div className="flex items-center gap-4 text-[10px] font-black text-white/60 uppercase tracking-[0.4em] italic">
                <MapPin className="w-5 h-5" /> {booking.location}
             </div>
          </div>

          <div className="flex items-center gap-12">
             {[
               { val: timeLeft.h, label: 'Hours' },
               { val: timeLeft.m, label: 'Minutes' },
               { val: timeLeft.s, label: 'Seconds' }
             ].map((t, i) => (
               <div key={i} className="space-y-4">
                  <div className="text-6xl font-black italic tracking-tighter leading-none">{t.val.toString().padStart(2, '0')}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.label}</div>
               </div>
             ))}
          </div>

          <div className="flex items-center gap-8 pt-6 border-t border-white/10">
             <button className="px-10 py-5 bg-white text-primary rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all italic flex items-center gap-4">INITIALIZE COMM-LINK <ArrowRight className="w-5 h-5" /></button>
             <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] italic">READY FOR SECTOR DEPTH</div>
          </div>
       </div>
       
       <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-[5s]"><Clock className="w-96 h-96" /></div>
       <div className="absolute bottom-0 right-0 p-8 opacity-20"><Zap className="w-24 h-24" /></div>
    </div>
  );
}
