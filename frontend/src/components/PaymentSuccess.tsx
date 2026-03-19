"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  turfName: string;
  slotTime: string;
  amount: number;
  onClose: () => void;
};

// Deterministically generate confetti pieces
const CONFETTI_COLORS = [
  "#1a7a4a", "#00e676", "#ff6b35", "#ffd700", "#7c3aed", "#2563eb", "#ec4899",
];

function makeConfetti(n = 28) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i * 37 + 5) % 100}%`,
    size: 6 + (i % 5) * 2,
    delay: `${(i * 0.08).toFixed(2)}s`,
    duration: `${1.6 + (i % 6) * 0.25}s`,
    rotation: i * 40,
    shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "square" : "pill",
  }));
}

export function PaymentSuccess({ open, turfName, slotTime, amount, onClose }: Props) {
  const confetti = useMemo(() => makeConfetti(32), []);

  // Auto-close after 6s
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  const el = (
    <div
      className="modal-backdrop items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Confetti */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              top: "-20px",
              width: c.size,
              height: c.shape === "pill" ? c.size * 2.5 : c.size,
              background: c.color,
              borderRadius:
                c.shape === "circle" ? "50%" :
                c.shape === "pill"   ? "999px" : "2px",
              transform: `rotate(${c.rotation}deg)`,
              animationDelay: c.delay,
              animationDuration: c.duration,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="animate-modal relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-[#0d1a10]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400" />

        {/* Success icon with ripple */}
        <div className="relative mx-auto mb-6 h-24 w-24">
          {/* Ripple rings */}
          <div className="ripple-ring" style={{ animationDelay: "0.3s" }} />
          <div className="ripple-ring" style={{ animationDelay: "0.9s" }} />
          <div className="success-circle mx-auto">
            <svg viewBox="0 0 52 52" className="success-checkmark" style={{ animationDelay: "0.35s" }}>
              <polyline points="14,27 22,35 38,19" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-2xl font-black tracking-tight text-[#0a140c] dark:text-white mb-1">
          Booking Confirmed! 🎉
        </div>
        <div className="text-sm text-black/55 dark:text-white/50 mb-6">
          Your turf slot is reserved.
        </div>

        {/* Details card */}
        <div className="rounded-2xl bg-gradient-to-br from-green-500/8 to-green-600/4 border border-green-500/15 p-4 mb-6 text-left">
          <div className="grid gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-black/50 dark:text-white/40">Turf</span>
              <span className="text-sm font-bold text-right max-w-[160px] truncate">{turfName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-black/50 dark:text-white/40">Slot</span>
              <span className="text-sm font-bold">{slotTime}</span>
            </div>
            <div className="border-t border-green-500/10 pt-2.5 flex items-center justify-between">
              <span className="text-xs font-black text-black/50 dark:text-white/40">Amount Paid</span>
              <span className="text-xl font-black text-[color:var(--primary)]">₹{amount}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6 grid gap-2">
          {[
            { icon: "📩", text: "Booking receipt saved to your account" },
            { icon: "🏟️", text: "Show this confirmation at the turf" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] px-3 py-2.5 text-left">
              <span className="text-base shrink-0">{s.icon}</span>
              <span className="text-xs font-semibold text-black/65 dark:text-white/60">{s.text}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1 rounded-2xl py-3 text-sm"
          >
            Done
          </button>
          <button
            type="button"
            onClick={() => { onClose(); window.location.href = "/bookings"; }}
            className="btn-primary flex-1 rounded-2xl py-3 text-sm font-black"
          >
            View Bookings
          </button>
        </div>

        {/* Auto-close bar */}
        <div className="mt-4 h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            style={{ animation: "turffSlideLeft 6s linear both" }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-black/30 dark:text-white/25">Auto-closes in 6 seconds</p>
      </div>
    </div>
  );

  return createPortal(el, document.body);
}
