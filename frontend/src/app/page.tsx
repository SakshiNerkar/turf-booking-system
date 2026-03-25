"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, Search, Star, ArrowRight, CheckCircle2, 
  Calendar, ShieldCheck, Clock, Users, Trophy, 
  Zap, CreditCard, Activity, ChevronRight
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/components/Navbar";

type TurfItem = { 
  id: string; 
  name: string; 
  location_city: string; 
  sports_available: string; 
  price_weekday: number; 
  rating?: number; 
  images?: { url: string; is_primary: boolean }[];
};

export default function LandingPage() {
  const [featuredTurfs, setFeaturedTurfs] = useState<TurfItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7de62e1069ed?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover animate-slow-zoom blur-[2px]"
            alt="Stadium Background"
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

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-gray-50 dark:bg-primary/5 border-y border-border">
        <div className="container-premium space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight">Why Play With <span className="text-primary italic">Us?</span></h2>
            <p className="text-gray-500 font-medium">We've built the ultimate ecosystem for athletes and arena owners.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Instant Booking", desc: "No phone calls. No waiting. Just pick a slot and play." },
              { icon: ShieldCheck, title: "Verified Turfs", desc: "Every arena on our platform is hand-picked and verified." },
              { icon: CreditCard, title: "Secure Payments", desc: "Integrated UPI and Card payments with instant confirmation." },
              { icon: Clock, title: "Flexi-Slots", desc: "Need 60, 90, or 120 mins? We support dynamic durations." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center space-y-4 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                  <f.icon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black uppercase italic tracking-tight">{f.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-24 container-premium">
        <div className="flex flex-col items-center text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tight">The <span className="text-primary italic">Protocol</span></h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-[0.3em]">Three simple steps to the pitch</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative w-full">
            {/* Connectors (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-border z-0" />

            {[
              { step: "01", icon: Search, label: "Search", sub: "Find arenas near you" },
              { step: "02", icon: Calendar, label: "Select Slot", sub: "Choose time & date" },
              { step: "03", icon: Trophy, label: "Win / Play", sub: "Show up and dominate" }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-card border-4 border-primary rounded-full flex items-center justify-center shadow-xl group hover:scale-110 transition-transform">
                  <s.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-black italic">
                    {s.step}
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-black uppercase italic tracking-tight">{s.label}</h4>
                  <p className="text-sm text-gray-500 font-medium">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & STATS */}
      <section className="py-20 border-t border-border bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container-premium text-center space-y-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Field-Tested Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { v: "10K+", l: "Athletes Joined" },
                 { v: "500+", l: "Premium Arenas" },
                 { v: "50K+", l: "Matches Played" },
                 { v: "4.9/5", l: "User Rating" }
               ].map((s,i) => (
                  <div key={i} className="space-y-2 group">
                     <div className="text-4xl md:text-6xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{s.v}</div>
                     <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{s.l}</div>
                  </div>
               ))}
            </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 container-premium pb-32">
        <div className="bg-gradient-to-br from-gray-900 to-black dark:from-[#121A14] dark:to-black rounded-[2.5rem] p-12 md:p-24 text-white text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1574629810360-7de62e1069ed?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tight drop-shadow-xl">
              Ready To <br /> <span className="text-primary italic">Play?</span>
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto font-medium leading-relaxed">
              Don't wait for the weekend. Book your favorite turf now and dominate the field. Your next match is just 3 clicks away.
            </p>
            <div className="pt-6">
              <Link href="/turfs" className="btn-premium-primary !rounded-2xl mx-auto shadow-2xl shadow-primary/30">
                Book Your Game Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white dark:bg-[#0B0F0C] border-t border-border py-16">
        <div className="container-premium">
          <div className="grid md:grid-cols-4 gap-12 md:gap-8">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <span className="text-3xl font-black text-foreground italic uppercase tracking-tighter">
                TURFF<span className="text-primary italic">.</span>
              </span>
              <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
                The world's most advanced turf booking ecosystem. Bridging the gap between elite arenas and professional athletes.
              </p>
            </div>
            <div className="space-y-6">
              <h5 className="font-black uppercase italic tracking-widest text-xs">For Players</h5>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><Link href="/turfs" className="hover:text-primary transition-colors">Explore Venues</Link></li>
                <li><Link href="/bookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Favorite Hubs</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
               <h5 className="font-black uppercase italic tracking-widest text-xs">For Owners</h5>
               <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><Link href="/register?role=owner" className="hover:text-primary transition-colors">List Your Arena</Link></li>
                <li><Link href="/dashboard/owner" className="hover:text-primary transition-colors">Owner Dashboard</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Partner Program</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-16 mt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-gray-400">© 2026 TURFF ARENA TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">
               <Link href="/" className="hover:text-primary transition-colors">Security</Link>
               <Link href="/" className="hover:text-primary transition-colors">Privacy</Link>
               <Link href="/" className="hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
