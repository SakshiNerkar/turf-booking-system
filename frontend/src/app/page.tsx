"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Search, Filter, ChevronDown, Bell, Star, 
  Settings, HelpCircle, FileText, CreditCard, Share2, 
  ArrowRight, Sparkles, Zap, Shield, Clock, TrendingUp, Users, LogIn
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
  { id: 1, title: "NEW VENUE ALERT", venue: "Padel 360 | PowerPlay Park", loc: "VINAYAK NAGAR", type: "PADEL", img: "/featured_padel_court_1774238237901.png" },
  { id: 2, title: "POPULAR IN PUNE", venue: "City Arena Elite Turf", loc: "KOTHRUD", type: "FOOTBALL", img: "/football_turf_pune_1774238277016.png" },
];

export default function HomePage() {
  const { user, token, logout } = useAuth();
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Pune");
  const [showCities, setShowCities] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  async function loadTurfs() {
    setLoading(true);
    const res = await apiFetch<TurfItem[]>("/api/turfs?limit=10");
    setLoading(false);
    if (res.ok) setTurfs(res.data);
  }

  useEffect(() => { loadTurfs(); }, []);

  // Use the Carousel Banner Index
  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % FEATURED_BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F0C] pb-24 transition-colors duration-500">
      
      {/* 1. Header Location & Profile */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B0F0C]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button onClick={() => setShowCities(!showCities)} className="flex items-center gap-2 group">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                  <MapPin className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">SELECTED CITY</div>
                  <div className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-tighter">
                    {city} <ChevronDown className={`w-4 h-4 transition-transform ${showCities ? 'rotate-180' : ''}`} />
                  </div>
               </div>
            </button>
            
            <div className="hidden lg:flex relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Explore sports venues near you..." className="pl-12 pr-6 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-black outline-none w-[350px] focus:w-[450px] transition-all focus:ring-2 focus:ring-primary/20" /></div>
         </div>

         <div className="flex items-center gap-3">
            <button className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-primary transition-all relative"><Bell className="w-5 h-5" /><span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F0C]" /></button>
            <button onClick={() => setShowProfile(true)} className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-xl font-black border border-gray-100 dark:border-white/5 shadow-sm hover:scale-105 transition-all">
               {user ? user.name[0].toUpperCase() : "👤"}
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
         {/* 2. Hero Banner Carousel (Khelomore style) */}
         <section className="mb-12 relative h-[280px] sm:h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl">
            <AnimatePresence mode="wait">
               <motion.div 
                 key={bannerIdx} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.7 }}
                 className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FEATURED_BANNERS[bannerIdx].img})` }}
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-10 left-10 text-white space-y-3">
                     <span className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-black rounded-lg uppercase tracking-[0.2em] flex items-center gap-2 w-fit italic shadow-xl">
                        <Sparkles className="w-3.5 h-3.5" /> {FEATURED_BANNERS[bannerIdx].title}
                     </span>
                     <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic">{FEATURED_BANNERS[bannerIdx].venue}</h2>
                     <div className="flex items-center gap-4 text-sm font-black opacity-90 uppercase tracking-[0.3em]">
                        <span>{FEATURED_BANNERS[bannerIdx].type}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        <span className="text-amber-400">{FEATURED_BANNERS[bannerIdx].loc}</span>
                     </div>
                     <Link href="/turfs" className="inline-flex mt-6 px-10 py-4 bg-white text-black text-xs font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">BOOK NOW</Link>
                  </div>
               </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-10 right-10 flex gap-2">
               {FEATURED_BANNERS.map((_, i) => (
                 <button key={i} onClick={() => setBannerIdx(i)} className={`h-1.5 rounded-full transition-all ${i === bannerIdx ? 'w-10 bg-white' : 'w-2 bg-white/30'}`} />
               ))}
            </div>
         </section>

         {/* 3. Sport Selector Pills */}
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-10">
            {SPORTS.map(s => (
               <button key={s.name} className="flex-shrink-0 flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{s.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-primary">{s.name}</span>
               </button>
            ))}
         </div>

         {/* 4. Filter Strip */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <h3 className="text-2xl font-black tracking-tighter uppercase italic">Available Venues <span className="text-gray-400 font-medium">({turfs.length})</span></h3>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest shadow-xl">
               <Filter className="w-4 h-4" /> FILTERS
            </button>
         </div>

         {/* 5. Venuediscovery List (The App View) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 rounded-[3rem] animate-pulse" />
            )) : turfs.map(t => (
              <div key={t.id} className="group relative bg-white dark:bg-[#121A14] rounded-[3rem] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all flex flex-col">
                 <div className="h-56 relative overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop`} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-5 right-5 h-10 w-10 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center font-black text-sm text-primary shadow-xl">5.0</div>
                    <div className="absolute bottom-5 left-5 px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-xl">TRENDING</div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                       <h4 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none mb-4">{t.name}</h4>
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {t.location}
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                       <div className="text-2xl font-black text-gray-900 dark:text-white tracking-widest italic">₹{Number(t.price_per_slot).toFixed(0)} <span className="text-[10px] uppercase tracking-normal font-medium text-gray-400 opacity-60">/hr</span></div>
                       <Link href={`/turfs/${t.id}`} className="px-8 py-3 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-gray-100 dark:border-white/5">BOOK NOW</Link>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 6. Sidebar / Guest Menu (Image 3 idea) */}
      <AnimatePresence>
        {showProfile && (
           <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
             <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring", damping: 30 }} className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-[#0B0F0C] z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
                {/* Close Button Mobile */}
                <button onClick={() => setShowProfile(false)} className="absolute top-10 left-10 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-10"><ChevronDown className="w-5 h-5 rotate-90" /></button>
                
                <div className="mt-20 space-y-12">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-gray-100 dark:bg-white/10 flex items-center justify-center text-4xl shadow-inner group relative overflow-hidden">
                         {user ? user.name[0].toUpperCase() : "👤"}
                         <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-[2rem] opacity-50" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-gray-900 dark:text-white italic">{user ? user.name : "Guest Athlete"}</h3>
                         <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1 opacity-60">{user ? user.role : "Sign in to command center"}</p>
                      </div>
                   </div>

                   {user ? (
                      <div className="space-y-4">
                         <Link href={`/dashboard/${user.role}`} className="flex items-center justify-between p-6 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-500/20 hover:scale-105 transition-all">Go to Command Center <ArrowRight className="w-5 h-5" /></Link>
                         <button onClick={logout} className="w-full flex items-center gap-4 p-6 hover:bg-red-500/5 text-red-500 rounded-[2.5rem] font-black uppercase tracking-widest text-xs transition-all border border-transparent hover:border-red-500/10"><Clock className="w-5 h-5 rotate-180" /> Logout</button>
                      </div>
                   ) : (
                      <div className="space-y-4">
                         <Link href="/login" className="flex items-center justify-between p-6 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-500/20 hover:scale-[1.02] transition-all">LOGIN / SIGN UP <LogIn className="w-5 h-5" /></Link>
                         <div className="grid grid-cols-2 gap-4">
                            <Link href="/register" className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">REGISTER</Link>
                            <Link href="/turfs" className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">FAQ</Link>
                         </div>
                      </div>
                   )}

                   <div className="pt-12 space-y-8 border-t border-gray-100 dark:border-white/5">
                      {[
                        { label: "Community", sub: "Join local leagues", icon: Users },
                        { label: "Performance", sub: "Track match stats", icon: TrendingUp },
                        { label: "Elite Support", sub: "24/7 Concierge", icon: HelpCircle },
                        { label: "Legal & Privacy", sub: "Terms of play", icon: Shield }
                      ].map((item, i) => (
                        <button key={i} className="w-full flex items-center gap-6 group text-left">
                           <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><item.icon className="w-6 h-6" /></div>
                           <div>
                              <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest group-hover:text-primary transition-colors">{item.label}</div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60 leading-none">{item.sub}</div>
                           </div>
                        </button>
                      ))}
                   </div>

                   {/* Referral Idea from Image 3 */}
                   <div className="bg-amber-500/5 rounded-[3rem] p-10 border border-amber-500/10 relative overflow-hidden group">
                      <div className="relative z-10">
                        <h4 className="text-xl font-black text-amber-600 italic">Refer & Score</h4>
                        <p className="text-[10px] font-black text-gray-500 mt-2 uppercase tracking-widest leading-loose">Earn ₹500 credits for every friend who books their first session.</p>
                      </div>
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform scale-150 rotate-12 text-amber-500"><Sparkles className="w-24 h-24" /></div>
                   </div>
                </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>

      {/* 7. City Selection Modal */}
      <AnimatePresence>
        {showCities && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCities(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="fixed inset-0 m-auto w-[600px] h-fit bg-white dark:bg-[#0B0F0C] z-[70] rounded-[3rem] p-12 shadow-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-3xl font-black text-gray-900 dark:text-white italic">SET YOUR LOCATION</h3>
                   <button onClick={() => setShowCities(false)} className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><Search className="w-5 h-5 rotate-90" /></button>
                </div>
                
                <div className="relative mb-10"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search for your locality..." className="w-full pl-16 pr-8 py-5 bg-gray-100 dark:bg-white/5 border-none rounded-[2rem] text-sm font-black outline-none focus:ring-2 focus:ring-primary/20" /></div>
                
                <div className="mb-6"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-6 px-2">Popular Service Zones</label>
                  <div className="grid grid-cols-3 gap-6">
                    {CITIES.map(c => (
                      <button key={c} onClick={() => { setCity(c); setShowCities(false); }} className={`p-8 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all border-2 ${city === c ? 'bg-primary/5 border-primary text-primary shadow-xl scale-105' : 'bg-gray-50 dark:bg-white/2 border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}>
                         <div className="text-3xl">🏛️</div>
                         <div className="text-[10px] font-black uppercase tracking-widest">{c}</div>
                      </button>
                    ))}
                  </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
