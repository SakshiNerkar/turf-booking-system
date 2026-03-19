import { Suspense } from "react";
import BookingClient from "./BookingClient";

export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-black/5 bg-[color:var(--card)] p-6 text-sm text-black/70 shadow-sm dark:border-white/10 dark:text-white/70">
          Loading...
        </div>
      }
    >
      <BookingClient />
    </Suspense>
  );
}

