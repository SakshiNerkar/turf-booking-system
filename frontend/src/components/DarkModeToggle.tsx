"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("turff_theme") as Theme) ?? "system";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.remove("dark");
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("turff_theme", next);
    applyTheme(next);
  }

  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      onClick={toggle}
      id="dark-mode-toggle"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-9 w-9 place-items-center rounded-xl border border-black/8 bg-white/70 text-base shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md dark:border-white/12 dark:bg-black/30"
    >
      <span
        className="transition-all duration-300"
        style={{
          display: "grid",
          placeItems: "center",
          transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
          opacity: 1,
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
