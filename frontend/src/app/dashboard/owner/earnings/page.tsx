"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrendingUp, CreditCard, Activity, ArrowUpRight, BarChart3, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type RevenueSummary = {
  today: string;
  weekly: string;
  monthly: string;
  all_time: string;
  total_bookings: number;
  paid_bookings: number;
};

export default function OwnerEarningsPage() {
  const { token, user } = useAuth();
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRevenue() {
    if (!token) return;
    setLoading(true);
    const res = await apiFetch<RevenueSummary>("/api/bookings/revenue/owner", { token });
    if (res.ok) setRevenue(res.data);
    setLoading(false);
  }

  useEffect(() => { loadRevenue(); }, [token]);

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Daily Revenue" value={`₹${Number(revenue?.today || 0).toLocaleString()}`} icon={CreditCard} trend={{ value: "+8%", isUp: true }} />
        <StatCard title="Weekly Growth" value={`₹${Number(revenue?.weekly || 0).toLocaleString()}`} icon={TrendingUp} trend={{ value: "+14%", isUp: true }} />
        <StatCard title="Monthly Total" value={`₹${Number(revenue?.monthly || 0).toLocaleString()}`} icon={BarChart3} trend={{ value: "+22%", isUp: true }} />
        <StatCard title="Net Earnings" value={`₹${Number(revenue?.all_time || 0).toLocaleString()}`} icon={Activity} />
      </div>

      <div className="bg-white dark:bg-[#121A14] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl p-8 relative overflow-hidden">
         <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Revenue <span className="text-primary italic">Intelligence</span></h2>
              <p className="text-gray-500 text-sm font-medium mt-1">Detailed performance metrics for your sports venues.</p>
            </div>
            <button onClick={loadRevenue} className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm">
               <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
         </div>

         <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            <div className="lg:col-span-2 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 h-80 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-black text-gray-400 mb-2">Payout Forecast</div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                    ₹{Number(revenue?.monthly || 0 * 1.2).toFixed(0)}
                    <span className="text-sm font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full">+20% Est.</span>
                  </div>
                </div>
                <div className="h-32 flex items-end gap-2">
                   {[40, 60, 35, 90, 75, 80, 55, 65, 95, 85].map((h, i) => (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${h}%` }} 
                        key={i} 
                        className="flex-1 bg-primary/20 hover:bg-primary rounded-t-lg transition-colors" 
                      />
                   ))}
                </div>
            </div>

            <div className="space-y-6">
                {[
                  { label: "Bookings", value: revenue?.total_bookings || 0, icon: Activity, color: "text-blue-500" },
                  { label: "Successful", value: revenue?.paid_bookings || 0, icon: CheckCircle2, color: "text-green-500" },
                  { label: "Completion", value: `${((revenue?.paid_bookings || 0) / (revenue?.total_bookings || 1) * 100).toFixed(1)}%`, icon: TrendingUp, color: "text-amber-500" }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl bg-white dark:bg-[#1A241D] ${s.color} shadow-sm`}><s.icon className="w-5 h-5" /></div>
                      <div className="text-sm font-black text-gray-900 dark:text-white">{s.label}</div>
                    </div>
                    <div className="text-lg font-black">{s.value}</div>
                  </div>
                ))}
            </div>
         </div>
         
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none scale-150"><BarChart3 className="w-96 h-96" /></div>
      </div>
    </div>
  );
}

import { CheckCircle2 } from "lucide-react";
