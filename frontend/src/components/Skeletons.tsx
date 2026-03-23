"use client";

import { motion } from "framer-motion";
import { Search, Zap, Package, Target, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[500] bg-white dark:bg-[#0B0F0C] flex flex-col items-center justify-center space-y-12">
       <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 rounded-[3.5rem] border-4 border-dashed border-primary/20 flex items-center justify-center"
          >
             <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center animate-pulse border border-primary/20">
                <Zap className="w-12 h-12 text-primary" />
             </div>
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-10 -right-10 text-primary/40"
          >
             <Sparkles className="w-20 h-20" />
          </motion.div>
       </div>
       <div className="text-center space-y-4">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-primary dark:to-white bg-clip-text text-transparent animate-gradient">Initialising Protocol</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic opacity-40">Syncing region sector logs. Standby...</p>
       </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#121A14] rounded-[3.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl relative">
       <div className="h-56 bg-gray-100 dark:bg-white/5 animate-pulse" />
       <div className="p-10 space-y-6">
          <div className="h-6 w-3/4 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
             <div className="h-4 w-1/3 bg-gray-100 dark:bg-white/5 animate-pulse rounded-lg" />
             <div className="h-6 w-1/4 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />
          </div>
       </div>
       <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[4s]"><Zap className="w-48 h-48" /></div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-white dark:bg-[#121A14] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
       <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl mb-8" />
       <div className="space-y-4">
          <div className="h-4 w-1/3 bg-gray-100 dark:bg-white/5 animate-pulse rounded-lg" />
          <div className="h-10 w-2/3 bg-gray-100 dark:bg-white/5 animate-pulse rounded-3xl" />
       </div>
       <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none duration-[4s]"><Target className="w-32 h-32" /></div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-8 bg-gray-50/50 dark:bg-white/2 rounded-[3.5rem] border border-transparent shadow-sm mb-4 animate-pulse">
       <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.75rem] bg-gray-100 dark:bg-white/10" />
          <div className="space-y-3">
             <div className="h-4 w-32 bg-gray-100 dark:bg-white/10 rounded-lg" />
             <div className="h-2 w-48 bg-gray-100 dark:bg-white/5 rounded-md" />
          </div>
       </div>
       <div className="h-10 w-24 bg-gray-100 dark:bg-white/10 rounded-2xl" />
    </div>
  );
}

export function EmptyState({ title, sub, icon: Icon = Package, actionLabel, actionLink }: { title: string, sub: string, icon?: any, actionLabel?: string, actionLink?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="py-32 px-12 text-center flex flex-col items-center justify-center space-y-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-[5rem] border-4 border-dashed border-gray-100 dark:border-white/5 shadow-inner"
    >
       <div className="w-32 h-32 rounded-[3.5rem] bg-white dark:bg-[#121A14] border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-200 dark:text-white/10 shadow-2xl relative group rotate-12 hover:rotate-0 transition-all duration-1000">
          <Icon className="w-12 h-12" />
          <div className="absolute -top-4 -right-4 w-10 h-10 rounded-3xl bg-primary/20 flex items-center justify-center text-primary animate-pulse"><Zap className="w-5 h-5" /></div>
       </div>
       
       <div className="space-y-4 max-w-sm">
          <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">{title}</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-loose italic opacity-60 underline decoration-primary/20 decoration-2 underline-offset-8">
             {sub}
          </p>
       </div>

       {actionLabel && actionLink && (
         <Link href={actionLink} className="mt-12 px-12 py-5 bg-primary text-white text-[11px] font-black rounded-[1.5rem] uppercase tracking-widest italic shadow-[0_40px_80px_rgba(34,197,94,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center gap-6">
            {actionLabel} <ArrowRight className="w-5 h-5" />
         </Link>
       )}
    </motion.div>
  );
}
