"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Slot = {
  id: string;
  start_time: string;
  end_time: string;
};

type Props = {
  open: boolean;
  slot: Slot | null;
  turfName: string;
  location: string;
  sportType: string;
  pricePerSlot: number;
  onConfirm: (players: number) => void;
  onClose: () => void;
  loading?: boolean;
};

const SPORT_ICONS: Record<string, string> = {
  football: "⚽", cricket: "🏏", badminton: "🏸", tennis: "🎾",
};

function fmt(dt: string) {
  const d = new Date(dt);
  return d.toLocaleString("en-IN", {
    weekday: "short", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function fmtTime(dt: string) {
  return new Date(dt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function durationMins(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

export function BookingModal({
  open, slot, turfName, location, sportType, pricePerSlot,
  onConfirm, onClose, loading = false,
}: Props) {
  const [players, setPlayers] = useState(5);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !slot) return null;

  const icon = SPORT_ICONS[sportType?.toLowerCase()] ?? "🏟️";
  const duration = durationMins(slot.start_time, slot.end_time);
  const perPlayer = players > 0 ? (pricePerSlot / players).toFixed(0) : 0;

  const modal = (
    <div
      ref={overlayRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Booking Confirmation"
    >
      <div className="modal-content">
        {/* Pull handle */}
        <div className="modal-handle sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-green-500/15 to-green-600/8 text-2xl">
              {icon}
            </div>
            <div>
              <div className="font-black text-base leading-tight">{turfName}</div>
              <div className="text-xs text-black/55 dark:text-white/50 mt-0.5 flex items-center gap-1">
                <span>📍</span>{location}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 grid h-8 w-8 place-items-center rounded-xl bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black dark:bg-white/10 dark:text-white/60 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Slot info card */}
        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/15 p-4 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/35 mb-1">Date</div>
              <div className="text-sm font-bold">
                {new Date(slot.start_time).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
              </div>
            </div>
            <div className="border-x border-green-500/15">
              <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/35 mb-1">Time</div>
              <div className="text-sm font-bold">
                {fmtTime(slot.start_time)} – {fmtTime(slot.end_time)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/35 mb-1">Duration</div>
              <div className="text-sm font-bold">{duration} min</div>
            </div>
          </div>
        </div>

        {/* Players selector */}
        <div className="mb-4">
          <label className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold">Number of Players</span>
            <span className="text-xs text-black/50 dark:text-white/40">₹{perPlayer}/player</span>
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-black/8 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setPlayers(p => Math.max(1, p - 1))}
              disabled={players <= 1}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-black/10 bg-white text-lg font-bold shadow-sm transition-all hover:bg-green-50 hover:border-green-500/30 disabled:opacity-30 dark:bg-black/40 dark:hover:bg-green-950/30"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-black text-[color:var(--primary)]">{players}</div>
              <div className="text-xs text-black/45 dark:text-white/40">players</div>
            </div>
            <button
              type="button"
              onClick={() => setPlayers(p => Math.min(22, p + 1))}
              disabled={players >= 22}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-black/10 bg-white text-lg font-bold shadow-sm transition-all hover:bg-green-50 hover:border-green-500/30 disabled:opacity-30 dark:bg-black/40 dark:hover:bg-green-950/30"
            >
              +
            </button>
          </div>

          {/* Quick presets */}
          <div className="mt-2 flex gap-2">
            {[5, 10, 11, 22].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayers(n)}
                className={[
                  "flex-1 rounded-xl py-1.5 text-xs font-bold transition-all",
                  players === n
                    ? "bg-green-600/15 text-green-700 dark:text-green-300"
                    : "bg-black/5 text-black/55 hover:bg-black/10 dark:bg-white/10 dark:text-white/55",
                ].join(" ")}
              >
                {n}v{n > 11 ? (n === 22 ? "22" : n) : n}
              </button>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-black/8 dark:border-white/10">
          <div className="bg-black/[0.02] px-4 py-3 dark:bg-white/[0.02]">
            <div className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/35 mb-2">
              Price Summary
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/65 dark:text-white/60">Slot price</span>
                <span className="font-bold">₹{pricePerSlot}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/65 dark:text-white/60">Per player ({players})</span>
                <span className="font-bold">₹{perPlayer}</span>
              </div>
              <div className="my-1.5 border-t border-black/5 dark:border-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-black">Total</span>
                <span className="text-xl font-black text-[color:var(--primary)]">₹{pricePerSlot}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="mb-4 text-xs text-black/45 dark:text-white/35">
          ℹ️ You can complete payment after booking. Slot will be reserved for 10 minutes.
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1 rounded-2xl py-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(players)}
            disabled={loading}
            className="btn-primary flex-1 rounded-2xl py-3 text-sm font-black disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Booking…
              </span>
            ) : "Confirm Booking 🎉"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
