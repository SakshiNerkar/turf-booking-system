"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      richColors
      closeButton
      position="bottom-right"
      expand={false}
      toastOptions={{
        duration: 4000,
        className:
          "turff-toast backdrop-blur-lg bg-white/80 dark:bg-black/50 border border-black/8 dark:border-white/12 shadow-xl",
        style: {
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
          fontSize: "0.875rem",
          fontWeight: "600",
          borderRadius: "1rem",
          padding: "0.75rem 1rem",
        },
      }}
    />
  );
}
