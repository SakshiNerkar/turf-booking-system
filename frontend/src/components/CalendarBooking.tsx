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
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Info, CheckCircle2, Lock, MousePointer2, ChevronRight, LayoutGrid, Calendar as CalendarIcon, CreditCard, RefreshCw } from "lucide-react";

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

  const [view, setView] = useState<"grid" | "calendar">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingResult | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successSlotTime, setSuccessSlotTime] = useState("");

  const [slots, setSlots] = useState<Slot[]>(props.slots);

  const selected = useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [slots, selectedSlotId],
  );

  const canBook = user?.role === "customer";

  const events = useMemo<EventInput[]>(() => {
    return slots.map((s) => ({
      id: s.id,
      start: s.start_time,
      end: s.end_time,
      title: s.status === "available" ? "Available" : s.status === "booked" ? "Booked" : "Blocked",
      classNames: [
        "turff-event",
        s.status === "available" ? "turff-event-available" :
        s.status === "booked"    ? "turff-event-booked" : "turff-event-blocked",
      ],
      extendedProps: { status: s.status },
    }));
  }, [slots]);

  function handleSlotClick(id: string) {
    const slot = slots.find((s) => s.id === id);
    if (!slot || slot.status !== "available") return;

    if (!user) {
      notify.info("Please log in to book a slot.");
      router.push("/login");
      return;
    }

    if (!canBook) {
      notify.info("Only customers can book slots.");
      return;
    }

    setSelectedSlotId(id);
    setModalOpen(true);
  }

  async function handleConfirmBooking(players: number) {
    if (!token || !selectedSlotId || !selected) return;
    setBookingLoading(true);
    const res = await apiFetch<BookingResult>("/api/bookings", {
      method: "POST",
      token,
      body: { turf_id: props.turfId, slot_id: selectedSlotId, players },
    });
    setBookingLoading(false);

    if (!res.ok) { notify.error(res.error.message); return; }
    
    setCreatedBooking(res.data);
    setModalOpen(false);
    setSlots(p => p.map(s => s.id === selectedSlotId ? { ...s, status: "booked" } : s));
    setPayModalOpen(true);
  }

  async function handlePay(type: "online" | "offline") {
    if (!token || !createdBooking) return;
    setPayLoading(true);
    if (type === "online") await new Promise(r => setTimeout(r, 600));

    const res = await apiFetch<PaymentResult>("/api/payments", {
      method: "POST",
      token,
      body: { 
        booking_id: createdBooking.id, 
        payment_type: type, 
        payment_status: type === "online" ? "success" : "pending" 
      },
    });
    setPayLoading(false);

    if (!res.ok) { notify.error(res.error.message); return; }

    setPayModalOpen(false);
    const slot = slots.find(s => s.id === createdBooking.slot_id);
    setSuccessSlotTime(slot ? `${fmt(slot.start_time)} – ${fmt(slot.end_time)}` : "");
    setSuccessOpen(true);
  }

  function fmt(dt: string) {
    return new Date(dt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-[#121A14] p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
          <button 
            onClick={() => setView("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${view === 'grid' ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' : 'text-gray-400'}`}
          >
            <LayoutGrid className="w-4 h-4" /> GRID VIEW
          </button>
          <button 
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${view === 'calendar' ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' : 'text-gray-400'}`}
          >
            <CalendarIcon className="w-4 h-4" /> CALENDAR
          </button>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 px-4">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> <span className="text-[10px] font-black text-gray-500 uppercase">Available</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[10px] font-black text-gray-500 uppercase">Booked</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> <span className="text-[10px] font-black text-gray-500 uppercase">Blocked</span></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl p-6 sm:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {view === "grid" ? (
             <motion.div 
               key="grid"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
             >
                {slots.map(s => {
                   const isAvail = s.status === "available";
                   const isBooked = s.status === "booked";
                   return (
                     <button
                       key={s.id}
                       disabled={!isAvail}
                       onClick={() => handleSlotClick(s.id)}
                       className={`group relative flex flex-col p-5 rounded-3xl border-2 transition-all overflow-hidden ${
                         isAvail 
                           ? 'bg-white dark:bg-[#1A241D] border-gray-100 dark:border-white/5 hover:border-primary hover:shadow-xl hover:shadow-green-500/10' 
                           : isBooked
                             ? 'bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/10 opacity-60 grayscale-[0.5]'
                             : 'bg-gray-50 dark:bg-white/5 border-transparent opacity-40'
                       }`}
                     >
                        <div className="flex items-center justify-between mb-3">
                           <Clock className={`w-4 h-4 ${isAvail ? 'text-primary' : 'text-gray-400'}`} />
                           {isAvail ? <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" /> : <Lock className="w-3 h-3 text-gray-400" />}
                        </div>
                        <div className={`text-sm font-black text-left leading-none mb-1 ${!isAvail ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {fmt(s.start_time)}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 text-left uppercase tracking-widest">
                          {isAvail ? 'Bookable' : s.status}
                        </div>
                        {isAvail && (
                          <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all pointer-events-none" />
                        )}
                     </button>
                   );
                })}
             </motion.div>
          ) : (
             <motion.div 
               key="calendar"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="fc-saas-theme"
             >
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridDay"
                  headerToolbar={{ left: "prev,next", center: "title", right: "timeGridWeek,timeGridDay" }}
                  events={events}
                  eventClick={(info) => handleSlotClick(info.event.id)}
                  height="auto"
                  slotMinTime="06:00:00"
                  slotMaxTime="23:00:00"
                  allDaySlot={false}
                />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

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

      {payModalOpen && createdBooking && (
        <div className="modal-backdrop items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/10 p-8 shadow-2xl overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5"><CreditCard className="w-40 h-40" /></div>
             <div className="relative">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Finalize Booking</h3>
                <p className="text-gray-500 text-sm mb-8 font-medium italic underline decoration-primary/30 decoration-2">Confirm your reservation and pay.</p>
                
                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 mb-8 border border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Venue</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{props.turfName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</span>
                    <span className="text-lg font-black text-primary">₹{Number(createdBooking.total_price).toFixed(0)}</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button 
                    onClick={() => handlePay("online")}
                    disabled={payLoading}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-3"
                  >
                    {payLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>PAY NOW <ChevronRight className="w-4 h-4" /></>}
                  </button>
                  <button 
                    onClick={() => handlePay("offline")}
                    disabled={payLoading}
                    className="w-full py-4 text-sm font-black text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    PAY LATER AT VENUE
                  </button>
                </div>
             </div>
          </motion.div>
        </div>
      )}

      <PaymentSuccess
        open={successOpen}
        turfName={props.turfName}
        slotTime={successSlotTime}
        amount={createdBooking ? Number(createdBooking.total_price) : props.pricePerSlot}
        onClose={() => { setSuccessOpen(false); router.push("/dashboard/customer"); }}
      />
    </div>
  );
}
