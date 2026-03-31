"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, RefreshCw, Star, MapPin, ArrowRight, Filter, 
  Settings, Target, Zap, BadgeCheck, Sparkles, Map as MapIcon, 
  Clock, TrendingUp, ChevronDown, List, ShieldCheck
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import { SkeletonCard, EmptyState } from "../../components/Skeletons";
import { MultiTurfMap } from "../../components/MultiTurfMap";

type Turf = { id: string; name: string; location_city: string; sports_available: string; price_weekday: number; rating?: number; images?: string[] | string; primary_image?: string; latitude?: number; longitude?: number; };

export default function TurfsPage() {
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const loadTurfs = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch<Turf[]>("/api/turfs?limit=50");
    setLoading(false);
    if (res.ok) setTurfs(res.data);
  }, []);

  useEffect(() => { loadTurfs(); }, [loadTurfs]);

  const filtered = useMemo(() => {
    if (!turfs) return [];
    return turfs.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.location_city.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || t.sports_available.toLowerCase() === filter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [turfs, search, filter]);

  return (
    <div className="min-h-screen bg-stadium-texture dark:bg-[#0B0F0C] transition-colors duration-300">
      <div className="container-premium py-10 space-y-8 pb-32 relative">
        
        {/* DISCOVERY HEADER & TOGGLE */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
           <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-gray-100 uppercase italic">
                Find <span className="text-primary">Arenas</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Locate. Select. Dominate.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex bg-white/50 dark:bg-card/50 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-border">
                <button 
                  onClick={() => setViewMode("list")} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "list" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  <List className="w-3.5 h-3.5" /> List view
                </button>
                <button 
                  onClick={() => setViewMode("map")} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "map" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> Map view
                </button>
              </div>
           </div>
        </motion.header>

        {/* 2. FLOATING SEARCH & PILL FILTERS */}
        <section className="sticky top-20 z-40 space-y-4">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="floating-search"
           >
              <div className="relative group w-full">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-all" />
                 <input 
                   value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Search venue or location... 'Pune'" 
                   className="w-full pl-12 pr-6 py-3 bg-transparent text-sm font-bold outline-none placeholder:text-gray-400 text-gray-900 dark:text-white group-focus-within:translate-x-1 transition-transform" 
                 />
              </div>
              <div className="hidden md:block w-px h-8 bg-border" />
              <button 
                onClick={loadTurfs}
                className="btn-premium-primary !py-2.5 !px-6 !text-[10px] shadow-sm w-full md:w-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Update
              </button>
           </motion.div>

           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {['all', 'football', 'cricket', 'badminton'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`pill-filter ${filter === s ? 'pill-filter-active' : 'bg-white/50 dark:bg-card/50 text-gray-500 hover:border-primary/50'}`}
                >
                   {s}
                </button>
              ))}
           </div>
        </section>

        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
           <span className="flex items-center gap-2">Showing <strong className="text-gray-900 dark:text-white text-xs tracking-tighter">{filtered.length}</strong> available results</span>
           <button className="flex items-center gap-2 hover:text-primary transition-colors">Sort: Popular <ChevronDown className="w-3 h-3" /></button>
        </div>

        {/* 3. SECTOR GRID (High Conversion Cards) */}
        {viewMode === "list" ? (
          <section className="">
             {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
               </div>
             ) : filtered.length === 0 ? (
                <EmptyState title="No Arenas Found" sub="Try adjusting your filters or location search." icon={Target} actionLabel="Clear Filters" actionLink="/turfs" />
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filtered.map(t => (
                    <Link key={t.id} href={`/turfs/${t.id}`} className="card-compact p-0 group flex flex-col h-[420px] shadow-sm hover:shadow-premium border-border bg-white dark:bg-[#121A14]">
                       <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-[#0B0F0C]">
                          <img 
                             src={
                               t.primary_image || (
                                 Array.isArray(t.images) ? t.images[0] : 
                                 (typeof t.images === 'string' && t.images.startsWith('[') ? JSON.parse(t.images)[0] : t.images)
                               ) || "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400&auto=format&fit=crop"
                             } 
                             className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                             alt={t.name} 
                           />
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                             <span className="px-3 py-1.5 bg-white/95 dark:bg-[#121A14]/95 backdrop-blur-md rounded-lg font-black text-gray-900 dark:text-gray-100 text-[10px] uppercase shadow-sm flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified</span>
                             {t.price_weekday < 1000 && <span className="px-3 py-1.5 bg-primary/10 text-primary backdrop-blur-md rounded-lg font-black text-[9px] uppercase shadow-sm border border-primary/20 flex items-center gap-1.5">Best Value</span>}
                          </div>
                          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                             <div className="px-3 py-1 bg-white/95 dark:bg-[#121A14]/95 backdrop-blur-md rounded-lg font-black text-amber-500 text-[11px] shadow-sm flex items-center gap-1.5">★ {t.rating || '4.9'}</div>
                             {(t.rating || 0) >= 4.8 && <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black italic rounded-sm shadow-md animate-pulse">Trending</span>}
                          </div>
                       </div>
                       
                       <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                             <div className="flex items-center justify-between">
                               <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none group-hover:text-primary transition-colors truncate pr-4 flex items-center gap-2 italic uppercase">
                                 {t.name} <BadgeCheck className="w-5 h-5 text-primary" /> <Sparkles className="w-4 h-4 text-amber-500" />
                               </h4>
                             </div>
                             <div className="flex items-center gap-2 text-xs font-semibold text-gray-500"><MapPin className="w-3.5 h-3.5 text-primary" /> {t.location_city}</div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-border/50">
                             <div>
                               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</div>
                               <div className="text-xl font-black text-gray-900 dark:text-gray-100">₹{t.price_weekday}<span className="text-xs font-semibold text-gray-500 opacity-60">/hr</span></div>
                             </div>
                             <button className="btn-sports py-3 px-6 shadow-md shadow-primary/20">Book</button>
                          </div>
                       </div>
                    </Link>
                  ))}
               </div>
             )}
          </section>
        ) : (
          <section className="h-[600px] w-full rounded-[3.5rem] overflow-hidden border border-border shadow-2xl relative">
              <MultiTurfMap turfs={filtered} />
          </section>
        )}

      </div>
    </div>
  );
}
