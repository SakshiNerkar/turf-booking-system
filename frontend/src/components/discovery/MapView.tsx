"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  Star, MapPin, Navigation, ArrowRight, Zap, Target, ShieldCheck, 
  Search, X, Globe, Map as MapIcon, Grid
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Fix Leaflet Default Icon Issue
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

type Turf = {
  id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  rating?: number;
  lat?: number;
  lng?: number;
};

// Mock fallback coords for demo (since real DB might not have them yet)
const getCoords = (id: string) => {
  const seed = parseInt(id.slice(0, 8), 16) || 0;
  return [18.5204 + (seed % 100) * 0.001, 73.8567 + (seed % 80) * 0.001] as [number, number];
};

export function MapView({ turfs, onClose }: { turfs: Turf[], onClose: () => void }) {
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const center: [number, number] = [18.5204, 73.8567]; // Default to Pune

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-[#0B0F0C] flex flex-col">
       
       {/* 1. MAP HEADER: DISCOVERY BAR */}
       <header className="h-24 bg-white/80 dark:bg-[#0B0F0C]/80 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5 px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:text-primary transition-all shadow-sm"><ArrowRight className="w-5 h-5 rotate-180" /></button>
             <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Global Sector Map</h2>
                <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.4em] opacity-60">Real-time node placement syncing ({turfs.length} total)</div>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="relative group hidden md:block">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-black group-focus-within:text-primary" />
                <input type="text" placeholder="Search this area protocol..." className="w-96 pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
             </div>
             <button onClick={onClose} className="flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all italic underline underline-offset-4"><Grid className="w-4 h-4" /> Switch to Grid</button>
          </div>
       </header>

       {/* 2. THE MAP ENGINE */}
       <div className="flex-1 relative">
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }} className="leaflet-custom-styles">
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            {turfs.map(t => (
              <Marker 
                key={t.id} 
                position={getCoords(t.id)} 
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedTurf(t)
                }}
              />
            ))}
            <MapRecenter selectedTurf={selectedTurf} />
          </MapContainer>

          {/* 3. TACTICAL PREVIEW OVERLAY */}
          <AnimatePresence>
            {selectedTurf && (
               <motion.div 
                initial={{ opacity: 0, y: 100, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 100, x: '-50%' }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[500px] z-[1000] p-6"
               >
                  <div className="bg-white dark:bg-[#121A14] rounded-[4rem] border-4 border-primary/20 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                     {/* Preview Content */}
                     <div className="flex gap-8 p-10">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl relative">
                           <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="px-5 py-2 bg-primary/10 text-primary text-[9px] font-black rounded-xl uppercase tracking-widest italic">{selectedTurf.sport_type} UNIT</span>
                              <button onClick={() => setSelectedTurf(null)} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                           </div>
                           <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{selectedTurf.name}</h4>
                           <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                              <MapPin className="w-4 h-4 text-primary" /> {selectedTurf.location}
                           </div>
                           <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                              <div className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">₹{Number(selectedTurf.price_per_slot).toFixed(0)}<span className="text-[10px] not-italic opacity-40">/hr</span></div>
                              <Link href={`/turfs/${selectedTurf.id}`} className="px-8 py-4 bg-primary text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-95 transition-all italic flex items-center gap-3">INITIALIZE <Target className="w-4 h-4" /></Link>
                           </div>
                        </div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-all duration-[3s] scale-150"><Zap className="w-72 h-72" /></div>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Map Controls Floating */}
          <div className="absolute top-10 right-10 z-[1000] flex flex-col gap-4">
             {[
               { icon: Navigation, label: 'MyLocation' },
               { icon: Globe, label: 'Zoom World' },
               { icon: ShieldCheck, label: 'Secure Zone' }
             ].map(c => (
               <button key={c.label} className="p-4 rounded-2xl bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/10 shadow-2xl text-gray-400 hover:text-primary transition-all group relative">
                  <c.icon className="w-5 h-5" />
                  <div className="absolute right-full mr-6 px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap italic">{c.label}</div>
               </button>
             ))}
          </div>
       </div>
    </div>
  );
}

function MapRecenter({ selectedTurf }: { selectedTurf: Turf | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedTurf) {
      map.setView(getCoords(selectedTurf.id), 15, { animate: true });
    }
  }, [selectedTurf, map]);
  return null;
}
