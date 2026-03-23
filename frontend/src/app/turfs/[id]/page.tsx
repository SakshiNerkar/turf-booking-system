import Link from "next/link";
import { API_BASE_URL, type ApiResponse } from "../../../lib/api";
import { CalendarBooking } from "../../../components/CalendarBooking";
import { TurfMap } from "../../../components/TurfMap";
import { 
  Wifi, 
  Car, 
  Droplets, 
  ShieldCheck, 
  Info, 
  Clock, 
  CreditCard, 
  Users, 
  Star, 
  MapPin, 
  ArrowLeft,
  Zap,
  Coffee,
  Trophy,
  Activity,
  Share2
} from "lucide-react";

type Turf = {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  description: string | null;
  rating?: number;
};

type Slot = { id: string; start_time: string; end_time: string; status: "available" | "booked" | "blocked"; };
type TurfDetails = { turf: Turf; slots: Slot[] };

const SPORT_META: Record<string, { icon: string; gradient: string; accent: string }> = {
  football:  { icon: "⚽", gradient: "from-green-600 to-emerald-900", accent: "bg-green-500" },
  cricket:   { icon: "🏏", gradient: "from-amber-600 to-orange-900", accent: "bg-amber-500" },
  badminton: { icon: "🏸", gradient: "from-blue-600 to-indigo-900", accent: "bg-blue-500" },
  tennis:    { icon: "🎾", gradient: "from-orange-500 to-red-800", accent: "bg-orange-500" },
};

const AMENITIES = [
  { icon: Droplets, label: "Mineral Water" },
  { icon: Car, label: "Free Parking" },
  { icon: Wifi, label: "Guest WiFi" },
  { icon: Coffee, label: "Snack Bar" },
  { icon: ShieldCheck, label: "CCTV Secure" },
  { icon: Trophy, label: "Rental Gear" }
];

export default async function TurfDetailsPage(props: { params: Promise<{ id: string }>; }) {
  const { id } = await props.params;

  let json: ApiResponse<TurfDetails>;
  try {
    const res = await fetch(`${API_BASE_URL}/api/turfs/${id}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    json = (await res.json()) as ApiResponse<TurfDetails>;
  } catch {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">🔌</div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Connection Decoupled</h1>
        <p className="text-gray-500 mb-10">The central intelligence server is offline. Please initialize the backend.</p>
        <Link href="/turfs" className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/20">← EXIT TO ARENAS</Link>
      </div>
    );
  }

  if (!json.ok) return <div className="p-10 bg-red-500/10 text-red-500 rounded-3xl font-black">{json.error.message}</div>;

  const { turf, slots } = json.data;
  const meta = SPORT_META[turf.sport_type?.toLowerCase()] ?? { icon: "🏟️", gradient: "from-gray-700 to-gray-950", accent: "bg-gray-500" };
  const availableSlots = slots.filter(s => s.status === "available").length;

  return (
    <div className="space-y-10 pb-32">
      {/* 1. Elite Hero Showcase */}
      <section className="relative h-[450px] sm:h-[550px] rounded-[3.5rem] overflow-hidden shadow-2xl group">
         <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[2s]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop')` }} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
         
         <Link href="/turfs" className="absolute top-10 left-10 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white hover:text-black transition-all group/back">
            <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
         </Link>

         <div className="absolute bottom-16 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
               <div className="flex flex-wrap gap-2">
                  <span className={`px-5 py-2 ${meta.accent} text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl shadow-black/20`}>VERIFIED VENUE</span>
                  <span className="px-5 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-black rounded-xl uppercase tracking-widest">{turf.sport_type}</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none uppercase">{turf.name}</h1>
               <div className="flex items-center gap-4 text-sm font-bold text-white/70 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {turf.location}</span>
                  <span className="hidden sm:block opacity-30">|</span>
                  <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 (128 Reviews)</span>
               </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 text-center min-w-[200px] shadow-2xl">
               <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Hourly Investment</div>
               <div className="text-5xl font-black text-white tracking-tighter italic">₹{Number(turf.price_per_slot).toFixed(0)}</div>
               <div className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">{availableSlots} SLOTS LIVE</div>
            </div>
         </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
         {/* 2. Left Column: Booking & Details */}
         <div className="space-y-12">
            
            {/* Booking Interface */}
            <div className="bg-white dark:bg-[#121A14] rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden p-2">
               <CalendarBooking
                 turfId={turf.id}
                 turfName={turf.name}
                 turfOwnerId={turf.owner_id}
                 pricePerSlot={Number(turf.price_per_slot)}
                 slots={slots}
                 location={turf.location}
               />
            </div>

            {/* In-Depth Information (The "Insides") */}
            <div className="bg-gray-50 dark:bg-white/2 rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/5">
               <h3 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                  VENUE INTEL <span className="h-0.5 flex-1 bg-gray-200 dark:bg-white/10" />
               </h3>
               
               <div className="grid sm:grid-cols-2 gap-10 mb-16">
                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-primary uppercase tracking-widest">DESCRIPTION</h4>
                     <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                        {turf.description || "This premier facility features high-density monofilament artificial grass, professional floodlights, and FIA-spec boundary systems. Perfect for high-intensity matches and tactical training sessions."}
                     </p>
                  </div>
                  <div className="space-y-6">
                       <h4 className="text-sm font-black text-primary uppercase tracking-widest text-center sm:text-left">AMENITIES</h4>
                       <div className="grid grid-cols-2 gap-4">
                          {AMENITIES.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                               <a.icon className="w-5 h-5 text-primary" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">{a.label}</span>
                            </div>
                          ))}
                       </div>
                  </div>
               </div>

               {/* Points/Credits Integration (Image 3 logic) */}
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20"><Zap className="w-6 h-6" /></div>
                        <h4 className="text-lg font-black text-amber-600 uppercase tracking-tighter italic">TURFF CREDITS</h4>
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">EARN 10% CREDITS BACK ON THIS VENUE. USE THEM FOR FUTURE BOOKINGS OR SHOP AT OUR STORE.</p>
                  </div>
                  <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><CreditCard className="w-6 h-6" /></div>
                        <h4 className="text-lg font-black text-blue-600 uppercase tracking-tighter italic">SPLIT PAYMENT</h4>
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">BRING YOUR TRIBE. SPLIT THE FARE AUTOMATICALLY DURING CHECKOUT WITH JUST A PHONE NUMBER.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* 3. Right Column: Static Details & Rules */}
         <div className="space-y-8">
            {/* Map Integration */}
            <div className="rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl h-[300px]">
               <TurfMap locationName={turf.location} turfName={turf.name} />
            </div>

            {/* Venue Rules (Senior approach: high visibility) */}
            <div className="bg-gray-50 dark:bg-white/2 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 space-y-8">
               <h4 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-3">
                  <Info className="w-5 h-5 text-primary" /> HOUSE RULES
               </h4>
               <ul className="space-y-6">
                  {[
                    { label: "Check-in", sub: "Arrive 10m before kickoff", icon: Clock },
                    { label: "Footwear", sub: "Studs permitted (Ag/Hg)", icon: Activity },
                    { label: "Cancellation", sub: "100% refund before 24hrs", icon: ShieldCheck },
                    { label: "Community", sub: "Respect the referee/owner", icon: Users }
                  ].map((r, i) => (
                    <li key={i} className="flex items-center gap-5 group">
                       <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1A241D] flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shadow-sm focus:scale-110"><r.icon className="w-5 h-5" /></div>
                       <div>
                          <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{r.label}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">{r.sub}</div>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            {/* Quick Share */}
            <button className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all">
               <Share2 className="w-5 h-5" /> BROADCAST VENUE
            </button>
         </div>
      </div>
    </div>
  );
}
