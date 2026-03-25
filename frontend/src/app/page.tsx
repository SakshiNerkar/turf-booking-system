"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Search, Star, ArrowRight, CheckCircle2, 
  Calendar, ShieldCheck, Clock, Users, Trophy, 
  Zap, CreditCard, Activity, ChevronRight
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type TurfItem = { 
  id: string; 
  name: string; 
  location_city: string; 
  sports_available: string; 
  price_weekday: number; 
  rating?: number; 
  images?: { url: string; is_primary: boolean }[];
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1574629810360-7de62e1069ed?q=80&w=2000&auto=format&fit=crop", // Football
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2000&auto=format&fit=crop", // Cricket
  "https://images.unsplash.com/photo-1626225967045-9c76db7b62fe?q=80&w=2000&auto=format&fit=crop", // Padel/Court
];

export default function LandingPage() {
  const [featuredTurfs, setFeaturedTurfs] = useState<TurfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<TurfItem[]>("/api/turfs?limit=3");
      if (res.ok) setFeaturedTurfs(res.data);
      setLoading(false);
    })();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F0C] text-foreground transition-colors duration-500 overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Layered Background Carousel (Zero-glitch Architecture) */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Overlay mask for legibility */}
          <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
          
          {/* Layered Sports Imagery */}
          {[...HERO_IMAGES].map((img, i) => (
            <motion.img 
              key={img}
              src={img} 
              initial={false}
              animate={{ opacity: i === heroIndex ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover z-0"
              alt={`Arena Layer ${i}`}
              loading="eager"
            />
          ))}

          {/* Fallback base layer always at the bottom if anything fails */}
          <img 
            src="/images/hero-fallback.png" 
            className="absolute inset-0 w-full h-full object-cover z-[-1] opacity-50"
            alt="Arena Fallback"
          />
        </div>

        <div className="container-premium relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
              <Zap className="w-4 h-4 fill-primary" /> The Future of Sports Booking
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.9] drop-shadow-2xl italic uppercase">
              Book Your Turf <br />
              <span className="turf-gradient-text drop-shadow-none">In Seconds.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Elite arenas, real-time availability, and seamless payments. Join the community of 10,000+ athletes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/turfs" className="btn-premium-primary w-full sm:w-auto min-w-[200px]">
                Book Now <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/turfs" className="btn-premium-outline !text-white !border-white/30 hover:!border-white w-full sm:w-auto min-w-[200px] backdrop-blur-sm">
                Explore Turfs
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Diagonal Cut */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0B0F0C] to-transparent z-20" />
      </section>

      {/* 2. SEARCH BAR OVERLAP */}
      <div className="relative z-30 -mt-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="floating-search"
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Location</span>
              <input placeholder="Search City..." className="bg-transparent border-none outline-none text-sm font-bold w-full p-0 h-6" />
            </div>
          </div>
          <div className="hidden md:block w-px h-10 bg-border/50" />
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Activity className="w-5 h-5 text-primary" />
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Sport</span>
              <select className="bg-transparent border-none outline-none text-sm font-bold w-full p-0 h-6 appearance-none cursor-pointer">
                <option>All Sports</option>
                <option>Football</option>
                <option>Cricket</option>
                <option>Tennis</option>
              </select>
            </div>
          </div>
          <div className="hidden md:block w-px h-10 bg-border/50" />
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Date</span>
              <input type="date" className="bg-transparent border-none outline-none text-sm font-bold w-full p-0 h-6" />
            </div>
          </div>
          <button className="btn-premium-primary !py-3 w-full md:w-auto !rounded-xl">
            Find Turf
          </button>
        </motion.div>
      </div>

      {/* 3. FEATURED TURFS */}
      <section className="py-24 container-premium">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-500/20 shadow-sm">
              <Star className="w-3 h-3 fill-current" /> Premium Selection
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase drop-shadow-sm">
              Featured <span className="text-primary italic">Arenas</span>
            </h2>
          </div>
          <Link href="/turfs" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest group">
            View All Venues <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {loading ? [1,2,3].map(i => (
            <div key={i} className="h-[450px] bg-card/50 animate-pulse rounded-2xl border border-border" />
          )) : (
            featuredTurfs.map(t => (
              <motion.div key={t.id} variants={itemVariants} className="card-premium group p-0 min-h-[480px] flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={t.images?.[0]?.url || "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=600&auto=format&fit=crop"} 
                    className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
                    alt={t.name}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 border border-white/10">
                      <ShieldCheck className="w-3 h-3 text-primary" /> Verified
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                     <div className="px-3 py-1.5 bg-white/95 dark:bg-[#121A14]/95 backdrop-blur-xl rounded-lg font-black text-amber-500 text-xs shadow-xl flex items-center gap-1.5">
                       <Star className="w-3 h-3 fill-current" /> {t.rating || '4.9'}
                     </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">View Details</span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.location_city}</span>
                       <span className="w-1 h-1 bg-gray-600 rounded-full" />
                       <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {t.sports_available}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">{t.name}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-border mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1 tracking-widest">Starts from</span>
                      <span className="text-2xl font-black">₹{t.price_weekday}<span className="text-xs text-gray-400 font-bold tracking-widest ml-1">/HR</span></span>
                    </div>
                    <Link href={`/turfs/${t.id}`} className="btn-premium-primary !py-2.5 !px-6 !text-sm">
                      Book Slot
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* 4. STATS SECTION (Compact Card Layout) */}
      <section className="py-12 bg-stadium-texture border-y border-border">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: "10K+", l: "Athletes Joined", icon: Users },
              { v: "500+", l: "Premium Arenas", icon: Target },
              { v: "50K+", l: "Matches Played", icon: Trophy },
              { v: "4.9/5", l: "User Rating", icon: Star }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="stat-card-premium"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{s.v}</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.l}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (The Protocol) */}
      <section className="py-12 container-premium overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tight">The <span className="text-primary">Protocol</span></h2>
            <p className="text-gray-500 uppercase text-[10px] font-black tracking-[0.3em]">Three simple steps to the pitch</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 relative w-full max-w-4xl">
            {/* Animated Progress Line (Horizontal) */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "66%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="hidden md:block absolute top-8 left-[17%] h-0.5 border-t-2 border-dashed border-primary/30 z-0" 
            />

            {[
              { step: "01", icon: Search, label: "Explore", sub: "Find arenas near you" },
              { step: "02", icon: Calendar, label: "Select", sub: "Pick your prime time" },
              { step: "03", icon: Trophy, label: "Dominate", sub: "Show up and win" }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center space-y-4 group cursor-default"
              >
                <div className="step-ring">
                   <s.icon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-500" />
                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[9px] font-black italic shadow-lg group-hover:bg-primary transition-colors">
                    {s.step}
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-sm font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">{s.label}</h4>
                  <p className="text-[11px] text-gray-400 font-bold leading-tight max-w-[120px]">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION (Integrated) */}
      <section className="pt-8 pb-16 container-premium">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-integrated p-10 md:p-16 text-white text-center shadow-3xl"
        >
          {/* Subtle animated overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img src="/images/hero-fallback.png" className="w-full h-full object-cover animate-pulse" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter drop-shadow-2xl">
              Ready to <span className="text-primary">Dominate?</span>
            </h2>
            <p className="text-sm text-white/60 max-w-lg mx-auto font-bold leading-relaxed tracking-wide">
              Elite arenas, real-time availability, and instant payments. your next prime-time match is just 3 clicks away.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/turfs" className="btn-premium-primary !px-10 hover:shadow-[0_0_30px_rgba(46,125,50,0.5)]">
                Book Your Game Now
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
