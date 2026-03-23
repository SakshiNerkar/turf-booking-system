"use client";

import { motion } from "framer-motion";

export function MiniSparkline({ color = "#22C55E" }: { color?: string }) {
  // Pure SVG tactical sparkline (Synthetic data)
  const points = "0,20 10,15 20,25 30,10 40,30 50,15 60,25 70,5 80,20 90,10 100,25 110,15 120,30";

  return (
    <svg viewBox="0 0 120 40" className="w-full h-full overflow-visible">
       <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
       />
       <motion.path
          d={`M ${points} L 120,40 L 0,40 Z`}
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 3 }}
       />
    </svg>
  );
}
