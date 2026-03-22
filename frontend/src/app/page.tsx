"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  Star,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";

const STATS = [
  { value: "500+", label: "Verified Turfs", icon: <TrendingUp className="w-5 h-5 text-green-500" /> },
  { value: "12K+", label: "Active Players", icon: <Users className="w-5 h-5 text-blue-500" /> },
  { value: "4.9★", label: "App Rating", icon: <Star className="w-5 h-5 text-amber-500" /> },
  { value: "24/7", label: "Instant Booking", icon: <Zap className="w-5 h-5 text-purple-500" /> },
];

const FEATURES = [
  { icon: <Calendar />, title: "Live Calendar", desc: "Real-time slot availability with instant visual feedback.", color: "from-green-500/20 to-emerald-500/5", textColor: "text-green-600" },
  { icon: <Shield />, title: "Secure Pay", desc: "Multiple payment options with end-to-end encryption.", color: "from-blue-500/20 to-blue-600/5", textColor: "text-blue-600" },
  { icon: <MapPin />, title: "Smart Maps", desc: "Find turfs near you with integrated geolocation.", color: "from-orange-500/20 to-amber-500/5", textColor: "text-orange-600" },
  { icon: <Activity />, title: "Performance", desc: "Track your game history and improve your stats over time.", color: "from-purple-500/20 to-violet-500/5", textColor: "text-purple-600" },
  { icon: <Zap />, title: "Instant Access", desc: "No more waiting for calls. Book and play in seconds.", color: "from-yellow-500/20 to-amber-400/5", textColor: "text-yellow-600" },
  { icon: <Users />, title: "Community", desc: "Join local leagues and find players at your skill level.", color: "from-pink-500/20 to-rose-500/5", textColor: "text-pink-600" },
];

const SPORTS = [
  { name: "Football", icon: "⚽", count: "180+ Slots", color: "bg-green-500/10 dark:bg-green-500/5 hover:bg-green-500/20" },
  { name: "Cricket", icon: "🏏", count: "120+ Slots", color: "bg-amber-500/10 dark:bg-amber-500/5 hover:bg-amber-500/20" },
  { name: "Badminton", icon: "🏸", count: "90+ Slots", color: "bg-blue-500/10 dark:bg-blue-500/5 hover:bg-blue-500/20" },
  { name: "Tennis", icon: "🎾", count: "60+ Slots", color: "bg-orange-500/10 dark:bg-orange-500/5 hover:bg-orange-500/20" },
];

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

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-[3rem] bg-gradient-to-br from-gray-950 via-[#071a0e] to-[#0a2e16] text-white">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-green-500/10 rounded-full blur-[120px]" 
        />
        
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-6 py-2 text-sm font-black tracking-widest uppercase text-green-400"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            The Future of Sports Booking
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-8">
            Game On. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 italic">
              Anytime, Anywhere.
            </span>
          </h1>

          <p className="mt-8 mx-auto max-w-2xl text-xl md:text-2xl text-white/60 font-medium leading-relaxed mb-12">
            The premium platform for booking sports turfs. <br className="hidden md:block" />
            Discover 500+ venues with real-time availability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/turfs" className="group w-full sm:w-auto h-16 px-10 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-green-500/30 flex items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-green-500/50">
              Explore Venues
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/register" className="group w-full sm:w-auto h-16 px-10 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-white/20">
              Join the League
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[10%] top-[20%] text-6xl opacity-20 hidden md:block select-none">⚽</motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute left-[15%] bottom-[20%] text-5xl opacity-20 hidden md:block select-none">🏸</motion.div>
        <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute right-[15%] bottom-[15%] text-7xl opacity-10 hidden md:block select-none">🏏</motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {STATS.map((stat) => (
          <motion.div 
            key={stat.label}
            variants={itemVariants}
            className="group glass-effect rounded-[2.5rem] p-8 text-center border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all cursor-default"
          >
            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="text-4xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors">{stat.value}</div>
            <div className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* Sports Categories */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-primary font-black uppercase text-xs tracking-widest mb-2 block">Categories</span>
            <h2 className="text-4xl font-black tracking-tight">Choice of Champions</h2>
          </div>
          <Link href="/turfs" className="text-primary font-black flex items-center gap-2 hover:gap-3 transition-all">
            Browse All Sports <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SPORTS.map((sport) => (
            <Link key={sport.name} href={`/turfs?sport_type=${sport.name.toLowerCase()}`}>
              <motion.div 
                whileHover={{ y: -10 }}
                className={`${sport.color} rounded-[2.5rem] p-10 text-center transition-all group`}
              >
                <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-500">
                  {sport.icon}
                </div>
                <div className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{sport.name}</div>
                <div className="text-sm font-bold opacity-60 uppercase tracking-widest">{sport.count}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 dark:bg-white/[0.02] rounded-[4rem] px-8 py-24 md:p-24 overflow-hidden relative">
        <div className="relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Experience Premium</h2>
            <p className="text-gray-500 font-medium text-lg">Every feature is designed to make your sporting experience seamless and professional.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-white/5 hover:shadow-2xl hover:shadow-primary/5 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 ${feature.textColor}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-[4rem] bg-primary px-8 py-20 text-center text-white"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" 
          />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <Trophy className="w-16 h-16 mx-auto mb-8 text-white/50" />
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">Ready to Dominate?</h2>
            <p className="text-white/80 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 12,000+ athletes who book their victory on Turff. <br />
              Free accounts available for players and venue owners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="w-full sm:w-auto px-12 py-5 bg-white text-primary font-black rounded-[2rem] shadow-xl transition-all hover:scale-105">
                Create Free Account
              </Link>
              <Link href="/turfs" className="w-full sm:w-auto px-12 py-5 border-2 border-white text-white font-black rounded-[2rem] transition-all hover:bg-white hover:text-primary">
                Explore Venues
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
