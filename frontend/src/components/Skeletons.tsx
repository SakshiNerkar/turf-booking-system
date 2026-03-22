"use client";

import { motion } from "framer-motion";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-200 dark:bg-white/5 ${className}`}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent shadow-2xl"
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-white dark:bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5">
      <Skeleton className="h-10 w-10 rounded-xl mb-4" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-white/5">
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-7 w-16 rounded-full shrink-0" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ width: `${90 - i * 15}%` }}>
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}


export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={`${sizes[size]} rounded-full border-[3px] border-black/5 border-t-primary dark:border-white/10 dark:border-t-primary shadow-sm`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <LoadingSpinner size="lg" />
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
        className="text-sm font-black text-gray-500 tracking-widest uppercase"
      >
        Loading experience…
      </motion.p>
    </div>
  );
}
