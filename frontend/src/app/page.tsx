"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { 
  MapPin, Search, Star, ArrowRight, Zap, Target, 
  Layers, CheckCircle2, Navigation, Calendar, 
  Map as MapIcon, ShieldCheck, Clock, TrendingUp, Users, Target as Aim
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";

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
    <div className="min-h-screen flex flex-col pt-20 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-[#0a0f0b] dark:to-[#0f1710]">
      
      {/* 1. HERO SECTION */}
      <section className="container-custom pt-12 pb-24 md:pt-32 md:pb-40 text-center">
         <div className="max-w-3xl mx-auto space-y-8 animate-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest italic group">
               <Zap className="w-4 h-4" /> ⚡ INSTANT BOOKING PRROTOCOL
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
               Book Your Perfect Turf <span className="text-primary italic">Anytime.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium px-4">
               Premium arena booking, regional match synchronization, and verified sector access for athletes everywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 md:pt-8">
               <Link href="/turfs" className="btn-primary w-full sm:w-auto px-10 py-5 text-base shadow-lg shadow-green-500/20">
                  Explore Turfs <ArrowRight className="w-5 h-5" />
               </Link>
               <Link href="/register?role=owner" className="btn-secondary w-full sm:w-auto px-10 py-5 text-base hover:bg-white dark:hover:bg-white/10">
                  List Your Turf
               </Link>
            </div>
         </div>
         
         {/* Clean hero asset (Subtle Illustration context) */}
         <div className="mt-20 px-4 max-w-5xl mx-auto opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
            <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=1200&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl border-8 border-white dark:border-white/5" alt="Turff Hero" />
         </div>
      </section>

      {/* 2. SEARCH ENGINE PILL */}
      <div className="container-custom -mt-20 relative z-10 px-4 sm:px-10">
         <div className="bg-white dark:bg-[#1a241c] p-6 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
            <div className="flex-1 relative flex items-center">
               <MapPin className="absolute left-6 w-6 h-6 text-primary" />
               <input placeholder="Search your location..." className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-white/5 border border-transparent rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all italic" />
            </div>
            <button className="btn-primary px-12 py-5 text-base">
               <Search className="w-5 h-5" /> SEARCH
            </button>
         </div>
      </div>

      {/* 3. FEATURED SECTORS */}
      <section className="container-custom py-32 space-y-16">
         <div className="flex flex-col md:flex-row items-end justify-between gap-8 px-4">
            <div className="space-y-4">
               <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">Featured Arenas</h2>
               <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest italic opacity-60">TOP-RATED REGIONAL SECTORS READY FOR DISCOVERY</p>
            </div>
            <Link href="/turfs" className="text-sm font-bold text-primary hover:underline underline-offset-8 decoration-2 flex items-center gap-3">EXPLORE ALL <ArrowRight className="w-4 h-4" /></Link>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
            {loading ? [1,2,3].map(i => <div key={i} className="h-[450px] bg-white dark:bg-[#1a241c] rounded-[3rem] animate-pulse" />) : (
              featuredTurfs.map(t => (
                <div key={t.id} className="card-premium group relative overflow-hidden flex flex-col h-[500px] border-transparent hover:border-primary/20">
                   <div className="h-2/3 relative">
                      <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={t.name} />
                      <div className="absolute top-8 right-8 px-5 py-2.5 bg-white/95 dark:bg-black/95 backdrop-blur-3xl rounded-2xl font-black text-primary text-xs shadow-2xl transition-transform group-hover:rotate-6 border border-white/20">★ {t.rating || '4.8'}</div>
                   </div>
                   <div className="p-8 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate italic">{t.name}</h4>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest"><MapPin className="w-4 h-4 text-primary" /> {t.location}</div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                         <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">₹{t.price_per_slot}<span className="text-[10px] not-italic opacity-40">/HR</span></div>
                         <Link href={`/turfs/${t.id}`} className="btn-primary px-8 py-4 text-xs">BOOK NOW</Link>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))
            )}
         </div>
      </section>

      {/* 4. HOW IT WORKS (Tactical Simplification) */}
      <section className="bg-white dark:bg-black/20 py-32 border-y border-gray-100 dark:border-white/5">
         <div className="container-custom space-y-20">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white uppercase italic tracking-tighter">Core Protocol</h2>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em] italic opacity-60">THREE STEPS TO FIELD DOMINANCE</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 px-4">
               {[
                 { icon: Search, title: "Search", sub: "Locate regional arenas based on your discipline protocol." },
                 { icon: Calendar, title: "Select Slot", sub: "View real-time temporal sector availability." },
                 { icon: ShieldCheck, title: "Book", sub: "Initialize match sync and commit your session." }
               ].map((v, i) => (
                 <div key={i} className="text-center space-y-8 relative group">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner border border-primary/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                       <v.icon className="w-10 h-10" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">{v.title}</h4>
                       <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic">{v.sub}</p>
                    </div>
                    {i < 2 && <ArrowRight className="hidden lg:block absolute top-12 -right-8 w-12 h-12 text-gray-100 dark:text-white/5" />}
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. BENEFITS (High-Contrast Elite) */}
      <section className="container-custom py-32 grid lg:grid-cols-2 gap-20 items-center px-4">
          <div className="space-y-12">
             <div className="space-y-4">
                <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none italic uppercase">Platform Benefits</h2>
                <div className="text-xs font-black text-primary uppercase tracking-[0.4em] italic leading-none">ELITE SECTOR STANDARDS</div>
             </div>
             <div className="grid sm:grid-cols-2 gap-10">
                 {[
                   { icon: Zap, label: "FAST SYNC", sub: "Book in under 60s" },
                   { icon: BadgeCheck, label: "VERIFIED", sub: "Trusted arena owners" },
                   { icon: Target, label: "PRECISION", sub: "Perfect slot timing" },
                   { icon: ShieldCheck, label: "SECURE", sub: "Encrypted payments" }
                 ].map((b, i) => (
                   <div key={i} className="flex flex-col gap-4 p-8 bg-white dark:bg-white/2 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><b.icon className="w-6 h-6" /></div>
                      <div>
                         <div className="text-base font-black text-gray-900 dark:text-white uppercase italic truncate leading-none mb-2">{b.label}</div>
                         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60 leading-none">{b.sub}</p>
                      </div>
                   </div>
                 ))}
             </div>
          </div>
          <div className="relative h-[600px] rounded-[4rem] overflow-hidden grayscale group hover:grayscale-0 transition-all duration-1000 hidden lg:block shadow-2xl border-4 border-white dark:border-white/5">
             <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Benefits" />
             <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent p-12 flex items-end">
                <p className="text-white text-lg font-black italic tracking-widest uppercase">SYDNEY SPORTS PARK SECTOR V</p>
             </div>
          </div>
      </section>

      {/* 6. CALL TO ACTION (Elite Conversion) */}
      <section className="container-custom py-40 text-center px-4">
         <div className="bg-primary rounded-[5rem] p-20 text-white space-y-12 relative overflow-hidden group shadow-[0_60px_120px_rgba(34,197,94,0.3)]">
            <div className="relative z-10 space-y-8">
               <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Start Booking Now</h2>
               <p className="text-xl font-bold opacity-80 max-w-2xl mx-auto italic px-4">Join thousands of athletes and arena owners in the most elite sports network.</p>
               <Link href="/turfs" className="btn-primary bg-white text-primary px-16 py-6 text-xl mx-auto hover:bg-gray-100 hover:scale-110 shadow-2xl">
                  INITIALIZE DISCOVERY <ArrowRight className="w-8 h-8" />
               </Link>
            </div>
            <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-[5s]"><Zap className="w-96 h-96" /></div>
            <div className="absolute bottom-0 left-0 p-16 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-[5s]"><Aim className="w-64 h-64" /></div>
         </div>
      </section>

      {/* 7. FOOTER (Landing Only) */}
      <footer className="bg-white dark:bg-[#0a0f0b] border-t border-gray-100 dark:border-white/5 py-24 mt-auto">
         <div className="container-custom grid md:grid-cols-4 gap-16 px-4">
            <div className="space-y-6">
               <span className="text-3xl font-black text-primary tracking-tighter italic">TURFF</span>
               <p className="text-sm font-medium text-gray-400 leading-relaxed italic">The premier sports tech marketplace for sector-based booking protocols.</p>
            </div>
            {['Sectors', 'Network', 'Support'].map(title => (
               <div key={title} className="space-y-6">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest italic">{title}</h4>
                  <ul className="space-y-4">
                     {[1,2,3].map(i => <li key={i}><Link href="#" className="text-sm font-bold text-gray-400 hover:text-primary transition-colors italic">Registry Link {i}</Link></li>)}
                  </ul>
               </div>
            ))}
         </div>
         <div className="container-custom border-t border-gray-100 dark:border-white/5 mt-20 pt-10 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic opacity-40">© 2026 TURFF SECTOR OPERATIONS · ALL LOGS PERSISTED · CLOUD-SCALE</p>
         </div>
      </footer>

    </div>
  );
}

const BadgeCheck = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
