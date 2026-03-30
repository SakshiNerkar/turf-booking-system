"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Wifi, Car, Droplets, ShieldCheck, Info, Clock, 
  MapPin, ChevronLeft, Share2, Activity, Star,
  CheckCircle2, ChevronRight, RefreshCw
} from "lucide-react";
import { CalendarBooking } from "@/components/CalendarBooking";
import { ReviewSystem } from "@/components/ReviewSystem";
import { TurfMap } from "@/components/TurfMap";
import { apiFetch, type ApiResponse } from "@/lib/api";

type Turf = {
  id: string; owner_id: string; name: string; location: string;
  sport_type: string; price_per_slot: string; description: string | null;
  rating?: number; images?: string;
};

type Slot = { id: string; start_time: string; end_time: string; status: "available" | "booked" | "blocked"; };
type TurfDetails = { turf: Turf; slots: Slot[] };

const SPORT_META: Record<string, { icon: string; accent: string }> = {
  football:  { icon: "⚽", accent: "bg-green-600" },
  cricket:   { icon: "🏏", accent: "bg-amber-600" },
  badminton: { icon: "🏸", accent: "bg-blue-600" },
};

const AMENITIES = [
  { icon: Droplets, label: "Mineral Water" },
  { icon: Car, label: "Parking Space" },
  { icon: Wifi, label: "Fast WiFi" },
  { icon: ShieldCheck, label: "24/7 Security" },
];

export default function TurfDetailsPage({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = use(params);
  const [data, setData] = useState<TurfDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch<TurfDetails>(`/api/turfs/${id}`);
      setLoading(false);
      if (res.ok) {
        setData(res.data);
      } else {
        setError(res.error.message);
      }
    })();
  }, [id]);

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#060806]">
        <div className="flex flex-col items-center gap-6">
           <RefreshCw className="w-10 h-10 text-primary animate-spin opacity-40" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic">Synchronizing Arena Intelligence...</span>
        </div>
     </div>
  );

  if (error || !data) return (
    <div className="container-compact py-32 text-center flex flex-col items-center gap-6">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-3xl shadow-sm">Plug</div>
      <div className="space-y-2">
         <h1 className="text-3xl font-extrabold tracking-tight">System Offline</h1>
         <p className="text-sm font-medium text-gray-500 max-w-sm">{error || "Unable to fetch arena details."}</p>
      </div>
      <Link href="/turfs" className="btn-sports px-8">Return to Discovery</Link>
    </div>
  );

  const { turf, slots } = data;
  const meta = SPORT_META[turf.sport_type?.toLowerCase()] ?? { icon: "🏟️", accent: "bg-gray-600" };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0F0C] transition-colors duration-300 pb-24 md:pb-16 relative">

      <div className="container-compact py-6 md:py-10 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 capitalize">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <span>/</span>
           <Link href="/turfs" className="hover:text-primary transition-colors">Arenas</Link>
           <span>/</span>
           <span className="text-gray-900 dark:text-gray-100">{turf.name}</span>
        </div>

        {/* 1. PREMIUM HERO SHOWCASE */}
        <section className="relative h-72 md:h-96 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-premium border border-border bg-white dark:bg-card">
           <img 
              src={turf.images ? JSON.parse(turf.images)[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"} 
              className="absolute inset-0 w-full h-full object-cover"
              alt={turf.name}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
           
           <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
              <Link href="/turfs" className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-black shadow-sm transition-all border border-white/30 flex items-center justify-center">
                 <ChevronLeft className="w-5 h-5" />
              </Link>
           </div>

           {/* Mobile Action Triggers */}
           <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-red-500 shadow-sm transition-all border border-white/30">
                 <Activity className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-primary shadow-sm transition-all border border-white/30">
                 <Share2 className="w-5 h-5" />
              </button>
           </div>

           <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 w-full">
                 <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1.5 ${meta.accent} text-white text-[11px] font-bold rounded-lg uppercase tracking-widest shadow-sm flex items-center gap-2`}><ShieldCheck className="w-3.5 h-3.5" /> Verified Hub</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">{turf.name}</h1>
                 <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-white/80 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {turf.location}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    <span className="flex items-center gap-2 text-amber-400"><Star className="w-4 h-4 fill-amber-400" /> {turf.rating || '4.9'} Ratings</span>
                 </div>
              </div>
           </div>
        </section>

        {/* 2. MAIN LAYOUT (2 Columns) */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
           
           {/* LEFT: BOOKING ENGINE & REVIEWS */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Stepper Logic Indication */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-bold text-gray-400">
                 <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg flex gap-2 items-center flex-shrink-0"><span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">1</span> Flow</div>
                 <ChevronRight className="w-4 h-4" />
                 <div className="px-4 py-2 text-gray-500 flex gap-2 items-center flex-shrink-0"><span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 flex items-center justify-center text-[10px]">2</span> Select Time</div>
                 <ChevronRight className="w-4 h-4" />
                 <div className="px-4 py-2 text-gray-500 flex gap-2 items-center flex-shrink-0"><span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 flex items-center justify-center text-[10px]">3</span> Confirm Pay</div>
              </div>

              <CalendarBooking
                 turfId={turf.id}
                 turfName={turf.name}
                 turfOwnerId={turf.owner_id}
                 pricePerSlot={Number(turf.price_per_slot)}
                 slots={slots}
                 location={turf.location}
              />
              
              <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Verified Reviews</h3>
                 <ReviewSystem turfId={turf.id} />
              </div>
           </div>

           {/* RIGHT: INFO STRIP & TRUST SIGNALS */}
           <div className="lg:col-span-4 flex flex-col gap-8 hidden md:flex">
              
              <div className="card-compact p-8 space-y-8 sticky top-24">
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">About {turf.name}</h3>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                       {turf.description || "Premium regional arena equipped with pro-grade terrain and high-performance floodlighting. Hosted over 5,000 top-tier matches."}
                    </p>
                 </div>

                 <div className="pt-6 border-t border-border/50">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Core Amenities</h4>
                    <div className="grid grid-cols-2 gap-3">
                       {AMENITIES.map((a, i) => (
                         <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-[#0B0F0C] border border-border rounded-xl">
                            <a.icon className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{a.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Trust Protocols */}
                 <div className="pt-6 border-t border-border/50 space-y-4">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Platform Guarantees</h4>
                    <ul className="space-y-4">
                       {[
                         { label: "Instant Synchronization", icon: Clock },
                         { label: "Secure Payment End-to-End", icon: ShieldCheck },
                         { label: "Refundable up to 12h prior", icon: CheckCircle2 }
                       ].map((r, i) => (
                         <li key={i} className="flex gap-4 items-start text-xs font-semibold text-gray-600 dark:text-gray-400">
                            <r.icon className="w-4 h-4 text-gray-400 mt-0.5" />
                            {r.label}
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div className="h-48 rounded-2xl overflow-hidden border border-border shadow-sm">
                    <TurfMap locationName={turf.location} turfName={turf.name} />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 glass-panel border-t shadow-sticky z-40 px-4 py-4 flex items-center justify-between pb-safe">
         <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Cost / HR</div>
            <div className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">₹{turf.price_per_slot}</div>
         </div>
         <button className="btn-sports px-8 shadow-md">Select Time</button>
      </div>
    </div>
  );
}
