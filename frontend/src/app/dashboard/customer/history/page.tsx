"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { SkeletonRow } from "@/components/Skeletons";
import { StatCard } from "@/components/dashboard/StatCard";
import { History as HistoryIcon, TrendingUp, CreditCard } from "lucide-react";

type BookingListItem = {
  id: string;
  turf_name: string;
  total_price: string;
  payment_status: string;
  start_time: string;
  end_time: string;
};

export default function BookingHistoryPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<BookingListItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<BookingListItem[]>("/api/bookings/customer", { token }).then(res => {
      setBookings(res.ok ? res.data : []);
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Played" value={bookings?.length ?? 0} icon={HistoryIcon} />
        <StatCard title="Total Spent" value={`₹${bookings?.reduce((acc, b) => acc + Number(b.total_price), 0).toLocaleString()}`} icon={CreditCard} />
        <StatCard title="Loyalty Points" value="450" icon={TrendingUp} trend={{ value: "+12", isUp: true }} />
      </div>

      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8">
         <h2 className="text-xl font-black mb-6">Booking History</h2>
         <div className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />) : bookings?.map(b => (
              <div key={b.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-black">{b.turf_name}</div>
                  <div className="text-xs text-gray-500">{new Date(b.start_time).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">₹{Number(b.total_price).toFixed(0)}</div>
                  <div className="text-[10px] uppercase font-black text-gray-400">{b.payment_status}</div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
