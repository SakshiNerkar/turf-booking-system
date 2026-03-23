"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, RefreshCw, Filter, ArrowRight, Calendar, 
  ChevronRight, SlidersHorizontal, Star, Clock, Zap, 
  Droplets, Car, ShieldCheck, Wifi, Coffee, Trophy,
  Activity, Target, Sparkles, Navigation
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import { SkeletonCard } from "../../components/Skeletons";

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
  football:  { icon: "⚽", accent: "text-green-500", label: "FOOTBALL" },
  cricket:   { icon: "🏏", accent: "text-amber-500",  label: "CRICKET" },
  badminton: { icon: "🏸", accent: "text-blue-500",   label: "BADMINTON" },
  tennis:    { icon: "🎾", accent: "text-orange-500", label: "TENNIS" },
  pickleball: { icon: "🎾", accent: "text-purple-500", label: "PICKLEBALL" },
};

const AMENITIES = [
  { icon: Droplets, label: "Water" },
  { icon: Car, label: "Parking" },
  { icon: Wifi, label: "WiFi" },
  { icon: ShieldCheck, label: "Secure" },
];

export default function TurfsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [turfs, setTurfs]     = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(searchParams.get("sport_type") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const fetchTurfs = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams(searchParams.toString());
    const res = await apiFetch<Turf[]>(`/api/turfs?${qs.toString()}`);
    setLoading(false);
    if (res.ok) setTurfs(res.data);
  }, [searchParams]);

  useEffect(() => { fetchTurfs(); }, [fetchTurfs]);

  const toggleSport = (sport: string) => {
    const newSport = selectedSport === sport ? "" : sport;
    setSelectedSport(newSport);
    const params = new URLSearchParams(searchParams.toString());
    if (newSport) params.set("sport_type", newSport);
    else params.delete("sport_type");
    router.push(`/turfs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F0C] transition-colors duration-500 pb-40">
      
      {/* 1. ELITE SEARCH BAR (Motivation from Khelomore, unique to Turff) */}
      <section className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F0C]/90 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 py-8 px-4 lg:px-12 mt-4 rounded-3xl shadow-2xl shadow-black/5">
         <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 w-full relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && router.push(`/turfs?q=${query}`)}
                 type="text" placeholder="Search by venue name or specific area..." className="w-full pl-16 pr-8 py-5 bg-gray-100 dark:bg-white/5 border-none rounded-[1.5rem] text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black" 
               />
               <button onClick={() => router.push(`/turfs?q=${query}`)} className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">FIND</button>
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2">
               {Object.entries(SPORT_META).map(([key, meta]) => (
                  <button 
                    key={key} 
                    onClick={() => toggleSport(key)}
                    className={`flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all ${selectedSport === key ? 'bg-primary border-primary text-white shadow-xl shadow-green-500/20 scale-105' : 'bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-200 text-gray-500 dark:text-gray-400'}`}
                  >
                     <span className="text-lg">{meta.icon}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">{meta.label}</span>
                  </button>
               ))}
               <button onClick={() => setShowFilters(!showFilters)} className={`flex-shrink-0 p-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-all ${showFilters ? 'rotate-90' : ''}`}><SlidersHorizontal className="w-5 h-5" /></button>
            </div>
         </div>
         
         {/* Advanced Filter Drawer */}
         <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                 <div className="max-w-[1600px] mx-auto pt-10 border-t border-gray-100 dark:border-white/5 mt-8 grid md:grid-cols-4 gap-12">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Velocity (₹)</label>
                        <div className="flex gap-4">
                           <input type="number" placeholder="Min" className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-black outline-none border border-transparent focus:border-primary/30" />
                           <input type="number" placeholder="Max" className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-black outline-none border border-transparent focus:border-primary/30" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Criteria</label>
                        <select className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-black outline-none border border-transparent focus:border-primary/30 appearance-none uppercase tracking-widest">
                           <option>Recommended</option>
                           <option>Price: Low to High</option>
                           <option>Top Rated First</option>
                           <option>Newly Commissioned</option>
                        </select>
                     </div>
                     <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue Amenities</label>
                        <div className="flex flex-wrap gap-3">
                           {AMENITIES.map(a => (
                             <button key={a.label} className="px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-3">
                                <a.icon className="w-4 h-4" /> {a.label}
                             </button>
                           ))}
                        </div>
                     </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </section>

      {/* 2. MARKETPLACE RESULT GRID */}
      <main className="max-w-[1700px] mx-auto px-4 lg:px-12 py-16">
         <div className="flex items-end justify-between mb-16 px-4">
            <div>
               <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Marketplace Discovery</h2>
               <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-4 italic">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                  REAL-TIME ARENA PROTOCOLS ({turfs?.length || 0} VENUES ONLINE)
               </div>
            </div>
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Listing verified arenas across {selectedSport || 'all sports'} domains.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
            {loading ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[600px] bg-gray-100 dark:bg-white/5 rounded-[4rem] animate-pulse" />
            )) : turfs?.map((t) => {
              const meta = SPORT_META[t.sport_type?.toLowerCase()] || { icon: "🏟️", accent: "text-gray-500", label: t.sport_type.toUpperCase() };
              return (
                <div key={t.id} className="group relative bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 overflow-hidden transition-all flex flex-col h-full hover:-translate-y-4 hover:shadow-[0_80px_160px_rgba(0,0,0,0.1)] duration-500">
                   {/* High Resolution Banner Area */}
                   <div className="h-80 relative overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop`} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-10 left-10 h-14 w-14 rounded-3xl bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center font-black text-primary shadow-2xl border border-white/20">
                         <Star className="w-4 h-4 mb-0.5 fill-current" />
                         <span className="text-sm">4.9</span>
                      </div>
                      
                      <div className="absolute bottom-10 left-10 flex flex-wrap gap-2">
                         <span className={`px-5 py-2 ${meta.accent} bg-white dark:bg-black/80 text-[10px] font-black rounded-xl uppercase tracking-widest italic shadow-2xl space-x-2`}>
                            <span>{meta.icon}</span> <span>{meta.label}</span>
                         </span>
                         <span className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-2xl">EXCLUSIVE</span>
                      </div>
                   </div>

                   {/* Informational Depth (Khelomore style stats) */}
                   <div className="p-12 flex-1 flex flex-col justify-between space-y-10">
                      <div className="space-y-6 text-left">
                         <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors italic line-clamp-1">{t.name}</h4>
                         <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none bg-gray-50 dark:bg-white/2 p-3 rounded-xl w-fit">
                            <MapPin className="w-4 h-4 text-primary" /> {t.location}
                         </div>
                         <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-loose line-clamp-2 opacity-80 italic">
                            {t.description || "Premium arena providing world-class infrastructure for elite level competitive gameplay."}
                         </p>
                      </div>

                      {/* Unique Feature: Intel Icons directly on card */}
                      <div className="flex gap-6 py-6 border-y border-gray-100 dark:border-white/5">
                         {AMENITIES.map((a, i) => (
                           <div key={i} className="flex flex-col items-center gap-2 group/icon">
                              <a.icon className="w-5 h-5 text-gray-400 group-hover/icon:text-primary transition-colors" />
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-0 group-hover/icon:opacity-100 transition-opacity">{a.label}</span>
                           </div>
                         ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NEXT SLOT @ ₹</div>
                            <div className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter">
                               {Number(t.price_per_slot).toFixed(0)}
                               <span className="text-xs tracking-normal font-medium text-gray-400 not-italic"> / hr</span>
                            </div>
                         </div>
                         <Link href={`/turfs/${t.id}`} className="px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-[2rem] uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-95 transition-all italic flex items-center gap-3">
                            RESERVE <ArrowRight className="w-4 h-4" />
                         </Link>
                      </div>
                   </div>
                   
                   {/* Hover Animation: Unique Grid Glow */}
                   <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-10 transition-all group-hover:scale-110"><Sparkles className="w-32 h-32 text-primary" /></div>
                </div>
              );
            })}
         </div>

         {/* Empty State Prototype (Unique SaaS Aesthetic) */}
         {!loading && turfs?.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 px-12 text-center bg-gray-50 dark:bg-white/2 rounded-[5rem] border-4 border-dashed border-gray-200 dark:border-white/5">
               <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-7xl mb-12 shadow-2xl">🏟️</div>
               <h2 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-4">No Arenas Detected</h2>
               <p className="text-base font-bold text-gray-400 uppercase tracking-[0.2em] mb-12 max-w-lg opacity-60">The selected sector does not match any online venue protocols. Adjust your domain search or sport criteria.</p>
               <button onClick={() => router.push('/turfs')} className="px-16 py-6 bg-primary text-white font-black rounded-[2rem] shadow-2xl shadow-green-500/30 uppercase tracking-[0.3em] hover:scale-110 transition-all italic">RESET PROTOCOLS</button>
            </motion.div>
         )}
      </main>

    </div>
  );
}
