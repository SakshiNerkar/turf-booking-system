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

type Turf = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; rating?: number; is_featured?: boolean; };

export default function TurfsPage() {
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F0C] pt-28 pb-32">
      <div className="container-custom space-y-12">
        
        {/* 1. DISCOVERY HEADER (Clean High-Contrast) */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-4">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-xl uppercase tracking-[0.4em] italic shadow-sm">Sector Registry Active</span>
                 <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase text-gray-900 dark:text-white">Discover <span className="text-primary">Sectors</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 leading-loose max-w-sm italic">Locate regional sports arenas with verified slot-timing protocols.</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#1a241c] p-3 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
              {['all', 'football', 'cricket', 'badminton'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`px-8 py-3.5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all ${filter === s ? 'bg-primary text-white shadow-xl scale-110' : 'text-gray-400 hover:text-primary hover:bg-white/5'}`}
                >
                   {s}
                </button>
              ))}
           </div>
        </header>

        {/* 2. SEARCH ENGINE (Premium Pill) */}
        <section className="px-4">
           <div className="relative group max-w-4xl">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 font-extrabold group-focus-within:text-primary transition-all" />
              <input 
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search Arena Identity or Regional Coords..." 
                className="w-full pl-24 pr-10 py-8 bg-white dark:bg-[#1a241c] border-4 border-transparent focus:border-primary/10 rounded-[4rem] text-sm font-black uppercase tracking-widest outline-none transition-all shadow-2xl italic placeholder:text-gray-300" 
              />
           </div>
        </section>

        {/* 3. SECTOR GRID (Vertical Stack Priority) */}
        <section className="px-4">
           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
             </div>
           ) : filtered.length === 0 ? (
             <EmptyState title="No Sectors Found" sub="Your discovery parameters matched zero regional records. Resetting filters is recommended." icon={Filter} actionLabel="CLEAR SEARCH" />
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filtered.map(t => (
                  <Link key={t.id} href={`/turfs/${t.id}`} className="group relative bg-white dark:bg-[#1a241c] rounded-[4.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl hover:-translate-y-4 hover:shadow-[0_80px_160px_rgba(0,0,0,0.1)] transition-all flex flex-col h-[520px]">
                     <div className="h-2/3 relative">
                        <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]" alt={t.name} />
                        <div className="absolute top-10 right-10 px-6 py-3 bg-white/95 dark:bg-black/95 backdrop-blur-3xl rounded-[1.25rem] font-black text-primary text-[10px] shadow-2xl group-hover:rotate-6 border border-white/20">★ {t.rating || '4.8'}</div>
                        <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="p-12 space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                           <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{t.name}</h4>
                           <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60"><MapPin className="w-4 h-4 text-primary" /> {t.location}</div>
                        </div>
                        <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5">
                           <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">₹{t.price_per_slot}<span className="text-[10px] not-italic opacity-40">/HR</span></div>
                           <button className="px-10 py-5 bg-primary text-white text-[10px] font-black rounded-[1.5rem] uppercase tracking-widest shadow-2xl hover:scale-110 transition-all italic flex items-center gap-4">VIEW SLOTS <ArrowRight className="w-5 h-5" /></button>
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
           )}
        </section>

      </div>
    </div>
  );
}
