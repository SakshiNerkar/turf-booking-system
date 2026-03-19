"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { apiFetch } from "../lib/api";

type Slot = {
  id: string;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "blocked";
};

export function TurfBookingPanel(props: {
  turfId: string;
  slots: Slot[];
}) {
  const router = useRouter();
  const { token, user } = useAuth();
  const [selected, setSelected] = useState<Slot | null>(null);
  const [players, setPlayers] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canBook = user?.role === "customer";
  const slots = useMemo(
    () => props.slots.slice().sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [props.slots],
  );

  return (
    <section className="rounded-3xl border border-black/5 bg-[color:var(--card)] p-6 shadow-sm dark:border-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Available slots</div>
          <div className="mt-1 text-xs text-black/70 dark:text-white/70">
            Choose a slot to book. Booked/blocked slots are disabled.
          </div>
        </div>
        <div className="text-xs font-semibold text-black/60 dark:text-white/60">
          {canBook ? "Customer booking enabled" : "Login as customer to book"}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {slots.map((s) => {
          const disabled = s.status !== "available" || !canBook;
          return (
            <button
              key={s.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                setError(null);
                setSelected(s);
              }}
              className={[
                "rounded-2xl border p-4 text-left",
                disabled
                  ? "cursor-not-allowed border-black/5 bg-[color:var(--muted)] opacity-70 dark:border-white/10"
                  : "border-black/10 bg-transparent hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold">
                  {new Date(s.start_time).toLocaleString()}
                </div>
                <div
                  className={[
                    "rounded-full px-2 py-1 text-xs font-semibold",
                    s.status === "available"
                      ? "bg-[color:var(--muted)]"
                      : s.status === "booked"
                        ? "bg-red-500/10 text-red-700 dark:text-red-300"
                        : "bg-yellow-500/10 text-yellow-800 dark:text-yellow-200",
                  ].join(" ")}
                >
                  {s.status}
                </div>
              </div>
              <div className="mt-1 text-xs text-black/70 dark:text-white/70">
                Until {new Date(s.end_time).toLocaleTimeString()}
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-5 rounded-3xl border border-black/10 p-5 dark:border-white/15">
          <div className="text-sm font-semibold">Book this slot</div>
          <div className="mt-1 text-xs text-black/70 dark:text-white/70">
            {new Date(selected.start_time).toLocaleString()} —{" "}
            {new Date(selected.end_time).toLocaleTimeString()}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-black/70 dark:text-white/70">
                Players
              </span>
              <input
                value={players}
                onChange={(e) => setPlayers(Number(e.target.value))}
                type="number"
                min={1}
                max={50}
                className="h-11 rounded-2xl border border-black/10 bg-transparent px-4 text-sm outline-none focus:border-[color:var(--primary)] dark:border-white/15"
              />
            </label>
            <div className="grid gap-1">
              <span className="text-xs font-semibold text-black/70 dark:text-white/70">
                Cost split
              </span>
              <div className="grid h-11 place-items-center rounded-2xl border border-black/10 bg-[color:var(--muted)] text-sm font-semibold dark:border-white/15">
                Calculated at checkout
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (!token) {
                  router.push("/login");
                  return;
                }
                setLoading(true);
                setError(null);
                try {
                  const res = await apiFetch("/api/bookings", {
                    method: "POST",
                    token,
                    body: {
                      turf_id: props.turfId,
                      slot_id: selected.id,
                      players,
                    },
                  });
                  if (!res.ok) {
                    setError(res.error.message);
                    return;
                  }
                  router.push("/bookings");
                  router.refresh();
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[color:var(--secondary)] disabled:opacity-60"
            >
              {loading ? "Booking..." : "Confirm booking"}
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 px-4 text-sm font-semibold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

