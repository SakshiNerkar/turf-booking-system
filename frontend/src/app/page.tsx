"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Search, Filter, ChevronDown, Bell, Star, 
  Settings, HelpCircle, FileText, CreditCard, Share2, 
  ArrowRight, Sparkles, Zap, Shield, Clock, TrendingUp, Users, LogIn,
  Trophy, Activity, Target, Layers, PlayCircle, Heart, Store,
  Globe, Smartphone, Headphones, BadgeCheck, MessageCircle, Navigation,
  Calendar, CheckCircle2
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

const CITIES = ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Thane", "Chennai", "Kolkata", "Ahmedabad"];
const SPORTS = [
  { name: "Football", icon: "⚽" },
  { name: "Cricket", icon: "🏏" },
  { name: "Badminton", icon: "🏸" },
  { name: "Tennis", icon: "🎾" },
  { name: "Squash", icon: "🎾" },
  { name: "Pickleball", icon: "🎾" },
  { name: "Basketball", icon: "🏀" },
  { name: "Swimming", icon: "🏊" },
  { name: "Yoga", icon: "🧘" }
];

const FEATURED_ARENAS = [
  { id: 1, title: "PREMIUM ACCESS", venue: "The Arena | Elite Sports Complex", img: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=1200&auto=format&fit=crop", badge: "bg-blue-600", tag: "NIGHT SESSIONS" },
  { id: 2, title: "SQUAD DISCOVERY", venue: "Thunder Box Cricket", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop", badge: "bg-amber-600", tag: "WHEELCHAIR ACCESSIBLE" },
  { id: 3, title: "COACHING MASTERCLASS", venue: "Elite Padel Academy", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop", badge: "bg-emerald-600", tag: "BOOKING NOW" },
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [showCities, setShowCities] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  async function loadTurfs() {
    setLoading(true);
    const res = await apiFetch<TurfItem[]>("/api/turfs?limit=20");
    setLoading(false);
    if (res.ok) setTurfs(res.data);
  }

  useEffect(() => { loadTurfs(); }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % FEATURED_ARENAS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F0C] transition-colors duration-500 overflow-x-hidden">
      
      {/* 1. UNIVERSAL SUPER-HEADER (No White Space) */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B0F0C]/95 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5 py-4 px-6 lg:px-16 flex items-center justify-between shadow-2xl shadow-black/5">
         <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-black shadow-2xl group-hover:rotate-12 transition-transform shadow-green-500/20">T</div>
               <div className="hidden sm:block">
                  <h1 className="text-3xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white leading-none">Turff</h1>
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.5em] leading-none mt-1 opacity-60">Marketplace</span>
               </div>
            </Link>

            <button onClick={() => setShowCities(true)} className="hidden md:flex items-center gap-4 px-8 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all">
               <MapPin className="w-5 h-5 text-primary" />
               <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{selectedCity}</span>
               <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
         </div>

         <div className="flex-1 max-w-2xl mx-16 hidden xl:block">
            <div className="relative group">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
               <input type="text" placeholder="Search venues, squad coaching, pro-gear stores..." className="w-full pl-20 pr-10 py-5 bg-gray-100 dark:bg-white/5 border-none rounded-[2rem] text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
         </div>

         <div className="flex items-center gap-10">
            <nav className="hidden lg:flex items-center gap-12">
               {['Arean', 'Coaching', 'Gear Shop', 'Leagues'].map(l => <Link key={l} href="/turfs" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">{l}</Link>)}
            </nav>
            
            <div className="flex items-center gap-6 pl-10 border-l border-gray-100 dark:border-white/5">
               <button className="hidden sm:flex relative p-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-all">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F0C]" />
               </button>
               {user ? (
                 <button onClick={() => setShowProfile(true)} className="h-14 w-14 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center shadow-2xl shadow-green-500/20 hover:scale-110 transition-all border-4 border-white dark:border-[#0B0F0C]">{user.name[0].toUpperCase()}</button>
               ) : (
                 <Link href="/login" className="flex items-center gap-4 px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all italic">LOGIN PORTAL <ChevronDown className="w-4 h-4" /></Link>
               )}
            </div>
         </div>
      </header>

      {/* 2. FULL-SCREEN WATERFALL HERO (Packed Content) */}
      <section className="relative h-[800px] w-full bg-black overflow-hidden shadow-2xl">
         <AnimatePresence mode="wait">
           <motion.div 
             key={bannerIdx} initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 1.2, ease: "circOut" }}
             className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FEATURED_ARENAS[bannerIdx].img})` }}
           >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-12 lg:p-24 flex flex-col items-start gap-10">
                 <div className="flex flex-wrap gap-4">
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className={`px-6 py-3 ${FEATURED_ARENAS[bannerIdx].badge} text-white text-[10px] font-black rounded-xl uppercase tracking-[0.4em] flex items-center gap-3 italic`}><Sparkles className="w-5 h-5" /> {FEATURED_ARENAS[bannerIdx].title}</motion.div>
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }} className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.4em] italic leading-none">{FEATURED_ARENAS[bannerIdx].tag}</motion.div>
                 </div>
                 <motion.h2 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-8xl lg:text-[12rem] font-black text-white italic tracking-tighter leading-[0.8] uppercase max-w-7xl">
                   {FEATURED_ARENAS[bannerIdx].venue.split('|')[0]}
                 </motion.h2>
                 <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center gap-10">
                    <Link href="/turfs" className="px-16 py-7 bg-white text-black text-xs font-black rounded-[2.5rem] uppercase tracking-[0.3em] shadow-2xl hover:scale-110 active:scale-95 transition-all italic flex items-center gap-4">EXPLORE ARENA <ArrowRight className="w-6 h-6" /></Link>
                    <div className="h-12 w-px bg-white/20 hidden md:block" />
                    <div className="flex items-center gap-6">
                       <div className="flex -space-x-4">
                          {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-gray-800 flex items-center justify-center text-[10px] font-black text-white">U</div>)}
                       </div>
                       <div className="text-[10px] font-black text-white uppercase tracking-widest opacity-80 leading-none">1.2k+ Sessions <br /> Booked Recently</div>
                    </div>
                 </motion.div>
              </div>
           </motion.div>
         </AnimatePresence>
         
         <div className="absolute top-1/2 -translate-y-1/2 right-12 flex flex-col gap-6">
            {FEATURED_ARENAS.map((_, i) => (
               <button key={i} onClick={() => setBannerIdx(i)} className={`w-1.5 transition-all rounded-full group ${i === bannerIdx ? 'h-24 bg-primary' : 'h-6 bg-white/20 hover:bg-white/40'}`}>
                  <span className="absolute -left-20 opacity-0 group-hover:opacity-100 text-[10px] font-black text-white rotate-90 pb-2">0{i+1}</span>
               </button>
            ))}
         </div>
      </section>

      {/* 3. DENSE SPORT SELECTOR BAR (No Space Remaining) */}
      <section className="bg-gray-50 dark:bg-white/5 py-16 border-b border-gray-100 dark:border-white/5">
         <div className="max-w-[1700px] mx-auto px-6 lg:px-16">
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">ELITE SPORTS DOMAINS</h3>
               <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all">VIEW ALL CATEGORIES</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-8">
               {SPORTS.map(s => (
                  <button key={s.name} className="flex flex-col items-center gap-6 group">
                     <div className="w-full aspect-square rounded-[2rem] bg-white dark:bg-[#1A241D] border-2 border-transparent group-hover:border-primary/20 flex items-center justify-center text-4xl shadow-sm transition-all group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/10">
                        {s.icon}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-all">{s.name}</span>
                  </button>
               ))}
            </div>
         </div>
      </section>

      {/* 4. HIGH-DENSITY MARKETPLACE FEED (Filling Every Inch) */}
      <main className="max-w-[1800px] mx-auto px-6 lg:px-16 py-32">
         <div className="flex items-end justify-between mb-24">
            <div className="space-y-6">
               <h2 className="text-6xl lg:text-9xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-[0.85] uppercase">ACTIVE <br /> ARENAS.</h2>
               <div className="flex items-center gap-6">
                  <div className="flex h-4 w-4 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-black text-primary uppercase tracking-[0.5em] italic">Live Availability Engine Activated in {selectedCity.toUpperCase()}</span>
               </div>
            </div>
            <div className="flex flex-col items-end gap-6 text-right">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose max-w-xs opacity-60">Real-time slot synchronization with venue concierge systems. Immediate secure booking protocols applied.</p>
               <div className="flex p-2 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <button className="px-6 py-3 bg-white dark:bg-gray-900 text-primary text-[10px] font-black rounded-xl shadow-lg shadow-black/5 uppercase tracking-widest">NEAR ME</button>
                  <button className="px-6 py-3 text-gray-400 text-[10px] font-black hover:text-gray-900 dark:hover:text-white uppercase tracking-widest">TOP RATED</button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-10">
            {loading ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[550px] bg-gray-100 dark:bg-white/5 rounded-[4rem] animate-pulse" />
            )) : turfs.map(t => (
               <div key={t.id} className="group relative bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 overflow-hidden transition-all flex flex-col h-full hover:-translate-y-4 hover:shadow-[0_60px_100px_rgba(0,0,0,0.08)] duration-500">
                  <div className="h-72 relative overflow-hidden">
                     <img src={`https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop`} alt={t.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                     <div className="absolute top-10 right-10 flex flex-col gap-2">
                        <div className="h-16 w-16 rounded-3xl bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center font-black text-primary shadow-2xl border border-white/20">
                           <span className="text-xl leading-none">4.9</span>
                           <span className="text-[8px] opacity-40 uppercase tracking-tighter">Rating</span>
                        </div>
                     </div>
                     <div className="absolute bottom-10 left-10 flex flex-wrap gap-3">
                        <span className="px-5 py-2 bg-emerald-500 text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-2xl flex items-center gap-2"><BadgeCheck className="w-3 h-3" /> VERIFIED</span>
                        <span className="px-5 py-2 bg-black/70 backdrop-blur-md text-white border border-white/20 text-[9px] font-black rounded-xl uppercase tracking-widest">{t.sport_type.toUpperCase()}</span>
                     </div>
                  </div>
                  <div className="p-12 flex-1 flex flex-col justify-between space-y-12">
                     <div className="space-y-6">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors italic line-clamp-2">{t.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">
                           <MapPin className="w-4 h-4 text-primary" /> {t.location}
                        </div>
                     </div>
                     
                     <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">STARTING AT</div>
                              <div className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter">₹{Number(t.price_per_slot).toFixed(0)}</div>
                           </div>
                           <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all"><Zap className="w-5 h-5 fill-current" /></div>
                        </div>
                        <Link href={`/turfs/${t.id}`} className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-[2rem] uppercase tracking-widest shadow-2xl hover:scale-[1.03] active:scale-95 transition-all italic text-center">SECURE SLOT</Link>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* 5. ELITE SPLIT-FARE MODULE (Waterfall Anchor) */}
         <section className="mt-60 grid lg:grid-cols-2 gap-24 items-center px-12 relative">
            <div className="space-y-12">
               <motion.span whileHover={{ scale: 1.1 }} className="px-10 py-4 bg-primary text-white text-[11px] font-black rounded-[1.5rem] uppercase tracking-[0.5em] inline-block italic shadow-2xl shadow-green-500/20">GAME CHANGING FEATURE</motion.span>
               <h2 className="text-8xl lg:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase text-gray-900 dark:text-white">DIVIDE <br /> & CONQUER.</h2>
               <p className="text-3xl font-medium text-gray-500 leading-tight italic max-w-2xl">Our algorithmic SPLIT-PAY engine allows you to book the turf and automatically distribute the fee across your squad. Focus on the goals, we'll handle the accounting.</p>
               
               <div className="grid gap-8 pt-10 border-t border-gray-100 dark:border-white/5">
                  {[
                    { title: "SQUAD SYNC", sub: "Invite friends via WhatsApp instantly", icon: MessageCircle },
                    { title: "ESCROW SECURE", sub: "Payment stays safe until kickoff", icon: Shield },
                    { title: "AUTO RECONCILE", sub: "Real-time payment tracking per player", icon: Navigation }
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-8 group cursor-pointer">
                       <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white shadow-sm transition-all"><f.icon className="w-8 h-8" /></div>
                       <div>
                          <div className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-primary">{f.title}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest opacity-60 mt-1">{f.sub}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="aspect-[4/5] rounded-[6rem] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden group shadow-[0_100px_200px_rgba(34,197,94,0.1)]">
                  <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               {/* Floating Credit Card Mockup */}
               <motion.div animate={{ y: [0, -40, 0], rotate: [-10, -5, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-10 -right-20 w-[450px] aspect-[1.6/1] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-12 text-white border-8 border-white dark:border-[#0B0F0C] shadow-[0_80px_160px_rgba(0,0,0,0.5)] flex flex-col justify-between hidden 2xl:flex overflow-hidden group">
                  <div className="flex items-center justify-between relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">Turff Payment Protocol</span>
                     <Zap className="w-12 h-12 text-primary" />
                  </div>
                  <div className="relative z-10">
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Split Reference</div>
                     <div className="text-4xl font-black italic tracking-widest mb-10">ARENA_77X_QK</div>
                     <div className="flex items-center justify-between">
                        <div className="text-3xl font-black italic">₹1,200.00</div>
                        <div className="px-6 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl text-[8px] font-black uppercase tracking-widest">EXECUTING...</div>
                     </div>
                  </div>
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary opacity-[0.05] rounded-full blur-[80px]" />
               </motion.div>
            </div>
         </section>

         {/* 6. TURFF SHOP & EQUIPMENT MEGA-BANNER (No Space Remaining) */}
         <section className="mt-60 bg-gray-900 dark:bg-white rounded-[7rem] p-24 text-white dark:text-gray-900 overflow-hidden relative group">
            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <label className="text-xs font-black text-primary uppercase tracking-[0.6em] italic block">CURATED PRO EQUIPMENT</label>
                  <h2 className="text-8xl lg:text-[12rem] font-black italic tracking-tighter leading-[0.8] uppercase">THE PRO <br /> STORE.</h2>
                  <p className="text-3xl font-medium opacity-60 leading-tight italic max-w-xl">Don't just show up, suit up. Explore high-performance gear specifically curated for Turff athletes.</p>
                  <div className="flex items-center gap-10 pt-16">
                     <Link href="/turfs" className="px-16 py-7 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-black rounded-[2.5rem] uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all italic">ENTER VAULT</Link>
                     <p className="text-[10px] font-black uppercase tracking-widest leading-loose opacity-40 max-w-[200px]">SAME-DAY DELIVERY TO ANY ARENA ACROSS INDIA.</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-8 relative">
                  {[
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop"
                  ].map((img, i) => (
                    <motion.div key={i} whileHover={{ y: -20 }} className="aspect-[3/4] rounded-[4rem] overflow-hidden border border-white/10 dark:border-gray-900 shadow-2xl group/img">
                       <img src={img} className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-[2s]" />
                    </motion.div>
                  ))}
               </div>
            </div>
            <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none transition-all group-hover:scale-110 duration-[5s]">
               <Store className="w-[1000px] h-[1000px]" />
            </div>
         </section>

         {/* 7. PARTNERSHIP WATERFALL (Closing the Page) */}
         <section className="mt-60 grid lg:grid-cols-2 gap-24 items-center px-12">
            <div className="relative order-2 lg:order-1">
               <div className="grid grid-cols-2 gap-8 ring-8 ring-gray-100 dark:ring-white/5 rounded-[6rem] p-12 bg-white dark:bg-[#0B0F0C]">
                  {[
                    { val: "2,400+", lab: "ARENAS HOSTED" },
                    { val: "1.2M", lab: "HOURS BOOKED" },
                    { val: "₹1.4Cr", lab: "OWNER REVENUE" },
                    { val: "100%", lab: "SECURE PAYOUTS" }
                  ].map((s, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-[3.5rem] p-12 text-center group hover:bg-primary transition-all shadow-xl">
                       <div className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter mb-4 group-hover:text-white transition-colors">{s.val}</div>
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white/80 transition-colors">{s.lab}</div>
                    </div>
                  ))}
               </div>
               <div className="absolute -bottom-10 -left-10 p-12 bg-primary rounded-[3rem] shadow-2xl shadow-green-500/30 text-white animate-bounce">
                  <TrendingUp className="w-12 h-12" />
               </div>
            </div>
            <div className="space-y-12 order-1 lg:order-2">
               <label className="text-xs font-black text-primary uppercase tracking-[0.5em] italic">FOR ARENA OWNERS</label>
               <h2 className="text-8xl lg:text-[11rem] font-black italic tracking-tighter leading-[0.85] uppercase text-gray-900 dark:text-white">HOST THE <br /> FUTURE.</h2>
               <p className="text-3xl font-medium text-gray-500 leading-tight italic">Digitize your sports facility and join the elite ranks of professional venue hosts. From real-time scheduling to direct player engagement, Turff is your command center.</p>
               <div className="flex items-center gap-10 pt-12">
                  <Link href="/register?role=owner" className="px-16 py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-[2.5rem] uppercase tracking-[0.3em] shadow-2xl hover:scale-110 active:scale-95 transition-all italic">LIST YOUR VENUE</Link>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.4em] transition-all cursor-pointer">
                     FULL PROTOCOL DOCS <ArrowRight className="w-6 h-6" />
                  </div>
               </div>
            </div>
         </section>

      </main>

      {/* 8. MODAL SYSTEMS (City Selection) */}
      <AnimatePresence>
        {showCities && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCities(false)} className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="fixed inset-0 m-auto w-[1100px] h-fit bg-white dark:bg-[#0B0F0C] z-[110] rounded-[7rem] p-32 shadow-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-24 px-4">
                   <h3 className="text-6xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Global Discovery DOMAIN</h3>
                   <button onClick={() => setShowCities(false)} className="p-8 rounded-[2rem] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><ChevronDown className="w-10 h-10 rotate-90" /></button>
                </div>
                
                <div className="relative mb-24 cursor-none"><Search className="absolute left-12 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-400" /><input type="text" placeholder="Search major sports metropolitan zones..." className="w-full pl-28 pr-12 py-12 bg-gray-100 dark:bg-white/5 border-none rounded-[4rem] text-lg font-black uppercase tracking-[0.3em] outline-none focus:ring-8 focus:ring-primary/10 transition-all placeholder:text-gray-300" /></div>
                
                <div className="grid grid-cols-3 gap-12">
                  {CITIES.map(c => (
                    <button key={c} onClick={() => { setSelectedCity(c); setShowCities(false); }} className={`p-16 rounded-[4.5rem] flex flex-col items-center gap-10 transition-all border-4 ${selectedCity === c ? 'bg-primary/5 border-primary text-primary shadow-[0_40px_80px_rgba(34,197,94,0.1)] scale-110' : 'bg-gray-50 dark:bg-white/2 border-transparent hover:border-gray-200'}`}>
                       <div className="text-6xl">🏟️</div>
                       <div className="text-[12px] font-black uppercase tracking-[0.3em] italic">{c}</div>
                    </button>
                  ))}
               </div>
               <div className="mt-24 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] opacity-40">More ports coming online every 24 hours.</p>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 9. PROFILE SIDEBAR SYSTEM */}
      <AnimatePresence>
         {showProfile && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100]" />
              <motion.div initial={{ x: 600 }} animate={{ x: 0 }} exit={{ x: 600 }} transition={{ type: "spring", damping: 35 }} className="fixed right-0 top-0 h-full w-[600px] bg-white dark:bg-[#0B0F0C] z-[110] shadow-[-100px_0_200px_rgba(0,0,0,0.15)] p-20 overflow-y-auto no-scrollbar border-l border-gray-100 dark:border-white/5">
                 <div className="flex items-center justify-between mb-24">
                    <button onClick={() => setShowProfile(false)} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-all"><ChevronDown className="w-8 h-8 -rotate-90" /></button>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Command Profile</span>
                 </div>
                 {user && (
                    <div className="space-y-24">
                       <div className="flex items-center gap-10">
                          <div className="w-32 h-32 rounded-[3.5rem] bg-primary text-white flex items-center justify-center text-5xl font-black shadow-[0_40px_80px_rgba(34,197,94,0.2)] border-8 border-white dark:border-[#0B0F0C]">{user.name[0].toUpperCase()}</div>
                          <div className="space-y-2">
                             <h3 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">{user.name}</h3>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">{user.role} RANK</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">ID: {user.id?.slice(0, 8)}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="grid gap-6">
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4 pl-4">Tactical Operations</div>
                           <Link href={`/dashboard/${user.role}`} className="flex items-center justify-between p-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[3.5rem] shadow-2xl hover:scale-105 transition-all group">
                              <div className="flex items-center gap-6">
                                 <LayoutDashboard className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                                 <div className="text-left">
                                    <div className="text-[11px] font-black uppercase tracking-widest italic leading-none">Control Center</div>
                                    <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">Manage all active parameters</div>
                                 </div>
                              </div>
                              <ArrowRight className="w-7 h-7" />
                           </Link>
                           <Link href="/bookings" className="flex items-center justify-between p-10 bg-gray-50 dark:bg-white/5 rounded-[3.5rem] hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-100 dark:hover:border-white/5 transition-all group">
                              <div className="flex items-center gap-6">
                                 <Calendar className="w-8 h-8 text-primary/50 group-hover:text-primary transition-colors" />
                                 <div className="text-left">
                                    <div className="text-[11px] font-black uppercase tracking-widest italic leading-none text-gray-900 dark:text-white">Match History</div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review tactical data logs</div>
                                 </div>
                              </div>
                              <ArrowRight className="w-6 h-6 text-gray-300" />
                           </Link>
                           <button onClick={logout} className="w-full flex items-center justify-center gap-6 p-10 hover:bg-red-500/5 text-red-500 rounded-[3.5rem] font-black uppercase tracking-[0.3em] text-[10px] transition-all border border-transparent hover:border-red-500/10 active:scale-95 italic">DETACH NETWORK COMMAND</button>
                       </div>

                       {/* Rewards Module */}
                       <div className="p-12 rounded-[5rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10 relative overflow-hidden group">
                          <div className="relative z-10 space-y-6">
                             <h4 className="text-3xl font-black text-amber-600 italic uppercase tracking-tighter">Elite Loyalty Protocol</h4>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-loose">EARN TURFF CREDITS ON EVERY SUCCESSFUL STRIKE. CONVERT CREDITS TO GEAR EXCLUSIVELY AT THE VAULT.</p>
                             <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-amber-600 italic tracking-tighter">1,250</span>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available <br /> Credits</span>
                             </div>
                             <Link href="/turfs" className="px-10 py-4 bg-amber-600/10 text-amber-600 border border-amber-600/20 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] inline-block hover:bg-amber-600 hover:text-white transition-all">VIEW REWARDS VAULT</Link>
                          </div>
                          <Trophy className="absolute -bottom-16 -right-16 w-56 h-56 text-amber-600 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                       </div>
                    </div>
                 )}
              </motion.div>
           </>
         )}
      </AnimatePresence>

    </div>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  )
}
