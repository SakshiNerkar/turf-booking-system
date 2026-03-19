"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  locationName: string;
  turfName: string;
};

// Nominatim geocoding (free OpenStreetMap API — no key needed)
async function geocode(query: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data?.[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch {
    return null;
  }
}

export function TurfMap({ locationName, turfName }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "found" | "fallback" | "error">("loading");
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Dynamic import — avoids SSR issues with Leaflet
      const L = (await import("leaflet")).default;
      // Leaflet CSS must be imported globally via next.config or layout.
      // Dynamic import of .css is not type-safe; CSS is loaded via leaflet's side effects.

      if (cancelled || !mapRef.current) return;

      // Fix default marker icon paths (Leaflet webpack issue)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Geocode the location
      let latlng: [number, number] | null = await geocode(locationName + ", India");
      if (!latlng) latlng = await geocode(locationName);

      if (cancelled) return;

      // Fallback to Mumbai center if geocode fails
      const fallback = !latlng;
      const center: [number, number] = latlng ?? [19.076, 72.877];
      if (fallback) setStatus("fallback");
      else { setStatus("found"); setCoords(center); }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current!, {
        center,
        zoom: fallback ? 11 : 15,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap tiles (free, no API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom green pin icon
      const greenIcon = L.divIcon({
        html: `
          <div style="
            width: 32px; height: 40px;
            position: relative; cursor: pointer;
          ">
            <div style="
              position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
              width: 28px; height: 28px;
              background: linear-gradient(135deg, #1a7a4a, #00c853);
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: translateX(-50%) rotate(-45deg);
              box-shadow: 0 3px 10px rgba(26,122,74,0.5);
            "></div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -42],
        className: "",
      });

      // Popup HTML
      const popupHtml = `
        <div style="padding: 12px 14px; min-width: 180px;">
          <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px; color: #0a140c;">
            🏟️ ${turfName}
          </div>
          <div style="font-size: 12px; color: #4b5563; display: flex; align-items: center; gap: 4px;">
            📍 ${locationName}
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: inline-flex; align-items: center; gap: 4px;
              margin-top: 8px; padding: 5px 10px;
              background: #1a7a4a; color: white;
              border-radius: 8px; font-size: 11px; font-weight: 700;
              text-decoration: none;
            "
          >
            Open in Google Maps →
          </a>
        </div>
      `;

      const marker = L.marker(center, { icon: greenIcon }).addTo(map);
      marker.bindPopup(popupHtml).openPopup();
    }

    init().catch(() => setStatus("error"));

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [locationName, turfName]);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md dark:border-white/10 dark:bg-black/30">
      {/* Map header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-green-500/10 text-base">📍</div>
          <div>
            <div className="text-sm font-bold">Location</div>
            <div className="text-xs text-black/55 dark:text-white/50">{locationName}</div>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + " " + turfName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-black/10 bg-white/60 px-3 text-xs font-bold text-black/70 transition-all hover:bg-black/5 dark:border-white/15 dark:bg-black/20 dark:text-white/70"
        >
          🗺️ Google Maps
        </a>
      </div>

      {/* Map container */}
      <div className="relative h-64 sm:h-80">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 z-10">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600" />
            <span className="text-xs font-semibold text-black/50">Loading map…</span>
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 z-10">
            <div className="text-3xl">🗺️</div>
            <span className="text-sm font-semibold text-red-600">Map unavailable</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-xl px-4 py-2 text-xs"
            >
              Open in Google Maps
            </a>
          </div>
        )}
        {status === "fallback" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white shadow">
            ⚠️ Approximate location shown
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" style={{ zIndex: 0 }} />
      </div>
    </div>
  );
}
