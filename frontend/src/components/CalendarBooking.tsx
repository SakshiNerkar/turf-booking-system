"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { apiFetch } from "../lib/api";
import { notify } from "../lib/toast";
import { BookingModal } from "./BookingModal";
import { PaymentSuccess } from "./PaymentSuccess";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, CheckCircle2, Lock, ChevronRight, LayoutGrid, 
  Calendar as CalendarIcon, CreditCard, RefreshCw, AlertCircle,
  ChevronLeft, MapPin, Zap
} from "lucide-react";

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
  
  // Date Selection Logic
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Sync props.slots when they change
  useEffect(() => {
    setSlots(props.slots);
  }, [props.slots]);

  const filteredSlots = useMemo(() => {
    return slots.filter(s => s.start_time.startsWith(selectedDate));
  }, [slots, selectedDate]);

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
    setSuccessSlotTime(slot ? `${formatTime(slot.start_time)} – ${formatTime(slot.end_time)}` : "");
    setSuccessOpen(true);
  }

  function formatTime(dt: string) {
    return new Date(dt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  // Generate next 14 days for date picker
  const dates = useMemo(() => {
    const d = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      d.push({
        full: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        num: date.getDate(),
        month: date.toLocaleDateString('en-IN', { month: 'short' })
      });
    }
    return d;
  }, []);

  return (
    <div className="space-y-10">
      
      {/* 1. Khelomore Style Date Selector */}
      <div className="bg-white dark:bg-[#121A14] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-3">
               <CalendarIcon className="w-5 h-5 text-primary" /> SELECT DATE
            </h3>
            <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
               <button onClick={() => setView("grid")} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'grid' ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' : 'text-gray-400'}`}>GRID</button>
               <button onClick={() => setView("calendar")} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${view === 'calendar' ? 'bg-white dark:bg-[#1A241D] text-primary shadow-sm' : 'text-gray-400'}`}>CALENDAR</button>
            </div>
         </div>

         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
            {dates.map(d => (
              <button 
                key={d.full} 
                onClick={() => setSelectedDate(d.full)}
                className={`flex-shrink-0 w-24 py-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedDate === d.full ? 'bg-primary border-primary text-white shadow-xl shadow-green-500/20 scale-105' : 'bg-gray-50 dark:bg-white/2 border-transparent hover:border-gray-200'}`}
              >
                <div className={`text-[10px] font-black uppercase tracking-widest ${selectedDate === d.full ? 'text-white/80' : 'text-gray-400'}`}>{d.day}</div>
                <div className="text-2xl font-black">{d.num}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${selectedDate === d.full ? 'text-white/80' : 'text-gray-400'}`}>{d.month}</div>
              </button>
            ))}
         </div>
      </div>

      {/* 2. Khelomore Style Slot Feed */}
      <div className="bg-white dark:bg-[#121A14] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl min-h-[400px]">
         <AnimatePresence mode="wait">
            {view === "grid" ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Available Slots</h4>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Live</span></div>
                       <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Booked</span></div>
                    </div>
                 </div>

                 {filteredSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400"><AlertCircle className="w-8 h-8" /></div>
                       <div className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">Status: No sessions scheduled</div>
                       <p className="text-[10px] font-bold text-gray-400 opacity-60 uppercase mx-auto max-w-[200px]">Try selecting another date to find live sessions at this arena.</p>
                       <button onClick={() => setSelectedDate(dates[0].full)} className="text-primary text-[10px] font-black uppercase tracking-[0.2em] underline decoration-2 underline-offset-4">Return to today</button>
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                       {filteredSlots.map(s => {
                          const isAvail = s.status === "available";
                          const isBooked = s.status === "booked";
                          return (
                            <button
                              key={s.id}
                              disabled={!isAvail}
                              onClick={() => handleSlotClick(s.id)}
                              className={`group relative p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-start gap-4 ${
                                isAvail 
                                  ? 'bg-white dark:bg-[#1A241D] border-gray-100 dark:border-white/5 hover:border-primary hover:shadow-2xl hover:shadow-green-500/10 hover:scale-[1.03]' 
                                  : isBooked
                                    ? 'bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20 opacity-60'
                                    : 'bg-gray-50 dark:bg-white/5 border-transparent opacity-40'
                              }`}
                            >
                               <div className="w-full flex items-center justify-between">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAvail ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}><Clock className="w-5 h-5" /></div>
                                  {isAvail ? <div className="text-[10px] font-black text-primary uppercase tracking-widest italic group-hover:scale-110 transition-transform">Book Now</div> : <Lock className="w-4 h-4 text-gray-400" />}
                               </div>
                               <div>
                                  <div className={`text-xl font-black italic tracking-tighter leading-none mb-1 ${isAvail ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    {formatTime(s.start_time)}
                                  </div>
                                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">
                                    Ends {formatTime(s.end_time)}
                                  </div>
                               </div>
                               {isAvail && (
                                  <div className="mt-2 text-lg font-black text-gray-900 dark:text-white tracking-tighter italic">
                                     ₹{props.pricePerSlot.toFixed(0)} <span className="text-[10px] tracking-normal font-medium text-gray-400">/hr</span>
                                  </div>
                               )}
                               {isAvail && (
                                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                  </div>
                               )}
                            </button>
                          );
                       })}
                    </div>
                 )}
              </motion.div>
            ) : (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fc-saas-theme">
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
            className="w-full max-w-md bg-white dark:bg-[#121A14] rounded-[3.5rem] border border-gray-100 dark:border-white/10 p-10 shadow-2xl relative"
          >
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12"><CreditCard className="w-56 h-56" /></div>
             <div className="relative z-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 italic tracking-tighter">FINALIZE SESSION</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 leading-loose">Choose your preferred transaction protocol.</p>
                
                <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-8 mb-10 border border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ESTABLISHMENT</span>
                    <span className="text-xs font-black text-gray-900 dark:text-white italic">{props.turfName.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TRANSACTION TOTAL</span>
                    <span className="text-3xl font-black text-primary italic tracking-tighter">₹{Number(createdBooking.total_price).toFixed(0)}</span>
                  </div>
                </div>

                <div className="grid gap-4">
                  <button 
                    onClick={() => handlePay("online")}
                    disabled={payLoading}
                    className="w-full py-5 bg-primary text-white font-black rounded-[1.5rem] shadow-2xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                  >
                    {payLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>EXECUTE SECURE PAY <ChevronRight className="w-4 h-4" /></>}
                  </button>
                  <button 
                    onClick={() => handlePay("offline")}
                    disabled={payLoading}
                    className="w-full py-5 text-[10px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all uppercase tracking-widest"
                  >
                    PAY AT ARENA CONCIERGE
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
