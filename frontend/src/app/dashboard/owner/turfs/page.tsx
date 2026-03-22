"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonCard } from "../../../components/Skeletons";
import { Plus, MapPin, Edit3, Trash2, Calendar, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type Turf = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
};

const SPORT_ICONS: Record<string, string> = { 
  football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾" 
};

export default function OwnerTurfsPage() {
  const { token, user } = useAuth();
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTurfs() {
    if (!token || !user) return;
    setLoading(true);
    const res = await apiFetch<Turf[]>(`/api/turfs?owner_id=${user.id}&limit=50`);
    if (res.ok) setTurfs(res.data);
    setLoading(false);
  }

  useEffect(() => { loadTurfs(); }, [token, user]);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Active <span className="text-primary italic">Venues</span></h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Status and performance overview for all your facilities.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={loadTurfs} className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-primary transition-all"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
           <Link href="/dashboard/owner/add" className="px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/10 hover:scale-105 active:scale-100 transition-all flex items-center gap-2 text-sm uppercase tracking-widest"><Plus className="w-5 h-5" /> NEW TURF</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />) : 
         !turfs?.length ? <div className="sm:col-span-2 lg:col-span-3 py-20 text-center text-gray-400 font-medium">No turfs yet. Let's add your first!</div> :
         turfs.map(t => (
           <motion.div 
             key={t.id} 
             whileHover={{ y: -8 }}
             className="group relative bg-white dark:bg-[#121A14] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8 transition-all overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><Plus className="w-40 h-40" /></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-4xl shadow-sm border border-transparent group-hover:border-primary/10 transition-all">
                      {SPORT_ICONS[t.sport_type?.toLowerCase()] ?? "🏟️"}
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5 shadow-sm"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/10 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors">{t.name}</h3>
                   <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest"><MapPin className="w-3.5 h-3.5" /> {t.location}</div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5">
                   <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">per slot</div>
                      <div className="text-2xl font-black text-gray-900 dark:text-white">₹{Number(t.price_per_slot).toFixed(0)}</div>
                   </div>
                   <Link href={`/turfs/${t.id}`} className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-2xl shadow-lg hover:scale-105 active:scale-100 transition-all flex items-center gap-2">
                       <Calendar className="w-4 h-4" /> SLOTS
                   </Link>
                </div>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
