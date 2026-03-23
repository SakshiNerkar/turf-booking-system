"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Search, Filter, ChevronDown, Bell, Star, 
  Settings, HelpCircle, FileText, CreditCard, Share2, 
  ArrowRight, Sparkles, Zap, Shield, Clock, TrendingUp, Users, LogIn,
  Trophy, Activity, Target, Layers
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";

type TurfItem = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  rating?: number;
  image?: string;
};

const CITIES = ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Thane"];
const SPORTS = [
  { name: "Football", icon: "⚽" },
  { name: "Cricket", icon: "🏏" },
  { name: "Badminton", icon: "🏸" },
  { name: "Tennis", icon: "🎾" },
  { name: "SQUASH", icon: "🎾" }
];

const FEATURED_BANNERS = [
  { id: 1, title: "NEW VENUE ALERT", venue: "Padel 360 | PowerPlay Park", loc: "VINAYAK NAGAR", hb: "bg-blue-600", img: "/featured_padel_court_1774238237901.png" },
  { id: 2, title: "POPULAR IN PUNE", venue: "City Arena Elite Turf", loc: "KOTHRUD", hb: "bg-green-600", img: "/football_turf_pune_1774238277016.png" },
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Pune");
  const [showCities, setShowCities] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  async function loadTurfs() {
    setLoading(true);
    const res = await apiFetch<TurfItem[]>("/api/turfs?limit=9");
    setLoading(false);
    if (res.ok) setTurfs(res.data);
  }

  useEffect(() => { loadTurfs(); }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % FEATURED_BANNERS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F0C] transition-colors duration-500">
      
      {/* 1. Bespoke Header (Senior Dev Approach: High Utility) */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0B0F0C]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-8 py-5 flex items-center justify-between">
         <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
               <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-black shadow-lg shadow-green-500/20 group-hover:scale-110 transition-all">T</div>
               <span className="text-2xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white">Turff</span>
            </Link>

            {/* Location Selector */}
            <button onClick={() => setShowCities(!showCities)} className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/20 transition-all group">
               <MapPin className="w-4 h-4 text-primary" />
               <span className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">{city}</span>
               <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCities ? 'rotate-180' : ''}`} />
            </button>

            {/* Global Search */}
            <div className="hidden lg:flex relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input type="text" placeholder="Find venues, coaches, or sports events..." className="pl-12 pr-6 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-black outline-none w-[320px] focus:w-[420px] transition-all border border-transparent focus:border-primary/30" />
            </div>
         </div>

         <div className="flex items-center gap-6">
            <nav className="hidden xl:flex items-center gap-8">
               {['SPORTS VENUES', 'COACHING', 'EVENTS', 'STORE'].map(l => (
                  <Link key={l} href="/turfs" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">{l}</Link>
               ))}
            </nav>

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden xl:block" />

            {user ? (
               <Link href={`/dashboard/${user.role}`} className="px-6 py-3 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-green-500/20 hover:scale-105 transition-all">DASHBOARD</Link>
            ) : (
               <div className="relative">
                  <button onClick={() => setShowLoginMenu(!showLoginMenu)} className="flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
                     <LogIn className="w-4 h-4" /> LOGIN <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {showLoginMenu && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-72 bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 rounded-3xl shadow-2xl p-4 space-y-2">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">SELECT YOUR PORTAL</div>
                         {[
                           { role: 'Customer', sub: 'Book slots & find players', icon: Users, color: 'text-primary' },
                           { role: 'Owner', sub: 'Manage your venues', icon: Activity, color: 'text-blue-500' },
                           { role: 'Admin', sub: 'Platform management', icon: Shield, color: 'text-amber-500' }
                         ].map(r => (
                           <Link key={r.role} href={`/login?role=${r.role.toLowerCase()}`} onClick={() => setShowLoginMenu(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                              <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center ${r.color} group-hover:scale-110 transition-transform`}><r.icon className="w-5 h-5" /></div>
                              <div className="text-left">
                                 <div className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{r.role}</div>
                                 <div className="text-[10px] font-bold text-gray-400 mt-0.5">{r.sub}</div>
                              </div>
                           </Link>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            )}
         </div>
      </header>

      {/* 2. Hero Section (Functional discovery) */}
      <main className="max-w-[1600px] mx-auto px-8 py-10">
         <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Discovery & Information */}
            <div className="lg:col-span-2 space-y-10">
               <section className="relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl group">
                  <AnimatePresence mode="wait">
                    <motion.div 
                       key={bannerIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                       className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FEATURED_BANNERS[bannerIdx].img})` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                       <div className="absolute bottom-12 left-12 space-y-4">
                          <span className={`px-5 py-2 ${FEATURED_BANNERS[bannerIdx].hb} text-white text-[10px] font-black rounded-full uppercase tracking-[0.3em] inline-flex items-center gap-2 italic`}>
                             <Sparkles className="w-4 h-4" /> {FEATURED_BANNERS[bannerIdx].title}
                          </span>
                          <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">{FEATURED_BANNERS[bannerIdx].venue}</h2>
                          <div className="flex items-center gap-6 text-sm font-black text-white/70 uppercase tracking-[0.4em]">
                             <span>{FEATURED_BANNERS[bannerIdx].loc}</span>
                             <span className="w-2 h-2 rounded-full bg-primary" />
                             <span className="text-white">AVAILABLE NOW</span>
                          </div>
                       </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute top-12 right-12 flex flex-col gap-3">
                     {FEATURED_BANNERS.map((_, i) => (
                        <button key={i} onClick={() => setBannerIdx(i)} className={`w-3 h-3 rounded-full transition-all border-2 border-white/50 ${i === bannerIdx ? 'bg-white scale-125' : 'bg-transparent'}`} />
                     ))}
                  </div>
               </section>

               {/* Why Turff? (Value Propositions similar to split payment, store etc) */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'SPLIT FARE', sub: 'Pay your share only', icon: Layers, color: 'from-blue-500/10 to-blue-600/5' },
                    { title: 'ELITE GEAR', sub: 'Pro sports commerce', icon: Trophy, color: 'from-amber-500/10 to-amber-600/5' },
                    { title: 'LIVE FEED', sub: 'Rank on leaderboards', icon: Target, color: 'from-purple-500/10 to-purple-600/5' },
                    { title: 'SECURE ESCROW', sub: 'Instant refund system', icon: Shield, color: 'from-green-500/10 to-green-600/5' }
                  ].map((v, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${v.color} border border-gray-100 dark:border-white/5 group hover:scale-105 transition-all text-center`}>
                       <v.icon className="w-10 h-10 mx-auto mb-6 text-gray-400 group-hover:text-primary group-hover:rotate-12 transition-all" />
                       <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white leading-none">{v.title}</h4>
                       <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest opacity-60 leading-none">{v.sub}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right: Functional Marketplace Sidebar */}
            <div className="space-y-10">
               {/* Location Selection Logic (inspired by Khelomore Modal but inline) */}
               <div className="bg-gray-50 dark:bg-white/2 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5">
                  <h4 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-8">DISCOVER ARENAS</h4>
                  <div className="space-y-4">
                     {SPORTS.map(s => (
                       <Link key={s.name} href={`/turfs?sport=${s.name.toLowerCase()}`} className="flex items-center justify-between p-5 bg-white dark:bg-[#1A241D] rounded-3xl border border-transparent hover:border-primary/20 hover:scale-[1.02] transition-all group shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{s.icon}</div>
                             <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 group-hover:text-primary">{s.name}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-all" />
                       </Link>
                     ))}
                  </div>
                  
                  <div className="mt-10 pt-10 border-t border-gray-100 dark:border-white/5">
                     <div className="flex items-center justify-between mb-6 px-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">MOST ACTIVE PORTS</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        {CITIES.slice(0, 4).map(c => (
                          <button key={c} onClick={() => setCity(c)} className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${city === c ? 'bg-primary text-white border-primary shadow-lg shadow-green-500/20' : 'bg-white dark:bg-white/5 text-gray-500 border-gray-100 dark:border-white/5 hover:border-gray-300'}`}>{c}</button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Onboarding Logic for Owners (Role Differentiation) */}
               <div className="bg-primary rounded-[3.5rem] p-10 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                     <h4 className="text-2xl font-black italic tracking-tighter leading-tight mb-4 uppercase">REGISTER AS <br /> VENUE OWNER</h4>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-loose mb-8">Unlock 12,000+ potential bookings for your sports facility instantly.</p>
                     <Link href="/register?role=owner" className="inline-flex px-8 py-3.5 bg-white text-primary text-[10px] font-black rounded-xl uppercase tracking-widest shadow-2xl hover:scale-110 transition-all">START LISTING</Link>
                  </div>
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-all pointer-events-none"><Activity className="w-32 h-32" /></div>
               </div>
            </div>
         </div>

         {/* 3. Global Discovery Feed */}
         <section className="mt-24">
            <div className="flex items-end justify-between mb-12">
               <div>
                  <h3 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">VENUES NEAR {city.toUpperCase()}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-3">
                     <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                     LIVE AVAILABILITY FEED
                  </div>
               </div>
               <Link href="/turfs" className="flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black rounded-2xl uppercase tracking-widest border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all">VIEW ALL ARENAS <ArrowRight className="w-5 h-5 text-primary" /></Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
               {loading ? Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="h-[450px] bg-gray-100 dark:bg-white/5 rounded-[4rem] animate-pulse" />
               )) : turfs.map(t => (
                 <div key={t.id} className="group bg-white dark:bg-[#121A14] rounded-[4rem] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col">
                    <div className="h-64 relative overflow-hidden">
                       <img src={`https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop`} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-white/95 dark:bg-black/90 backdrop-blur-md flex items-center justify-center font-black text-primary shadow-2xl">5.0</div>
                       <div className="absolute bottom-8 left-8 flex gap-2">
                          <span className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">Verified</span>
                          <span className="px-5 py-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">{t.sport_type}</span>
                       </div>
                    </div>
                    <div className="p-10 flex-1 space-y-8">
                       <div>
                          <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4 group-hover:text-primary transition-colors">{t.name}</h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
                             <MapPin className="w-4 h-4 text-primary" /> {t.location}
                          </div>
                       </div>
                       <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-white/5">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">STARTING FROM</div>
                             <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">₹{Number(t.price_per_slot).toFixed(0)}</div>
                          </div>
                          <Link href={`/turfs/${t.id}`} className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-[1.5rem] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">SECURE SLOT</Link>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         {/* 4. Strategic Information Sections (The "Website Info") */}
         <section className="mt-40 grid lg:grid-cols-2 gap-24 items-center px-10">
            <div>
               <label className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-6 block">OUR PHILOSOPHY</label>
               <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none mb-10">WHERE ATHLETES <br /> BECOME HEROES.</h2>
               <p className="text-lg font-medium text-gray-500 leading-relaxed mb-12">Turff is more than a booking app. It's a high-performance ecosystem designed for the modern competitor. From split-fare payments for group booking to elite-level venue management for turf owners, we've digitized the pulse of the game.</p>
               
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <div className="text-4xl font-black text-gray-900 dark:text-white">50k+</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-loose">COMPLETED SESSIONS <br /> ACROSS INDIA</div>
                  </div>
                  <div className="space-y-4">
                     <div className="text-4xl font-black text-gray-900 dark:text-white">12.5%</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-loose">FASTER MATCHMAKING <br /> THAN TRADITIONAL CALLS</div>
                  </div>
               </div>
            </div>
            
            <div className="relative">
               <div className="aspect-square rounded-[5rem] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               {/* Floating elements to prevent "app" feel but show high-tech website vibes */}
               <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-10 -right-10 p-10 bg-white dark:bg-[#1A241D] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 hidden xl:block">
                  <Activity className="w-12 h-12 text-primary" />
               </motion.div>
            </div>
         </section>
      </main>

      {/* 5. City Selection Modal */}
      <AnimatePresence>
        {showCities && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCities(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="fixed inset-0 m-auto w-[700px] h-fit bg-white dark:bg-[#0B0F0C] z-[70] rounded-[4rem] p-16 shadow-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">SELECT YOUR DOMAIN</h3>
                   <button onClick={() => setShowCities(false)} className="p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><Search className="w-6 h-6 rotate-90" /></button>
                </div>
                
                <div className="relative mb-12"><Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" /><input type="text" placeholder="Search your neighborhood..." className="w-full pl-20 pr-10 py-7 bg-gray-100 dark:bg-white/5 border-none rounded-[2.5rem] text-sm font-black outline-none focus:ring-2 focus:ring-primary/20" /></div>
                
                <div className="grid grid-cols-3 gap-6">
                  {CITIES.map(c => (
                    <button key={c} onClick={() => { setCity(c); setShowCities(false); }} className={`p-10 rounded-[3rem] flex flex-col items-center gap-6 transition-all border-2 ${city === c ? 'bg-primary/5 border-primary text-primary shadow-2xl scale-105' : 'bg-gray-50 dark:bg-white/2 border-transparent hover:border-gray-200'}`}>
                       <div className="text-4xl">🏟️</div>
                       <div className="text-xs font-black uppercase tracking-widest">{c}</div>
                    </button>
                  ))}
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
