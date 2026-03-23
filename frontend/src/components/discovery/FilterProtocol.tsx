"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, MapPin, Calendar as CalIcon, Clock, Filter, ChevronDown, 
  X, Droplets, Car, ShieldCheck, Wifi, Star, Zap, Navigation, 
  SlidersHorizontal, Check, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SPORTS = [
  { label: "Football", value: "football", icon: "⚽" },
  { label: "Cricket", value: "cricket", icon: "🏏" },
  { label: "Badminton", value: "badminton", icon: "🏸" },
  { label: "Tennis", value: "tennis", icon: "🎾" },
  { label: "Pickleball", value: "pickleball", icon: "🎾" },
];

const DISTANCES = ["2km", "5km", "10km", "All Distances"];
const AMENITIES = [
  { id: "parking", label: "Parking", icon: Car },
  { id: "water", label: "Mineral Water", icon: Droplets },
  { id: "security", label: "CCTV / Secure", icon: ShieldCheck },
  { id: "wifi", label: "Guest WiFi", icon: Wifi },
];

export function FilterProtocol({ totalResults }: { totalResults: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Filter States
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [selectedSports, setSelectedSports] = useState<string[]>(searchParams.get("sport_type")?.split(",").filter(Boolean) || []);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [rating, setRating] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/turfs?${params.toString()}`);
  }, [searchParams, router]);

  const toggleSport = (sport: string) => {
    const next = selectedSports.includes(sport) 
      ? selectedSports.filter(s => s !== sport) 
      : [...selectedSports, sport];
    setSelectedSports(next);
    updateParams({ sport_type: next.length ? next.join(",") : null });
  };

  const clearAll = () => {
    setQ("");
    setSelectedSports([]);
    setRating(0);
    setIsAvailable(false);
    router.push("/turfs");
  };

  return (
    <div className={`sticky top-24 z-30 transition-all duration-500 ${isScrolled ? 'py-4 bg-white/80 dark:bg-[#0B0F0C]/80 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5' : 'py-8'}`}>
       <div className="max-w-[1700px] mx-auto px-6 lg:px-12 space-y-6">
          
          {/* Main Filter Bar */}
          <div className="flex flex-col xl:flex-row items-center gap-6">
             {/* 1. Search + Suggestion */}
             <div className="flex-1 w-full relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-all" />
                <input 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateParams({ q })}
                  type="text" placeholder="Search by name, landmark, or specific sport protocol..." className="w-full pl-16 pr-24 py-5 bg-gray-50 dark:bg-white/2 border border-transparent hover:border-gray-200 dark:hover:border-white/5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" 
                />
                <button 
                  onClick={() => updateParams({ q })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-black rounded-xl uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  EXECUTE
                </button>
             </div>

             {/* 2. Tactical Pills */}
             <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto no-scrollbar py-2">
                <div className="flex items-center gap-2 pr-6 border-r border-gray-100 dark:border-white/5">
                   {SPORTS.map(s => (
                     <button 
                       key={s.value} 
                       onClick={() => toggleSport(s.value)}
                       className={`px-6 py-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 whitespace-nowrap ${selectedSports.includes(s.value) ? 'bg-primary border-primary text-white shadow-xl shadow-green-500/10 scale-105' : 'bg-white dark:bg-white/5 border-transparent hover:border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest'}`}
                     >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                     </button>
                   ))}
                </div>
                
                <button 
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className={`flex items-center gap-4 px-8 py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-all ${advancedOpen ? 'scale-95 opacity-80' : 'hover:scale-105'}`}
                >
                   <SlidersHorizontal className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest italic">{advancedOpen ? 'Seal Filters' : 'Advanced Filters'}</span>
                </button>
             </div>
          </div>

          {/* Advanced Filtering Drawer */}
          <AnimatePresence>
            {advancedOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                 <div className="glass-panel p-10 rounded-[3rem] mt-4 grid md:grid-cols-4 gap-12 border-2 border-primary/10">
                    
                    {/* Distance & Range */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-4 block">Range Protocol</label>
                       <div className="grid grid-cols-2 gap-3">
                          {DISTANCES.map(d => (
                            <button key={d} className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:bg-primary hover:text-white transition-all">{d}</button>
                          ))}
                       </div>
                    </div>

                    {/* Price Velocity */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-4 block">Price Velocity (₹)</label>
                       <div className="space-y-6">
                          <input type="range" min="0" max="5000" className="w-full accent-primary" />
                          <div className="flex justify-between text-[10px] font-black text-gray-400">
                             <span>₹0</span>
                             <span className="text-gray-900 dark:text-white">UNDER ₹{priceRange[1]}</span>
                          </div>
                       </div>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-4 block">Intel Checklist</label>
                       <div className="flex flex-wrap gap-3">
                          {AMENITIES.map(a => (
                            <button key={a.id} className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all">
                               <a.icon className="w-4 h-4" /> {a.label}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Meta Controls */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-4 block">Execution Controls</label>
                       <div className="space-y-3">
                          <button 
                            onClick={() => setIsAvailable(!isAvailable)}
                            className={`flex items-center justify-between w-full p-4 rounded-2xl border-2 transition-all ${isAvailable ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400'}`}
                          >
                             <span className="text-[10px] font-black uppercase tracking-widest italic">Live Availability</span>
                             <div className={`w-8 h-4 rounded-full p-1 transition-all ${isAvailable ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}>
                                <div className={`w-2 h-2 rounded-full bg-white transition-all ${isAvailable ? 'ml-4' : 'ml-0'}`} />
                             </div>
                          </button>
                          <button onClick={clearAll} className="w-full px-6 py-4 bg-red-500/5 text-red-500 text-[10px] font-black rounded-2xl uppercase tracking-widest italic hover:bg-red-500/10 transition-all">Format all filters</button>
                       </div>
                    </div>

                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Context & Chips */}
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">{totalResults} ARENAS SYNCED</span>
                <div className="flex items-center gap-4">
                   {selectedSports.map(s => (
                     <span key={s} className="flex items-center gap-3 px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                        {s} <X onClick={() => toggleSport(s)} className="w-3 h-3 cursor-pointer hover:rotate-90 transition-transform" />
                     </span>
                   ))}
                </div>
             </div>
             
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-40">SORT PROTOCOL</span>
                   <select className="bg-transparent text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest outline-none cursor-pointer">
                      <option>NEAREST FIRST</option>
                      <option>PRICE: LOW TO HIGH</option>
                      <option>HIGHEST RATINGS</option>
                      <option>MOST ACTIVE</option>
                   </select>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
