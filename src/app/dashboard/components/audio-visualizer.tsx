"use client";

import { motion } from "framer-motion";

interface AudioVisualizerProps {
  audioData: number[];
}

export function AudioVisualizer({ audioData }: AudioVisualizerProps) {
  // Create mirrored data for symmetrical visualization
  const halfLength = Math.floor(audioData.length / 2);
  const centerData = audioData.slice(0, halfLength);

  return (
    <div className="flex items-center justify-center gap-[2px] h-16 w-full">
      {/* Left side (reversed) */}
      {centerData
        .slice()
        .reverse()
        .map((value, index) => (
          <motion.div
            key={`left-${index}`}
            initial={{ height: 0 }}
            animate={{ height: `${value * 64}px` }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.5,
            }}
            className="w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-cyan-500"
            style={{
              opacity: 0.3 + value * 0.7,
            }}
          />
        ))}

      {/* Small gap in the center */}
      <div className="w-1" />

      {/* Right side */}
      {centerData.map((value, index) => (
        <motion.div
          key={`right-${index}`}
          initial={{ height: 0 }}
          animate={{ height: `${value * 64}px` }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.5,
          }}
          className="w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-cyan-500"
          style={{
            opacity: 0.3 + value * 0.7,
          }}
        />
      ))}
    </div>
  );
}
