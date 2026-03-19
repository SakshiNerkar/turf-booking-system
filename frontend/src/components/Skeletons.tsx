"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black/[0.06] dark:bg-white/[0.07] ${className}`}
    >
      <div
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          animation: "skeletonShimmer 1.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-40 rounded-none" />
      <div className="p-4 grid gap-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 mt-2" />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card p-5">
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
      <Skeleton className="h-7 w-2/3 mb-1.5" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-black/5 dark:border-white/8">
      <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
      <div className="flex-1 grid gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full shrink-0" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ width: `${85 - i * 12}%` }}>
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}


export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-[3px] border-black/10 border-t-[color:var(--primary)] dark:border-white/15 dark:border-t-[color:var(--accent)]`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm font-semibold text-black/45 dark:text-white/40">Loading…</p>
    </div>
  );
}
