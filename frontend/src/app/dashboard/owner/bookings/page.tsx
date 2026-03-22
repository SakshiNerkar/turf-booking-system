"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { apiFetch } from "../../../lib/api";
import { SkeletonRow } from "../../../components/Skeletons";
import { Calendar, Users, CreditCard, Search, Filter } from "lucide-react";

type BookingItem = {
  id: string;
  turf_name: string;
  customer_name: string;
  players: number;
  total_price: string;
  payment_status: string;
  start_time: string;
  end_time: string;
};

function PayBadge({ status }: { status: string }) {
  if (status === "success") return <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider">✓ Paid</span>;
  if (status === "failed")  return <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider">✗ Failed</span>;
  return <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider">⏳ Pending</span>;
}

export default function OwnerBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<BookingItem[]>("/api/bookings", { token }).then(res => {
      setBookings(res.ok ? res.data : []);
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Active <span className="text-primary italic">Reservations</span></h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage and track your venue's latest bookings.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="pl-9 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-xs font-bold ring-0 focus:border-primary transition-all outline-none" placeholder="Search customer info..." />
           </div>
           <button className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-primary transition-all"><Filter className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8">
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {loading ? <SkeletonRow count={8} /> : 
           !bookings?.length ? <div className="py-20 text-center text-gray-400 text-sm">No bookings found for your venues.</div> :
           bookings.map(b => (
            <div key={b.id} className="py-6 flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">👤</div>
                <div className="flex-1 min-w-0">
                   <div className="font-black text-gray-900 dark:text-white mb-1">{b.customer_name}</div>
                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(b.start_time).toLocaleString()}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {b.players} Units</span>
                   </div>
                </div>
                <div className="hidden md:block py-2 px-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent group-hover:border-gray-100 dark:group-hover:border-white/10 transition-all font-black text-xs text-gray-400 uppercase tracking-widest">
                   {b.turf_name}
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                   <span className="text-xl font-black text-gray-900 dark:text-white">₹{Number(b.total_price).toFixed(0)}</span>
                   <PayBadge status={b.payment_status} />
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
