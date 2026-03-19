"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "../../components/RequireAuth";
import { useAuth } from "../../components/AuthProvider";
import { apiFetch } from "../../lib/api";
import { notify } from "../../lib/toast";

type BookingListItem = {
  id: string;
  turf_name?: string;
  location?: string;
  sport_type?: string;
  players: number;
  total_price: string;
  payment_status: "pending" | "success" | "failed";
  start_time: string;
  end_time: string;
};

export default function BookingClient() {
  const sp = useSearchParams();
  const bookingId = sp.get("booking_id");
  const { token } = useAuth();

  const [booking, setBooking] = useState<BookingListItem | null>(null);
  const [players, setPlayers] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token || !bookingId) return;
      setError(null);
      const res = await apiFetch<BookingListItem[]>("/api/bookings", { token });
      if (!res.ok) {
        if (!cancelled) {
          setError(res.error.message);
          notify.error(res.error.message);
        }
        return;
      }
      const b = res.data.find((x) => x.id === bookingId) ?? null;
      if (!cancelled) {
        setBooking(b);
        if (b) setPlayers(b.players);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, bookingId]);

  const totalPrice = booking ? Number(booking.total_price) : 0;
  const costPerPlayer = useMemo(() => {
    if (!players || players <= 0) return 0;
    return totalPrice / players;
  }, [totalPrice, players]);

  return (
    <RequireAuth roles={["customer"]}>
      <div className="grid gap-5">
        <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
          <div className="text-sm font-semibold">Booking</div>
          <div className="mt-1 text-sm text-black/70 dark:text-white/70">
            Review details, split cost, and complete payment.
          </div>
        </div>

        {!bookingId ? (
          <div className="rounded-3xl border border-black/5 bg-[color:var(--card)] p-6 text-sm text-black/70 shadow-sm dark:border-white/10 dark:text-white/70">
            Missing <span className="font-mono">booking_id</span> in URL.
          </div>
        ) : !booking ? (
          <div className="rounded-3xl border border-black/5 bg-[color:var(--card)] p-6 text-sm text-black/70 shadow-sm dark:border-white/10 dark:text-white/70">
            {error ? error : "Loading booking..."}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
              <div className="text-sm font-semibold">Summary</div>
              <div className="mt-3 grid gap-2 text-sm">
                <Row label="Turf" value={booking.turf_name ?? "—"} />
                <Row label="Location" value={booking.location ?? "—"} />
                <Row label="Sport" value={booking.sport_type ?? "—"} />
                <Row
                  label="Slot"
                  value={`${new Date(booking.start_time).toLocaleString()} — ${new Date(booking.end_time).toLocaleTimeString()}`}
                />
                <Row
                  label="Total price"
                  value={`₹${Number(booking.total_price).toFixed(0)}`}
                />
                <Row label="Payment" value={booking.payment_status} />
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
              <div className="text-sm font-semibold">Cost split calculator</div>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-black/70 dark:text-white/70">
                    Number of players
                  </span>
                  <input
                    value={players}
                    onChange={(e) => setPlayers(Number(e.target.value))}
                    type="number"
                    min={1}
                    max={50}
                      className="h-11 rounded-xl border border-black/10 bg-white/60 px-4 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500/60 focus:border-green-600/40 dark:border-white/15 dark:bg-black/20"
                  />
                </label>

                <div className="rounded-2xl bg-[color:var(--muted)] px-4 py-3 text-sm">
                  <div className="text-xs font-semibold text-black/60 dark:text-white/60">
                    Cost per player
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    ₹{costPerPlayer.toFixed(0)}
                  </div>
                </div>

                {booking.payment_status !== "success" ? (
                  <div className="mt-1 grid gap-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={async () => {
                        if (!token) return;
                        setLoading(true);
                        setError(null);
                        try {
                          await new Promise((r) => setTimeout(r, 900));
                          const res = await apiFetch("/api/payments", {
                            method: "POST",
                            token,
                            body: {
                              booking_id: booking.id,
                              payment_type: "online",
                              payment_status: "success",
                            },
                          });
                          if (!res.ok) {
                            setError(res.error.message);
                            notify.error(res.error.message);
                            return;
                          }
                          setBooking({ ...booking, payment_status: "success" });
                          notify.success("Payment successful.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--primary)] px-4 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-xl hover:bg-green-700 disabled:opacity-60"
                    >
                      {loading ? "Processing..." : "Pay online (mock)"}
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={async () => {
                        if (!token) return;
                        setLoading(true);
                        setError(null);
                        try {
                          const res = await apiFetch("/api/payments", {
                            method: "POST",
                            token,
                            body: {
                              booking_id: booking.id,
                              payment_type: "offline",
                              payment_status: "pending",
                            },
                          });
                          if (!res.ok) {
                            setError(res.error.message);
                            notify.error(res.error.message);
                            return;
                          }
                          setBooking({ ...booking, payment_status: "pending" });
                          notify.success("Marked as pay-at-venue.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white/60 px-4 text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-xl hover:bg-white/80 dark:border-white/15 dark:bg-black/20 dark:hover:bg-black/30 disabled:opacity-60"
                    >
                      Pay at venue (offline)
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 rounded-2xl bg-[color:var(--muted)] px-4 py-3 text-sm font-semibold">
                    Payment completed.
                  </div>
                )}

                {error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-xs font-semibold text-black/60 dark:text-white/60">
        {props.label}
      </div>
      <div className="text-right text-sm font-semibold">{props.value}</div>
    </div>
  );
}

