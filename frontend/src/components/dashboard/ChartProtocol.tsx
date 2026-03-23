"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Activity, Zap } from "lucide-react";

type DataPoint = { label: string; value: number };

export function ChartProtocol({ data, title, subtitle }: { data: DataPoint[], title: string, subtitle: string }) {
  const max = Math.max(...data.map(d => d.value)) || 1;

  return (
    <div className="bg-white dark:bg-[#121A14] rounded-[4rem] p-12 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
       <div className="flex items-end justify-between mb-16 relative z-10">
          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">{subtitle}</h4>
             <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">{title}</h3>
          </div>
          <div className="flex items-center gap-4 text-green-500 font-black italic text-sm">
             <TrendingUp className="w-5 h-5" /> +24.8% VELOCITY
          </div>
       </div>

       <div className="relative h-64 w-full flex items-end gap-3 lg:gap-6 z-10">
          {data.map((d, i) => {
             const height = (d.value / max) * 100;
             return (
               <div key={i} className="flex-1 flex flex-col justify-end gap-4 h-full group/bar">
                  <div className="relative flex-1 flex flex-col justify-end">
                     <motion.div 
                       initial={{ height: 0 }} 
                       animate={{ height: `${height}%` }} 
                       transition={{ delay: i * 0.05, duration: 1.5, ease: "circOut" }}
                       className="w-full bg-gradient-to-t from-primary/5 via-primary/40 to-primary rounded-t-2xl relative shadow-[0_0_40px_rgba(34,197,94,0.1)] group-hover/bar:shadow-[0_0_60px_rgba(34,197,94,0.3)] transition-all"
                     >
                        {/* Value Tooltip */}
                        <div className="absolute -top-12 left-1/2 -track-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[8px] font-black rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-2xl -translate-x-1/2">
                           ₹{d.value.toLocaleString()}
                        </div>
                     </motion.div>
                  </div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center italic opacity-60 group-hover/bar:opacity-100 transition-opacity">
                     {d.label}
                  </div>
               </div>
             );
          })}
       </div>

       {/* Grid Lines */}
       <div className="absolute inset-x-12 top-40 bottom-24 flex flex-col justify-between pointer-events-none opacity-[0.03]">
          {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-gray-900 dark:bg-white" />)}
       </div>

       <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[4s]"><Activity className="w-80 h-80" /></div>
    </div>
  );
}

export function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-8 w-24">
       {data.map((v, i) => (
         <motion.div 
           key={i} 
           initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
           className="flex-1 bg-primary/20 rounded-full" 
         />
       ))}
    </div>
  );
}
