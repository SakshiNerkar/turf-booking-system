"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Search, Star, ArrowRight, Zap, Target, 
  Layers, CheckCircle2, Navigation, Calendar, 
  Map as MapIcon, ShieldCheck, Sparkles, Clock, TrendingUp, Users, Target as Aim, Heart
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

type TurfItem = { id: string; name: string; location: string; sport_type: string; price_per_slot: string; rating?: number; is_featured?: boolean; };

export default function LandingPage() {
  const { user } = useAuth();
  const [featuredTurfs, setFeaturedTurfs] = useState<TurfItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<TurfItem[]>("/api/turfs?limit=3");
      if (res.ok) setFeaturedTurfs(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-0 bg-white dark:bg-[#0B0F0C] transition-colors duration-300">
      <Navbar />

      {/* 1. HERO SECTION (High-Conversion SaaS) */}
      <section className="container-compact py-16 md:py-24 text-center mt-8">
         <div className="max-w-3xl mx-auto space-y-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black rounded-full uppercase tracking-[0.2em] border border-primary/20 shadow-sm"
            >
               <Zap className="w-4 h-4 fill-primary/40" /> ⚡ BOOK MULTIPLE ARENAS INSTANTLY
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-[1.05]">
               Book Your Perfect Turf <br className="hidden md:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Anytime, Anywhere.</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
               Join 10,000+ players relying on Turff to locate elite arenas, view real-time slots, and commit sessions seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
               <Link href="/turfs" className="btn-sports w-full sm:w-auto px-10 py-4 text-base shadow-primary/30 hover:-translate-y-1">
                  Book Your Game <ArrowRight className="w-5 h-5" />
               </Link>
               <Link href="/register?role=owner" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base">
                  List Your Turf
               </Link>
            </div>
            
            <div className="flex items-center justify-center gap-6 pt-10 opacity-70">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><ShieldCheck className="w-4 h-4 text-primary" /> Verified Assets</div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Clock className="w-4 h-4 text-primary" /> Instant Confirm</div>
            </div>
         </div>
      </section>

      {/* 2. COMPACT SEARCH PILL */}
      <div className="container-compact -mt-4 mb-16 relative z-10">
         <div className="glass-panel p-2 md:p-3 rounded-2xl shadow-premium border border-border flex flex-col md:flex-row gap-2 max-w-4xl mx-auto items-center">
            <div className="flex-1 relative flex items-center w-full">
               <MapPin className="absolute left-4 w-5 h-5 text-primary" />
               <input placeholder="Detecting location... or search Pune, Mumbai" className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#0B0F0C] border border-border focus:border-primary/40 rounded-xl text-sm font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400" />
            </div>
            <div className="flex-1 relative flex items-center w-full">
               <Calendar className="absolute left-4 w-5 h-5 text-primary" />
               <input type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#0B0F0C] border border-border focus:border-primary/40 rounded-xl text-sm font-semibold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-400" />
            </div>
            <button className="btn-sports px-10 py-3 w-full md:w-auto h-full rounded-xl uppercase tracking-widest text-xs">
               <Search className="w-4 h-4" /> DISCOVER
            </button>
         </div>
      </div>

      {/* 3. ELITE COLLECTIONS (Personalized & Trust) */}
      <section className="container-compact py-20 space-y-16 border-t border-border/50">
         <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-500/20 shadow-sm"><Sparkles className="w-3.5 h-3.5" /> Curated Intelligence</div>
               <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tighter leading-none italic uppercase">Recommended <span className="text-primary italic">Sectors</span></h2>
               <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] opacity-60">ANALYZING REGIONAL MATCH CADENCE...</p>
            </div>
            <Link href="/turfs" className="hidden md:flex items-center gap-4 px-8 py-4 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-[11px] font-black rounded-2xl uppercase tracking-widest hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm border border-border">
               View Global Inventory <ArrowRight className="w-4 h-4" />
            </Link>
         </div>

         <div className="grid md:grid-cols-3 gap-10">
            {loading ? [1,2,3].map(i => <div key={i} className="h-96 bg-card border border-border rounded-[2.5rem] animate-pulse" />) : (
              featuredTurfs.map(t => (
                <div key={t.id} className="card-compact group flex flex-col h-[480px] p-0 rounded-[3rem] shadow-2xl hover:shadow-premium-hover border-border relative overflow-hidden">
                   <div className="h-[240px] relative bg-gray-100 dark:bg-[#0B0F0C] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt={t.name} />
                      
                      <div className="absolute top-6 left-6 flex flex-col gap-3">
                         <span className="px-4 py-2 bg-white/95 dark:bg-[#121A14]/95 backdrop-blur-xl rounded-[1.2rem] font-black text-gray-900 dark:text-gray-100 text-[10px] uppercase shadow-2xl flex items-center gap-2 border border-white/20"><ShieldCheck className="w-4 h-4 text-primary" /> Verified Hub</span>
                         {Number(t.price_per_slot) < 1000 && <span className="px-4 py-2 bg-primary text-white backdrop-blur-md rounded-[1.2rem] font-black text-[9px] uppercase shadow-2xl flex items-center gap-2">Hot Deal</span>}
                      </div>

                      <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                         <div className="px-4 py-2 bg-white/95 dark:bg-[#121A14]/95 backdrop-blur-xl rounded-[1.2rem] font-black text-amber-500 text-[12px] shadow-2xl flex items-center gap-2 border border-white/20">★ {t.rating || '4.9'} <span className="text-[9px] text-gray-400 font-bold opacity-60 tracking-tighter">({(Math.random()*200 + 100).toFixed(0)})</span></div>
                         {(t.rating || 0) >= 4.8 && <span className="px-3 py-1 bg-rose-500 text-white text-[9px] font-black italic rounded-lg shadow-xl animate-pulse uppercase tracking-widest">High Demand</span>}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-6 left-6 text-white space-y-1">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 flex items-center gap-2"><Navigation className="w-3 h-3 fill-current" /> {t.location.split(',')[0]} Sector</div>
                      </div>
                   </div>
                   
                   <div className="p-8 flex flex-col flex-1 justify-between bg-white dark:bg-[#121A14]">
                      <div className="space-y-4">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter leading-none group-hover:text-primary transition-colors italic uppercase">{t.name}</h4>
                        <div className="flex items-center gap-3">
                           <div className="flex -space-x-2">
                              {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#121A14] bg-gray-200 dark:bg-card overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${t.id}${i}`} /></div>)}
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Booked 5 times today</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5">
                         <div className="space-y-1">
                            <span className="text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] italic leading-none">ENTRY PROTOCOL</span>
                            <div className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter italic">₹{t.price_per_slot}<span className="text-[10px] font-black text-gray-400 opacity-60 tracking-widest">/HR</span></div>
                         </div>
                         <Link href={`/turfs/${t.id}`} className="btn-sports px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Select Slot</Link>
                      </div>
                   </div>
                   
                   <div className="absolute -bottom-10 -right-10 p-20 opacity-[0.02] group-hover:scale-110 group-hover:-translate-x-4 transition-all duration-[5s] pointer-events-none grayscale"><Aim className="w-48 h-48" /></div>
                </div>
              ))
            )}
         </div>
      </section>

      {/* 4. SOCIAL PROOF / TRUST STRIP */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16 border-y border-primary/10">
         <div className="container-compact text-center space-y-10">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Trusted by over <span className="text-primary italic font-black">10,000+</span> Athletes Daily</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto opacity-70">
               {[
                 { v: "50K+", l: "Matches Played" },
                 { v: "150+", l: "Verified Turfs" },
                 { v: "4.9/5", l: "Average Rating" },
                 { v: "<60s", l: "Booking Speed" }
               ].map((s,i) => (
                  <div key={i} className="space-y-2">
                     <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{s.v}</div>
                     <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{s.l}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. USER FLOW (High Usability) */}
      <section className="container-compact py-24 space-y-16">
         <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">How It Works</h2>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">A seamless reservation protocol</p>
         </div>
         
         <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "1. Discover", sub: "Locate verified regional arenas." },
              { icon: Calendar, title: "2. Schedule", sub: "Select your temporal slot." },
              { icon: ShieldCheck, title: "3. Commit", sub: "Pay securely via platform." },
              { icon: CheckCircle2, title: "4. Play", sub: "Arrive and execute your match." }
            ].map((v, i) => (
              <div key={i} className="card-compact p-8 text-center space-y-5 bg-transparent border-transparent shadow-none hover:shadow-none hover:-translate-y-2 hover:bg-gray-50 dark:hover:bg-[#121A14] flex flex-col items-center group">
                 <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1A241D] text-primary flex items-center justify-center border border-border shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <v.icon className="w-8 h-8 opacity-80" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{v.title}</h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{v.sub}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="container-compact py-24 text-center pb-32">
         <div className="bg-gray-900 dark:bg-[#121A14] rounded-3xl p-12 md:p-20 text-white space-y-8 shadow-premium-hover border border-gray-800 dark:border-white/5 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
               <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready for the Pitch?</h2>
               <p className="text-base text-gray-400 max-w-xl mx-auto font-medium">Join the elite sports network and automate your booking experience today.</p>
               <Link href="/turfs" className="btn-sports bg-primary hover:bg-primary-hover text-white px-10 py-4 text-base mx-auto max-w-xs shadow-xl shadow-primary/30">
                  Book Your Next Match
               </Link>
            </div>
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none scale-150 -translate-y-12 translate-x-12"><Target className="w-96 h-96 text-primary" /></div>
         </div>
      </section>

    </div>
  );
}
