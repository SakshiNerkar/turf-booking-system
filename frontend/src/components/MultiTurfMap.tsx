"use client";

import { useEffect, useRef, useState } from "react";

type TurfPoint = {
  id: string;
  name: string;
  location_city: string;
  price_weekday: number;
  latitude?: number;
  longitude?: number;
};

export function MultiTurfMap({ turfs }: { turfs: TurfPoint[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const L = (await import("leaflet")).default;
      if (typeof window !== "undefined") {
        // Import leaflet css
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      
      if (cancelled || !mapRef.current) return;

      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [18.5204, 73.8567], // Pune default
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add pins for all provided turfs with coordinates
      const validPins: [number, number][] = [];
      
      turfs.forEach((t) => {
        if (t.latitude && t.longitude) {
          const coords: [number, number] = [Number(t.latitude), Number(t.longitude)];
          validPins.push(coords);
          
          const marker = L.marker(coords).addTo(map);
          marker.bindPopup(`
            <div style="padding: 12px; font-family: 'Inter', sans-serif; min-width: 180px;">
              <h4 style="margin: 0 0 6px; font-weight: 800; font-size: 15px; color: #1a1a1a; text-transform: uppercase; letter-spacing: -0.5px;">${t.name}</h4>
              <p style="margin: 0; font-size: 11px; color: #666; display: flex; align-items: center; gap: 6px;">📍 ${t.location_city}</p>
              <div style="margin-top: 12px; border-top: 1px solid #eee; padding-top: 12px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 950; color: #059669; font-size: 18px; letter-spacing: -1px;">₹${t.price_weekday}<small style="font-size: 10px; font-weight: 600; opacity: 0.6; margin-left: 2px;">/hr</small></span>
                <a href="/turfs/${t.id}" style="background: #059669; color: white; text-align: center; padding: 7px 14px; border-radius: 10px; text-decoration: none; font-size: 11px; font-weight: 800; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgb(5 150 105 / 0.1);">Details</a>
              </div>
            </div>
          `, { className: 'premium-map-popup' });
        }
      });

      // Fit bounds to show all markers
      if (validPins.length > 0) {
        map.fitBounds(L.latLngBounds(validPins), { padding: [50, 50] });
      }

      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [turfs]);

  return (
    <div className="relative w-full h-full group">
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-50/90 dark:bg-[#0B0F0C]/90 backdrop-blur-sm transition-opacity duration-500">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
           <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Initializing Arena Vectors...</div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full z-10 transition-transform duration-700 hover:scale-[1.01]" 
        style={{ borderRadius: 'inherit' }}
      />

      {/* OVERLAY INDICATOR */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
         <div className="px-4 py-2 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border shadow-soft flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Live Arena Grid</span>
         </div>
      </div>
    </div>
  );
}
