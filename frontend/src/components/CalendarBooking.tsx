"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { apiFetch } from "../lib/api";
import { notify } from "../lib/toast";
import { BookingModal } from "./BookingModal";
import { PaymentSuccess } from "./PaymentSuccess";

type Slot = {
  id: string;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "blocked";
};

type BookingResult = {
  id: string;
  turf_id: string;
  slot_id: string;
  players: number;
  total_price: string;
  payment_status: "pending" | "success" | "failed";
  booking_date: string;
};

type PaymentResult = { id: string; payment_status: string };

export function CalendarBooking(props: {
  turfId: string;
  turfName: string;
  turfOwnerId?: string;
  pricePerSlot: number;
  slots: Slot[];
  location: string;
}) {
  const router = useRouter();
  const { token, user } = useAuth();

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Pay modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingResult | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  // Success
  const [successOpen, setSuccessOpen] = useState(false);
  const [successSlotTime, setSuccessSlotTime] = useState("");

  // Owner slot creation
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotCreating, setSlotCreating] = useState(false);

  // Local copy of slots for optimistic updates
  const [slots, setSlots] = useState<Slot[]>(props.slots);

  const selected = useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [slots, selectedSlotId],
  );

  const canBook = user?.role === "customer";
  const canManageSlots =
    user?.role === "owner" && props.turfOwnerId && user.id === props.turfOwnerId;

  const events = useMemo<EventInput[]>(() => {
    return slots.map((s) => ({
      id: s.id,
      start: s.start_time,
      end: s.end_time,
      title: s.status === "available" ? "✅ Available" : s.status === "booked" ? "🔴 Booked" : "⛔ Blocked",
      classNames: [
        "turff-event",
        s.status === "available" ? "turff-event-available" :
        s.status === "booked"    ? "turff-event-booked" : "turff-event-blocked",
      ],
      extendedProps: { status: s.status },
    }));
  }, [slots]);

  function handleEventClick(info: EventClickArg) {
    const slot = slots.find((s) => s.id === info.event.id);
    if (!slot) return;

    if (slot.status !== "available") {
      notify.info(
        slot.status === "booked" ? "This slot is already booked." : "This slot is blocked."
      );
      return;
    }

    if (!user) {
      notify.info("Please log in to book a slot.");
      router.push("/login");
      return;
    }

    if (!canBook) {
      notify.info("Only customers can book slots.");
      return;
    }

    setSelectedSlotId(info.event.id);
    setModalOpen(true);
  }

  async function handleConfirmBooking(players: number) {
    if (!token || !selectedSlotId || !selected) return;
    setBookingLoading(true);
    try {
      const res = await apiFetch<BookingResult>("/api/bookings", {
        method: "POST",
        token,
        body: {
          turf_id: props.turfId,
          slot_id: selectedSlotId,
          players,
        },
      });

      if (!res.ok) {
        notify.error(res.error.message);
        return;
      }

      const booking = res.data;
      setCreatedBooking(booking);
      setModalOpen(false);

      // Optimistically mark slot as booked
      setSlots((prev) =>
        prev.map((s) => s.id === selectedSlotId ? { ...s, status: "booked" } : s)
      );

      // Show payment modal
      setPayModalOpen(true);
    } finally {
      setBookingLoading(false);
    }
  }

  async function handlePay(type: "online" | "offline") {
    if (!token || !createdBooking) return;
    setPayLoading(true);
    try {
      if (type === "online") await new Promise((r) => setTimeout(r, 900)); // simulate

      const res = await apiFetch<PaymentResult>("/api/payments", {
        method: "POST",
        token,
        body: {
          booking_id: createdBooking.id,
          payment_type: type,
          payment_status: type === "online" ? "success" : "pending",
        },
      });

      if (!res.ok) {
        notify.error(res.error.message);
        return;
      }

      setPayModalOpen(false);

      const slot = slots.find((s) => s.id === createdBooking.slot_id);
      const slotTimeStr = slot
        ? `${new Date(slot.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })} – ${new Date(slot.end_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
        : "";

      setSuccessSlotTime(slotTimeStr);
      setSuccessOpen(true);
    } finally {
      setPayLoading(false);
    }
  }

  async function handleBlockToggle(slotId: string) {
    if (!token) return;
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;
    const newStatus = slot.status === "blocked" ? "available" : "blocked";
    const res = await apiFetch(`/api/slots/${slotId}`, {
      method: "PATCH",
      token,
      body: { status: newStatus },
    });
    if (!res.ok) { notify.error(res.error.message); return; }
    setSlots((prev) => prev.map((s) => s.id === slotId ? { ...s, status: newStatus } : s));
    notify.success(newStatus === "blocked" ? "Slot blocked." : "Slot unblocked.");
  }

  async function handleCreateSlot() {
    if (!token || !slotStart || !slotEnd) return;
    setSlotCreating(true);
    try {
      const res = await apiFetch<Slot>(`/api/turfs/${props.turfId}/slots`, {
        method: "POST",
        token,
        body: { start_time: slotStart, end_time: slotEnd },
      });
      if (!res.ok) { notify.error(res.error.message); return; }
      setSlots((prev) => [...prev, res.data]);
      setSlotStart("");
      setSlotEnd("");
      notify.success("Slot created! ✅");
    } finally {
      setSlotCreating(false);
    }
  }

  const inputCls = "h-10 rounded-xl border border-black/10 bg-white/60 px-3 text-sm outline-none transition focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 dark:border-white/15 dark:bg-black/20";

  return (
    <>
      <div className="grid gap-4">
        {/* ── Calendar card ── */}
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/30">
          <div className="border-b border-black/5 px-5 py-3 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-black">📅 Select a Time Slot</div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-green-500/30 border border-green-500/40" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-red-500/25 border border-red-400/40" />
                Booked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-slate-400/25 border border-slate-400/40" />
                Blocked
              </span>
            </div>
          </div>

          <div className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              slotMinTime="06:00:00"
              slotMaxTime="23:00:00"
              allDaySlot={false}
              nowIndicator
              weekNumbers={false}
            />
          </div>
        </div>

        {/* ── Owner Tools ── */}
        {canManageSlots && (
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
            <div className="text-sm font-black mb-4">🔧 Manage Slots</div>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Create slot */}
              <div className="rounded-xl border border-black/8 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <div className="text-xs font-bold mb-3 text-black/60 dark:text-white/50">➕ Create New Slot</div>
                <div className="grid gap-2">
                  <div>
                    <label className="text-xs text-black/50 dark:text-white/40 mb-1 block">Start Time</label>
                    <input type="datetime-local" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} className={inputCls + " w-full"} />
                  </div>
                  <div>
                    <label className="text-xs text-black/50 dark:text-white/40 mb-1 block">End Time</label>
                    <input type="datetime-local" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} className={inputCls + " w-full"} />
                  </div>
                  <button
                    type="button"
                    disabled={!slotStart || !slotEnd || slotCreating}
                    onClick={handleCreateSlot}
                    className="btn-primary h-10 rounded-xl text-sm disabled:opacity-60"
                  >
                    {slotCreating ? "Creating…" : "Create Slot"}
                  </button>
                </div>
              </div>

              {/* Block/Unblock */}
              <div className="rounded-xl border border-black/8 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                <div className="text-xs font-bold mb-3 text-black/60 dark:text-white/50">🔒 Block / Unblock Slots</div>
                <div className="grid gap-2 max-h-52 overflow-y-auto">
                  {slots.filter((s) => s.status !== "booked").length === 0 ? (
                    <p className="text-xs text-black/40 dark:text-white/35">No manageable slots.</p>
                  ) : (
                    slots
                      .filter((s) => s.status !== "booked")
                      .map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-sm dark:bg-black/30">
                          <span className="font-semibold text-black/70 dark:text-white/65">
                            {new Date(s.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBlockToggle(s.id)}
                            className={[
                              "rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                              s.status === "blocked"
                                ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-300"
                                : "bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-300",
                            ].join(" ")}
                          >
                            {s.status === "blocked" ? "Unblock" : "Block"}
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Not logged in hint ── */}
        {!user && (
          <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/8 p-4">
            <span className="text-2xl">🔐</span>
            <div>
              <div className="text-sm font-bold">Login to book a slot</div>
              <div className="text-xs text-black/55 dark:text-white/50 mt-0.5">
                Click on any green &ldquo;Available&rdquo; slot or{" "}
                <a href="/login" className="font-bold text-[color:var(--primary)] hover:underline">Login here →</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Booking Confirmation Modal ── */}
      <BookingModal
        open={modalOpen}
        slot={selected}
        turfName={props.turfName}
        location={props.location}
        sportType="football"
        pricePerSlot={props.pricePerSlot}
        onConfirm={handleConfirmBooking}
        onClose={() => setModalOpen(false)}
        loading={bookingLoading}
      />

      {/* ── Payment Modal ── */}
      {payModalOpen && createdBooking && (
        <div className="modal-backdrop items-end sm:items-center" onClick={() => setPayModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle sm:hidden" />
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-green-500/15 to-emerald-500/8 text-3xl">
                💳
              </div>
              <div className="text-lg font-black">Complete Payment</div>
              <div className="text-sm text-black/55 dark:text-white/50 mt-1">
                Booking saved! Choose payment method.
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-500/8 to-transparent border border-green-500/12 p-4 mb-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-black/55 dark:text-white/45">{props.turfName}</span>
                <span className="font-black text-[color:var(--primary)]">₹{Number(createdBooking.total_price).toFixed(0)}</span>
              </div>
              <div className="text-xs text-black/45 dark:text-white/35">
                {createdBooking.players} players
              </div>
            </div>

            <div className="grid gap-2 mb-4">
              <button
                type="button"
                disabled={payLoading}
                onClick={() => handlePay("online")}
                className="btn-primary h-13 rounded-2xl py-4 font-black text-sm"
              >
                {payLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>💳</span> Pay Online — ₹{Number(createdBooking.total_price).toFixed(0)}
                  </span>
                )}
              </button>
              <button
                type="button"
                disabled={payLoading}
                onClick={() => handlePay("offline")}
                className="btn-ghost h-13 rounded-2xl py-4 font-bold text-sm"
              >
                🏪 Pay at Venue (Cash)
              </button>
            </div>
            <p className="text-center text-xs text-black/35 dark:text-white/30">
              Secure payment. Slot reserved for 10 minutes.
            </p>
          </div>
        </div>
      )}

      {/* ── Payment Success Overlay ── */}
      <PaymentSuccess
        open={successOpen}
        turfName={props.turfName}
        slotTime={successSlotTime}
        amount={createdBooking ? Number(createdBooking.total_price) : props.pricePerSlot}
        onClose={() => { setSuccessOpen(false); router.push("/bookings"); }}
      />
    </>
  );
}
