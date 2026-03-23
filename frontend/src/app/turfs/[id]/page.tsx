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
  ChevronLeft,
  TrendingUp,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { ReviewSystem } from "../../../components/ReviewSystem";

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
    <div className="space-y-16 pb-32">
      
      {/* 1. Elite Hero Showcase */}
      <section className="relative h-[450px] sm:h-[550px] rounded-[4.5rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.1)] group border border-gray-100 dark:border-white/5">
         <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[5s] group-hover:scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop')` }} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
         
         <Link href="/turfs" className="absolute top-12 left-12 p-6 p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[1.75rem] text-white hover:bg-white hover:text-black transition-all shadow-2xl group/back z-10">
            <ChevronLeft className="w-6 h-6 group-hover/back:-translate-x-2 transition-transform" />
         </Link>

         <div className="absolute bottom-20 left-16 right-16">
            <div className="flex flex-wrap gap-3 mb-8">
               <span className={`px-6 py-2.5 ${meta.accent} text-white text-[10px] font-black rounded-xl uppercase tracking-[0.3em] shadow-2xl italic border border-white/20`}>{meta.icon} EXCLUSIVE</span>
               <span className="px-6 py-2.5 bg-white/10 backdrop-blur-2xl text-white border border-white/20 text-[10px] font-black rounded-xl uppercase tracking-[0.3em] font-black italic">VERIFIED SECTOR</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter leading-none mb-6 uppercase">{turf.name}</h1>
            <div className="flex items-center gap-10 text-[10px] font-black text-white/60 uppercase tracking-[0.4em] italic">
               <span className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /> {turf.location}</span>
               <span className="hidden sm:block w-2 h-2 rounded-full bg-white/30" />
               <span className="flex items-center gap-3"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /> 4.9 · {120} REVIEWS</span>
            </div>
         </div>
      </section>

      {/* 2. Main Page Layout */}
      <div className="grid lg:grid-cols-12 gap-16 px-4">
         
         {/* LEFT COLUMN: THE ACTION (60%) */}
         <div className="lg:col-span-8 space-y-20">
            <CalendarBooking
               turfId={turf.id}
               turfName={turf.name}
               turfOwnerId={turf.owner_id}
               pricePerSlot={Number(turf.price_per_slot)}
               slots={slots}
               location={turf.location}
            />

            {/* Intelligence Feed */}
            <ReviewSystem turfId={turf.id} />
         </div>

         {/* RIGHT COLUMN: THE INFO (40%) */}
         <div className="lg:col-span-4 space-y-12">
            
            <div className="bg-white dark:bg-[#121A14] rounded-[4rem] p-12 border border-gray-100 dark:border-white/5 shadow-2xl space-y-12">
               <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6 italic">Venue Context</h4>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none mb-8">THE {turf.name.split(' ')[0].toUpperCase()} PROTOCOL</h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose italic underline decoration-primary/20 decoration-4 underline-offset-8">
                     {turf.description || "PREMIUM SECTOR EQUIPPED WITH PRO-GRADE DRAINAGE AND HIGH-INDEX FLOODLIGHTING FOR OVERNIGHT MATCH EXECUTION."}
                  </p>
               </div>

               {/* Dynamic Pricing Logic Indicator */}
               <div className="p-8 bg-amber-500/5 dark:bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 space-y-4 group">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-amber-500 font-black italic text-xs tracking-tighter uppercase underline decoration-2 underline-offset-4">
                        <TrendingUp className="w-5 h-5" /> PEAK PRICING ACTIVE
                     </div>
                     <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">WEEKEND SURGE +15%</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose italic opacity-60">RATES ARE DYNAMICALLY ADJUSTED BASED ON SECTOR DEMAND TRENDS AND REGIONAL MATCH FREQUENCY.</p>
               </div>

               {/* Amenities */}
               <div className="space-y-6 pt-12 border-t border-gray-100 dark:border-white/5">
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 italic">Platform Inclusions</div>
                  <div className="grid grid-cols-2 gap-6">
                     {AMENITIES.map((a, i) => (
                       <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-primary/20 transition-all group">
                          <a.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">{a.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Static Map Section */}
               <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner h-[300px]">
                  <TurfMap locationName={turf.location} turfName={turf.name} />
               </div>
            </div>

            {/* House Rules */}
            <div className="bg-gray-50 dark:bg-white/2 rounded-[4rem] p-12 border border-gray-100 dark:border-white/5 space-y-10">
               <h4 className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter uppercase flex items-center gap-4">
                  <Info className="w-6 h-6 text-primary" /> SITE PROTOCOLS
               </h4>
               <ul className="space-y-8">
                  {[
                    { label: "Sync-Up", sub: "Arrive 15m prior to kickoff", icon: Clock },
                    { label: "Asset Policy", sub: "Refundable until 12h before", icon: ShieldCheck },
                    { label: "Execution", sub: "Proper match gear mandatory", icon: Activity },
                    { label: "Social Index", sub: "Positive Fair-play required", icon: Users }
                  ].map((r, i) => (
                    <li key={i} className="flex items-center gap-6 p-5 rounded-3xl bg-white dark:bg-[#1A241D] border border-gray-100 dark:border-white/5 group shadow-sm">
                       <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors"><r.icon className="w-6 h-6" /></div>
                       <div>
                          <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest italic">{r.label}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60 leading-none">{r.sub}</div>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <button className="w-full py-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[3rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:scale-105 transition-all border border-transparent italic">
               <Share2 className="w-6 h-6" /> BROADCAST SECTOR
            </button>
         </div>
      </div>

      {/* 3. Recommended Pool */}
      <section className="space-y-16 mt-32 border-t border-gray-100 dark:border-white/5 pt-32">
         <div className="flex items-end justify-between px-6">
            <div className="space-y-4">
               <h3 className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Similar Arenas</h3>
               <div className="flex items-center gap-6 text-[10px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">
                  SECTORS MATCHED TO YOUR DISCOVERY INDEX
               </div>
            </div>
            <Link href="/turfs" className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-4 italic group underline underline-offset-8 decoration-2">EXPLORE ALL <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" /></Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1,2,3,4].map(i => (
              <Link key={i} href="/turfs" className="group bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl hover:-translate-y-4 hover:shadow-[0_80px_160px_rgba(0,0,0,0.1)] transition-all">
                 <div className="h-56 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3s]" />
                    <div className="absolute top-8 right-8 px-6 py-3 bg-white/95 dark:bg-black/95 backdrop-blur-3xl rounded-[1.25rem] font-black text-primary text-[10px] shadow-2xl transition-transform group-hover:rotate-12 border border-white/20">★ 4.9 ({120})</div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                 </div>
                 <div className="p-10 space-y-6">
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">Sector Alpha-{i} Elite</h4>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> PUNE, MH</div>
                       <div className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">₹1200</div>
                    </div>
                 </div>
              </Link>
            ))}
         </div>
      </section>
    </div>
  );
}
