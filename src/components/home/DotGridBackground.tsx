"use client";

import React, { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { DotGridBackgroundProps } from "./types";

/**
 * DotGridBackground Component
 *
 * Responsibilities:
 * - High-performance SVG dot grid pattern with radial gradient vignette.
 * - Framer Motion animated ambient pulsing glow layer.
 * - Interactive cursor spotlight that tracks pointer motion across the hero section.
 * - Non-interactive pointer-events-none overlay ensuring zero interference with CTA buttons and links.
 */
export default function DotGridBackground({
  dotSize = 1.25,
  gap = 26,
  color = "rgba(147, 197, 253, 0.22)", // Soft translucent cyan-blue
  className = "",
  interactive = true,
}: DotGridBackgroundProps) {
  // Motion values for smooth cursor tracking spotlight
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Dynamic radial gradient spotlight following mouse position
  const spotlightBackground = useMotionTemplate`radial-gradient(450px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(147, 197, 253, 0.16), transparent 80%)`;

  useEffect(() => {
    if (!interactive) return;

    const container = document.getElementById("hero-section-container");
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive, mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {/* Base Dot Grid Pattern with soft radial vignette mask */}
      <svg
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_70%_70%_at_50%_35%,black_25%,transparent_85%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-dot-grid"
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={gap / 2} cy={gap / 2} r={dotSize} fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dot-grid)" />
      </svg>

      {/* Ambient Breathing Glow Layer via Framer Motion */}
      <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_25%,black_15%,transparent_75%)]"
        animate={{
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-dot-grid-glow"
              x="0"
              y="0"
              width={gap}
              height={gap}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={gap / 2}
                cy={gap / 2}
                r={dotSize * 1.3}
                fill="rgba(191, 219, 254, 0.4)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dot-grid-glow)" />
        </svg>
      </motion.div>

      {/* Interactive Framer Motion Spotlight */}
      {interactive && (
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlightBackground }}
        />
      )}
    </motion.div>
  );
}
