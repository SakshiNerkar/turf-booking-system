"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, RefreshCw, Filter, ArrowRight, Calendar } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { SkeletonCard } from "../../components/Skeletons";

type Turf = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  description: string | null;
};

const SPORT_META: Record<string, { icon: string; bg: string; color: string }> = {
  football:  { icon: "⚽", bg: "from-green-500/20 to-green-600/30", color: "text-green-500" },
  cricket:   { icon: "🏏", bg: "from-amber-500/20 to-amber-600/30",  color: "text-amber-500" },
  badminton: { icon: "🏸", bg: "from-blue-500/20 to-blue-600/30",   color: "text-blue-500"  },
  tennis:    { icon: "🎾", bg: "from-orange-500/20 to-orange-600/30", color: "text-orange-500" },
};

function getSportMeta(sport: string) {
  return SPORT_META[sport?.toLowerCase()] ?? {
    icon: "🏟️",
    bg: "from-gray-500/20 to-gray-600/30",
    color: "text-gray-500",
  };
}

const SPORT_OPTIONS = [
  { value: "", label: "All Sports" },
  { value: "football",  label: "Football" },
  { value: "cricket",   label: "Cricket"  },
  { value: "badminton", label: "Badminton" },
  { value: "tennis",    label: "Tennis"   },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "circOut" }
  },
};

export default function TurfsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [turfs, setTurfs]     = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const [q,          setQ]          = useState(searchParams.get("q")          ?? "");
  const [location,   setLocation]   = useState(searchParams.get("location")   ?? "");
  const [sport_type, setSportType]  = useState(searchParams.get("sport_type") ?? "");
  const [min_price,  setMinPrice]   = useState(searchParams.get("min_price")  ?? "");
  const [max_price,  setMaxPrice]   = useState(searchParams.get("max_price")  ?? "");

  const fetchTurfs = useCallback(async (params?: {
    q?: string; location?: string; sport_type?: string; min_price?: string; max_price?: string;
  }) => {
    setLoading(true);
    setError(null);
    setIsOffline(false);

    const qs = new URLSearchParams();
    const p = params ?? { q, location, sport_type, min_price, max_price };
    if (p.q)          qs.set("q",          p.q);
    if (p.location)   qs.set("location",   p.location);
    if (p.sport_type) qs.set("sport_type", p.sport_type);
    if (p.min_price)  qs.set("min_price",  p.min_price);
    if (p.max_price)  qs.set("max_price",  p.max_price);
    qs.set("limit", "50");

    const res = await apiFetch<Turf[]>(`/api/turfs?${qs.toString()}`);
    setLoading(false);

    if (!res.ok) {
      const code = (res as any).error?.code;
      setIsOffline(code === "NETWORK_ERROR");
      setError((res as any).error?.message ?? "Failed to load turfs");
      setTurfs([]);
      return;
    }
    setTurfs(res.data);
  }, [q, location, sport_type, min_price, max_price]);

  useEffect(() => {
    const p = {
      q:          searchParams.get("q")          ?? "",
      location:   searchParams.get("location")   ?? "",
      sport_type: searchParams.get("sport_type") ?? "",
      min_price:  searchParams.get("min_price")  ?? "",
      max_price:  searchParams.get("max_price")  ?? "",
    };
    setQ(p.q); setLocation(p.location); setSportType(p.sport_type);
    setMinPrice(p.min_price); setMaxPrice(p.max_price);
    fetchTurfs(p);
  }, [searchParams, fetchTurfs]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q)          qs.set("q",          q);
    if (location)   qs.set("location",   location);
    if (sport_type) qs.set("sport_type", sport_type);
    if (min_price)  qs.set("min_price",  min_price);
    if (max_price)  qs.set("max_price",  max_price);
    router.push(`/turfs?${qs.toString()}`);
  }

  function handleClear() {
    setQ(""); setLocation(""); setSportType(""); setMinPrice(""); setMaxPrice("");
    router.push("/turfs");
  }

  const hasFilters = !!(q || location || sport_type || min_price || max_price);

  return (
    <div className="space-y-12">
      
      {/* Search & Filters */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Browse <span className="text-primary">Turfs</span>
            </h1>
            <p className="mt-2 text-gray-500 font-medium">
              {loading ? "Discovering optimal slots..." : `${turfs?.length ?? 0} premium venues available`}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchTurfs()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-card p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                value={q} 
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name or sport..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all font-medium"
              />
            </div>
            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all font-medium"
              />
            </div>
            <div className="md:col-span-3 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                value={sport_type} 
                onChange={(e) => setSportType(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all font-bold appearance-none"
              >
                {SPORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input 
                value={min_price} 
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="₹ Min price"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all text-sm font-medium"
              />
              <input 
                value={max_price} 
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="₹ Max price"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="flex gap-2">
              {hasFilters && (
                <button type="button" onClick={handleClear} className="px-6 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  Reset
                </button>
              )}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="px-8 py-3 bg-primary text-white font-black rounded-xl shadow-lg shadow-green-500/25 flex items-center gap-2"
              >
                Find Slots
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </form>
      </section>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`}>
                <SkeletonCard />
              </div>
            ))
          ) : turfs?.map((t) => {
            const meta = getSportMeta(t.sport_type);
            return (
              <motion.div
                layout
                key={t.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="card-premium group"
              >
                {/* Image / Header */}
                <div className={`relative h-56 w-full bg-gradient-to-br ${meta.bg} flex items-center justify-center p-8`}>
                  <div className="text-7xl group-hover:scale-120 transition-transform duration-500 ease-out">{meta.icon}</div>
                  <div className="absolute inset-0 turf-image-overlay opacity-60" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Available
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-black shadow-lg">
                    ₹{Number(t.price_per_slot).toFixed(0)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="truncate">{t.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed h-10">
                    {t.description || "Premium sports facility with specialized lighting and amenities."}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className={`text-xs font-black uppercase tracking-wider ${meta.color} flex items-center gap-1.5`}>
                      <span className="w-2 h-2 rounded-full border-2 border-current" />
                      {t.sport_type}
                    </div>
                    
                    <div className="flex gap-2">
                       <Link 
                        href={`/turfs/${t.id}`}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-primary transition-colors border border-gray-100 dark:border-white/5"
                      >
                        <Calendar className="w-5 h-5" />
                      </Link>
                      <Link 
                        href={`/turfs/${t.id}`}
                        className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-black flex items-center gap-2 group/btn"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[inherit] border-2 border-primary/0 group-hover:border-primary/20 transition-all pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {!loading && turfs?.length === 0 && (
         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-8 text-center bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10"
         >
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-4xl mb-6">🏜️</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No turfs match your search</h2>
          <p className="text-gray-500 mb-8 max-w-sm">Try adjusting your filters or search terms to find available slots.</p>
          <button onClick={handleClear} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl">
            Clear All Filters
          </button>
         </motion.div>
      )}
    </div>
  );
}
