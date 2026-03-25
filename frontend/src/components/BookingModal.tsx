"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckCircle2, CreditCard, Clock, MapPin, 
  ShieldCheck, ArrowRight, Wallet, Receipt
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { apiFetch } from "../lib/api";
import { notify } from "../lib/toast";
import { useRouter } from "next/navigation";

type Slot = { id: string; start_time: string; end_time: string; status: "available" | "booked" | "blocked"; };

export function BookingModal({ 
  slot, turfId, turfName, turfOwnerId, onClose, location 
}: { 
  slot: Slot, turfId: string, turfName: string, turfOwnerId: string, onClose: () => void, location: string 
}) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const basePrice = 1200; // Mock price
  const platformFee = 50;
  const convenienceTaxes = 30;
  const totalPrice = basePrice + platformFee + convenienceTaxes;

  const handleBooking = async () => {
    if (!token) {
      notify.error("Please login to proceed");
      router.push("/login");
      return;
    }

    setLoading(true);
    const res = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        turf_id: turfId,
        slot_id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        total_price: totalPrice
      })
    });
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      notify.success("Match Scheduled Successfully");
      setTimeout(() => {
        onClose();
        router.push("/dashboard/customer");
      }, 3500); // Wait longer to show success animation fully
    } else {
      notify.error(res.error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="card-compact p-0 w-full max-w-md bg-white dark:bg-[#121A14] overflow-hidden shadow-2xl border-0 ring-1 ring-border"
      >
        <div className="p-8 space-y-6">
           
           {/* Modal Protocol Header */}
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Confirm Booking</h3>
                 <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-primary" /> Secure Gateway
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-red-500 rounded-xl transition-colors"
                disabled={success}
              >
                 <X className="w-5 h-5" />
              </button>
           </div>

           {/* Success State */}
           <AnimatePresence>
             {success ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="py-12 text-center space-y-6"
               >
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-24 h-24 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto shadow-sm"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <div className="space-y-2">
                     <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Booking Confirmed!</h4>
                     <p className="text-sm font-semibold text-gray-500 leading-relaxed">Your match at {turfName} is locked. Redirecting to your dashboard...</p>
                  </div>
                  <div className="w-full flex justify-center pt-4">
                     <div className="h-1.5 w-1/2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "linear" }} className="h-full bg-primary" />
                     </div>
                  </div>
               </motion.div>
             ) : (
               <div className="space-y-8">
                  
                  {/* Session Overview (Ticket Style) */}
                  <div className="p-6 bg-gray-50 dark:bg-[#0B0F0C] rounded-2xl border border-border space-y-5 shadow-inner">
                     <div className="space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arena</div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{turfName}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500"><MapPin className="w-3.5 h-3.5" /> {location}</div>
                     </div>
                     
                     <div className="flex items-center gap-4 border-t border-border pt-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white dark:bg-card flex items-center justify-center border border-border shadow-sm"><Clock className="w-5 h-5 text-primary" /></div>
                           <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduled Slot</div>
                              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="space-y-4">
                     <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Receipt className="w-4 h-4 text-gray-400" /> Payment Summary
                     </div>
                     
                     <div className="space-y-3 text-sm font-semibold">
                        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                           <span>Base Slot Fee</span>
                           <span>₹{basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                           <span>Platform Fee</span>
                           <span>₹{platformFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                           <span>Convenience / Taxes</span>
                           <span>₹{convenienceTaxes}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-300 dark:border-white/20">
                           <span className="text-gray-900 dark:text-white font-extrabold text-base tracking-tight">Total Amount</span>
                           <span className="text-gray-900 dark:text-white font-black text-xl tracking-tight text-primary">₹{totalPrice.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                     <button 
                       onClick={onClose}
                       className="p-4 bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border border-border rounded-xl font-bold flex-1 max-w-[100px] flex justify-center"
                     >
                        Cancel
                     </button>
                     <button 
                       onClick={handleBooking}
                       disabled={loading}
                       className="btn-sports flex-1 py-4 text-base font-bold rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                     >
                        {loading ? 'Processing...' : 'Pay Securely'} <Wallet className="w-5 h-5" />
                     </button>
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
