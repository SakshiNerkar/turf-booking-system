"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeVibe = {
  name: string;
  hue: number;
  color: string;
};

export const VIBES: ThemeVibe[] = [
  { name: 'Turff', hue: 122, color: '#2E7D32' },
  { name: 'Ocean', hue: 200, color: '#0284C7' },
  { name: 'Volt', hue: 180, color: '#0D9488' },
  { name: 'Elite', hue: 270, color: '#7E22CE' },
  { name: 'Crimson', hue: 350, color: '#BE123C' },
  { name: 'Amber', hue: 35, color: '#B45309' },
];

type ThemeContextType = {
  vibe: ThemeVibe;
  setVibe: (vibe: ThemeVibe) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [vibe, setVibeState] = useState<ThemeVibe>(VIBES[0]);

  useEffect(() => {
    const saved = localStorage.getItem('turff-vibe');
    if (saved) {
      const found = VIBES.find(v => v.name === saved);
      if (found) setVibeState(found);
    }
  }, []);

  const setVibe = (newVibe: ThemeVibe) => {
    setVibeState(newVibe);
    localStorage.setItem('turff-vibe', newVibe.name);
    document.documentElement.style.setProperty('--primary-hue', newVibe.hue.toString());
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hue', vibe.hue.toString());
  }, [vibe]);

  return (
    <ThemeContext.Provider value={{ vibe, setVibe }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
