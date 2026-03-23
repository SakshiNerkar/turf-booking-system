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
  Share2,
  ChevronLeft
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

const SPORT_META: Record<string, { icon: string; accent: string }> = {
  football:  { icon: "⚽", accent: "bg-green-500" },
  cricket:   { icon: "🏏", accent: "bg-amber-500" },
  badminton: { icon: "🏸", accent: "bg-blue-500" },
  tennis:    { icon: "🎾", accent: "bg-orange-500" },
};

const AMENITIES = [
  { icon: Droplets, label: "Mineral Water" },
  { icon: Car, label: "Parking" },
  { icon: Wifi, label: "Guest WiFi" },
  { icon: Coffee, label: "Snack Bar" },
  { icon: ShieldCheck, label: "Secure" },
  { icon: Trophy, label: "Rent Gear" }
];

export default async function TurfDetailsPage(props: { params: Promise<{ id: string }>; }) {
  const { id } = await props.params;

  let json: ApiResponse<TurfDetails>;
  try {
    const res = await fetch(`${API_BASE_URL}/api/turfs/${id}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    json = (await res.json()) as ApiResponse<TurfDetails>;
  } catch {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner shadow-black/5">🔌</div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 italic tracking-tighter">CONNECTION OFFLINE</h1>
        <p className="text-gray-400 font-bold text-sm uppercase mb-12 tracking-widest leading-loose">The central booking grid is currently decoupled from the main processor.</p>
        <Link href="/turfs" className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-green-500/20 uppercase tracking-widest text-xs">EXIT TO ARENAS</Link>
      </div>
    );
  }

  if (!json.ok) return <div className="p-10 bg-red-500/10 text-red-500 rounded-[3rem] font-black italic shadow-2xl">{json.error.message.toUpperCase()}</div>;

  const { turf, slots } = json.data;
  const meta = SPORT_META[turf.sport_type?.toLowerCase()] ?? { icon: "🏟️", accent: "bg-gray-500" };

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. Elite Hero Showcase (Khelomore Banner Style) */}
      <section className="relative h-[400px] sm:h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl group border border-gray-100 dark:border-white/5">
         <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[4s] group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop')` }} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
         
         <Link href="/turfs" className="absolute top-10 left-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white hover:text-black transition-all shadow-xl group/back">
            <ChevronLeft className="w-6 h-6 group-hover/back:-translate-x-1 transition-transform" />
         </Link>

         <div className="absolute bottom-16 left-12 right-12">
            <div className="flex flex-wrap gap-2 mb-6">
               <span className={`px-5 py-2 ${meta.accent} text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-2xl`}>{meta.icon} EXCLUSIVE</span>
               <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white border border-white/20 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] font-black">{turf.sport_type.toUpperCase()}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-4">{turf.name.toUpperCase()}</h1>
            <div className="flex items-center gap-6 text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
               <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {turf.location}</span>
               <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
               <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9 · 120+ REVIEWS</span>
            </div>
         </div>
      </section>

      {/* 2. Main Page Layout (Khelomore Architecture: Action Left, Info Right) */}
      <div className="grid lg:grid-cols-12 gap-12 px-2">
         
         {/* LEFT COLUMN: THE ACTION (60%) */}
         <div className="lg:col-span-8 space-y-12">
            {/* Slot Booking Engine */}
            <CalendarBooking
               turfId={turf.id}
               turfName={turf.name}
               turfOwnerId={turf.owner_id}
               pricePerSlot={Number(turf.price_per_slot)}
               slots={slots}
               location={turf.location}
            />
         </div>

         {/* RIGHT COLUMN: THE INFO (40%) */}
         <div className="lg:col-span-4 space-y-10">
            
            {/* Information Card */}
            <div className="bg-white dark:bg-[#121A14] rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl space-y-10">
               <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Venue Intel</h4>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none mb-6">INSIDE {turf.name.split(' ')[0].toUpperCase()}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose italic underline decoration-primary/20 decoration-2 underline-offset-8">
                     {turf.description || "Premium turf with world-class facilities and high-intensity floodlighting systems."}
                  </p>
               </div>

               {/* Amenities (Pills style like Khelomore) */}
               <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-white/5">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Facilities & Inclusions</div>
                  <div className="grid grid-cols-2 gap-4">
                     {AMENITIES.map((a, i) => (
                       <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all group">
                          <a.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">{a.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Static Map Section */}
               <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner h-[250px]">
                  <TurfMap locationName={turf.location} turfName={turf.name} />
               </div>
            </div>

            {/* House Rules (Senior Dev: Operational Clarity) */}
            <div className="bg-gray-50 dark:bg-white/2 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 space-y-8">
               <h4 className="text-sm font-black text-gray-900 dark:text-white italic tracking-tighter uppercase flex items-center gap-3">
                  <Info className="w-5 h-5 text-primary" /> SITE PROTOCOLS
               </h4>
               <ul className="space-y-6">
                  {[
                    { label: "Check-in", sub: "Arrive 10m before kickoff", icon: Clock },
                    { label: "Footwear", sub: "Studs permitted (Ag/Hg/Fg)", icon: Activity },
                    { label: "Policy", sub: "100% Refund before 24hrs", icon: ShieldCheck },
                    { label: "Community", sub: "Fair play mandatory", icon: Users }
                  ].map((r, i) => (
                    <li key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#1A241D] border border-gray-100 dark:border-white/5 group shadow-sm">
                       <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors"><r.icon className="w-5 h-5" /></div>
                       <div>
                          <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{r.label}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 opacity-60 leading-none">{r.sub}</div>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            {/* Strategic Value Card (Credit/Split) */}
            <div className="bg-primary rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-green-500/20">
               <div className="relative z-10">
                  <h4 className="text-xl font-black italic tracking-tighter mb-4">MATCH REWARDS</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-loose mb-8">Score match points on every booking and split the bill instantly with friends.</p>
                  <button className="px-8 py-3 bg-white text-primary text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl hover:scale-105 transition-all">ENABLE SPLIT PAY</button>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all"><Zap className="w-32 h-32" /></div>
            </div>

            <button className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all border border-transparent">
               <Share2 className="w-5 h-5" /> BROADCAST VENUE
            </button>
         </div>
      </div>
    </div>
  );
}
