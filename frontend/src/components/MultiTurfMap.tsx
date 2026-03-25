"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type TurfPoint = {
  id: string;
  name: string;
  location: string;
  price_per_slot: string;
  rating?: number;
};

// Nominatim geocoding (limited for demo - normally you'd have lat/lng in DB)
async function geocode(query: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", India")}&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data?.[0] ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
  } catch { return null; }
}

export function MultiTurfMap({ turfs }: { turfs: TurfPoint[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const L = (await import("leaflet")).default;
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
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add pins for each turf
      const pins = await Promise.all(turfs.slice(0, 10).map(async (t) => {
        const coords = await geocode(t.location);
        if (coords) {
          const marker = L.marker(coords).addTo(map);
          marker.bindPopup(`
            <div style="padding: 10px; font-family: sans-serif;">
              <h4 style="margin: 0 0 5px; font-weight: 800; font-size: 14px;">${t.name}</h4>
              <p style="margin: 0; font-size: 11px; color: #666;">${t.location}</p>
              <div style="margin-top: 8px; font-weight: 900; color: #2E7D32;">₹${t.price_per_slot}/hr</div>
              <a href="/turfs/${t.id}" style="display: block; margin-top: 10px; background: #2E7D32; color: white; text-align: center; padding: 5px; border-radius: 5px; text-decoration: none; font-size: 11px; font-weight: 800;">View Arena</a>
            </div>
          `);
          return coords;
        }
        return null;
      }));

      // Fit bounds to show all markers
      const validPins = pins.filter((p): p is [number, number] => p !== null);
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
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50 dark:bg-card">
           <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Plotting Arena Vectors...</p>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full z-0" />
    </div>
  );
}
