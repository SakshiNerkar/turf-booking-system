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
import { SkeletonCard, EmptyState } from "../../components/Skeletons";
import { MultiTurfMap } from "../../components/MultiTurfMap";

type Turf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; rating?: number; is_featured?: boolean; };

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
                          t.location.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || t.sport_type.toLowerCase() === filter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [turfs, search, filter]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F0C] transition-colors duration-300">

      <div className="container-compact py-8 md:py-16 space-y-10 pb-32 md:pb-16 relative">
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <span>/</span>
           <span className="text-gray-900 dark:text-gray-100">Discover Arenas</span>
        </div>

        {/* 1. DISCOVERY HEADER & TOGGLE */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
           <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Find <span className="text-primary italic">Arenas</span></h1>
              <p className="text-sm font-medium text-gray-500 max-w-sm">Locate verified sports arenas and lock your match slot instantly.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex bg-white dark:bg-card p-1 rounded-xl shadow-sm border border-border">
                 <button onClick={() => setViewMode("list")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"}`}><List className="w-4 h-4" /> <span className="hidden sm:inline">List</span></button>
                 <button onClick={() => setViewMode("map")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"}`}><MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">Map</span></button>
              </div>
           </div>
        </header>

        {/* 2. SEARCH & FILTER BAR */}
        <section className="sticky top-16 z-40 py-2 bg-gray-50/90 dark:bg-[#0B0F0C]/90 backdrop-blur-md">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative group w-full md:w-2/3">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-bold group-focus-within:text-primary transition-all" />
                 <input 
                   value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Search venue or location... 'Pune'" 
                   className="w-full pl-14 pr-6 py-4 bg-white dark:bg-card border border-border focus:border-primary/40 rounded-2xl text-sm font-semibold outline-none transition-all shadow-sm placeholder:text-gray-400 text-gray-900 dark:text-white" 
                 />
              </div>
              <div className="flex gap-2 w-full md:w-1/3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                 {['all', 'football', 'cricket', 'badminton'].map(s => (
                   <button 
                     key={s} 
                     onClick={() => setFilter(s)}
                     className={`flex-1 min-w-[100px] px-4 py-4 rounded-2xl text-xs font-bold capitalize transition-all border shadow-sm flex items-center justify-center gap-2 ${filter === s ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-white dark:bg-card text-gray-600 border-border hover:border-primary/40'}`}
                   >
                      {s === 'all' && <Filter className="w-4 h-4" />}
                      {s}
                   </button>
                 ))}
              </div>
           </div>
        </section>

        <div className="flex items-center justify-between text-sm font-bold text-gray-500 pt-4">
           <span>Showing <strong className="text-gray-900 dark:text-white">{filtered.length}</strong> arenas</span>
           <button className="flex items-center gap-2 hover:text-primary transition-colors">Sort: Popular <ChevronDown className="w-4 h-4" /></button>
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
                          <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt={t.name} />
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                             <span className="px-3 py-1.5 bg-white/95 dark:bg-[#121A14]/95 backdrop-blur-md rounded-lg font-black text-gray-900 dark:text-gray-100 text-[10px] uppercase shadow-sm flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified</span>
                             {Number(t.price_per_slot) < 1000 && <span className="px-3 py-1.5 bg-primary/10 text-primary backdrop-blur-md rounded-lg font-black text-[9px] uppercase shadow-sm border border-primary/20 flex items-center gap-1.5">Best Value</span>}
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
                             <div className="flex items-center gap-2 text-xs font-semibold text-gray-500"><MapPin className="w-3.5 h-3.5 text-primary" /> {t.location}</div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-border/50">
                             <div>
                               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</div>
                               <div className="text-xl font-black text-gray-900 dark:text-gray-100">₹{t.price_per_slot}<span className="text-xs font-semibold text-gray-500 opacity-60">/hr</span></div>
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
