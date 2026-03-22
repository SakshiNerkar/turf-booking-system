"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className = "" }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className={`p-6 rounded-[2.5rem] bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/5 shadow-xl shadow-black/[0.02] flex flex-col transition-all duration-500 overflow-hidden relative group ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-primary shadow-sm border border-gray-100 dark:border-white/5 transition-colors group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-500/20">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${trend.isUp ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
            {trend.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
          {title}
        </h3>
        <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
