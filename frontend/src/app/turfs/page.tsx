"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, RefreshCw, Star, MapPin, ArrowRight, Filter, 
  Settings, Target, Zap, BadgeCheck, Sparkles, Map as MapIcon
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import { SkeletonCard, EmptyState } from "../../components/Skeletons";
import { FilterProtocol } from "@/components/discovery/FilterProtocol";
import { MapView } from "@/components/discovery/MapView";

type Turf = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  description: string | null;
  rating?: number;
};

const SPORT_META: Record<string, { icon: string; accent: string; label: string }> = {
  football:  { icon: "⚽", accent: "text-green-500", label: "PRO FIELD" },
  cricket:   { icon: "🏏", accent: "text-amber-500", label: "ELITE PITCH" },
  badminton: { icon: "🏸", accent: "text-blue-500", label: "SMASH COURT" },
  tennis:    { icon: "🎾", accent: "text-orange-500", label: "GRAND SLAM" },
};

const AMENITIES = [
  { icon: Zap, label: "Lighting" },
  { icon: Target, label: "Pro Gear" },
  { icon: BadgeCheck, label: "Secure" }
];

export default function TurfsPage() {
  const [turfs, setTurfs]     = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const fetchTurfs = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch<Turf[]>("/api/turfs");
    setLoading(false);
    if (res.ok) setTurfs(res.data);
  }, []);

  useEffect(() => { fetchTurfs(); }, [fetchTurfs]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F0C] transition-colors duration-500 relative">
      
      {/* MAP OVERLAY HUB */}
      <AnimatePresence>
        {showMap && turfs && <MapView turfs={turfs} onClose={() => setShowMap(false)} />}
      </AnimatePresence>
      
      {/* Advanced Discovery Protocol (Integrated Filter Hub) */}
      <FilterProtocol totalResults={turfs?.length || 0} />

      <main className="max-w-[1800px] mx-auto pb-40">
         
         {/* Sector Header: Visual Hierarchy Upgrade */}
         <header className="px-8 lg:px-12 py-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-gray-100 dark:border-white/5">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <span className="px-6 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-xl uppercase tracking-[0.4em] italic border border-primary/20">Discovery Stream Active</span>
                  <div className="flex gap-1">
                     {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40" />)}
                  </div>
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none uppercase">Combat <br /> Sectors</h2>
               <div className="flex items-center gap-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">
                  ARENA LOGS INITIALIZED · {turfs?.length || 0} SECTORS DETECTED
               </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-right hidden sm:block">
               <button onClick={() => setShowMap(true)} className="flex items-center gap-4 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all italic mb-4">
                 <MapIcon className="w-4 h-4" /> SECTOR MAP
               </button>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose max-w-xs opacity-60 italic">Optimizing arena selection logs based on your tactical filter selections.</p>
               <button onClick={fetchTurfs} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all shadow-sm"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
            </div>
         </header>

         {/* Sector Grid Hub */}
         <div className="px-8 lg:px-12 mt-20">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                 {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (!turfs || turfs.length === 0) ? (
              <EmptyState 
                title="Sector Null Data"
                sub="No matching combat sectors found in the current tactical coordinates. Try adjusting your sport filters or distance protocols."
                icon={Search}
                actionLabel="FORMAT ALL PROTOCOLS"
                actionLink="/turfs"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
                 {turfs.map(t => {
                   const meta = SPORT_META[t.sport_type?.toLowerCase()] ?? { icon: "🏟️", accent: "text-gray-500", label: "GENERIC" };
                   return (
                     <div key={t.id} className="group bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.05)] hover:-translate-y-4 hover:shadow-[0_80px_160px_rgba(0,0,0,0.1)] transition-all flex flex-col h-full relative">
                        
                        {/* Visual Identity Layer */}
                        <div className="h-80 relative overflow-hidden">
                           <img src={`https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop`} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-125 transition-all duration-[3s]" />
                           <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                           
                           {/* Rating Protocol Badge */}
                           <div className="absolute top-10 right-10 h-16 w-16 rounded-[2.5rem] bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center font-black text-primary shadow-2xl border border-white/20 group-hover:rotate-[360deg] transition-all duration-1000">
                              <Star className="w-4 h-4 mb-0.5 fill-current" />
                              <span className="text-sm">4.9</span>
                           </div>
                           
                           <div className="absolute bottom-10 left-10 flex flex-wrap gap-3">
                              <span className={`px-6 py-2.5 bg-white dark:bg-black/80 text-[9px] font-black rounded-xl uppercase tracking-widest italic shadow-2xl flex items-center gap-3 border border-white/5`}>
                                 <span className="text-xl leading-none">{meta.icon}</span> 
                                 <span className={meta.accent}>{meta.label}</span>
                              </span>
                              <span className="px-6 py-2.5 bg-primary text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-2xl border border-white/10 flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> VERIFIED</span>
                           </div>
                        </div>

                        {/* Tactical Content Depth */}
                        <div className="p-12 flex-1 flex flex-col justify-between space-y-12">
                           <div className="space-y-6 text-left">
                              <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors italic line-clamp-2">{t.name}</h4>
                              <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none bg-gray-50 dark:bg-white/2 p-4 rounded-2xl w-fit">
                                 <MapPin className="w-4 h-4 text-primary" /> {t.location}
                              </div>
                           </div>

                           {/* Intel Icons Integration */}
                           <div className="flex gap-8 py-8 border-y border-gray-100 dark:border-white/5">
                              {AMENITIES.map((a, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 group/icon">
                                   <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover/icon:bg-primary/10 group-hover/icon:text-primary transition-all border border-transparent group-hover/icon:border-primary/20">
                                      <a.icon className="w-5 h-5" />
                                   </div>
                                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">{a.label}</span>
                                </div>
                              ))}
                           </div>

                           {/* Financial & Slot Execution */}
                           <div className="flex items-center justify-between gap-6">
                              <div className="text-left">
                                 <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">₹{Number(t.price_per_slot).toLocaleString()}</div>
                                 <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 italic opacity-60">Per 60m session</div>
                              </div>
                              <Link href={`/turfs/${t.id}`} className="px-12 py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-[2rem] uppercase tracking-[0.3em] shadow-2xl hover:scale-110 active:scale-95 transition-all italic flex items-center gap-4">
                                 RESERVE <ArrowRight className="w-5 h-5" />
                              </Link>
                           </div>
                        </div>
                        
                        {/* Layout Grid Overlay */}
                        <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-all group-hover:scale-110 pointer-events-none shadow-2xl"><Sparkles className="w-64 h-64 text-primary" /></div>
                     </div>
                   );
                 })}
              </div>
            )}
         </div>
      </main>

    </div>
  );
}
