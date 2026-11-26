"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import HeroCard from "./HeroCard";
import DotGridBackground from "./DotGridBackground";
import {
  HERO_TARGET_TEXT,
  HERO_ANIMATION_CONFIG,
  HERO_STAT_ITEMS,
} from "./hero.config";

/**
 * HeroSection Component
 *
 * Responsibilities:
 * - Solid primary background (#172554)
 * - Dot Grid Background powered by Framer Motion (breathing pulse & cursor tracking spotlight)
 * - Left-aligned banner content with live bidirectional typewriter animation
 * - Stable height container to eliminate layout shift during typing and deleting
 * - Call-to-action buttons for facilities and research
 * - Renders dedicated, modular HeroCard components for key statistics and capabilities
 */
export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect: typing from left to right, then backspacing from right to left
  useEffect(() => {
    let timeoutDuration = HERO_ANIMATION_CONFIG.typingSpeed;

    if (!isDeleting && displayedText.length === HERO_TARGET_TEXT.length) {
      // Finished typing: pause to let the user read
      timeoutDuration = HERO_ANIMATION_CONFIG.pauseDuration;
    } else if (isDeleting && displayedText.length === 0) {
      // Finished deleting: brief pause before starting to type again
      timeoutDuration = HERO_ANIMATION_CONFIG.restartDelay;
    } else if (isDeleting) {
      // Deleting speed (faster backspacing)
      timeoutDuration = HERO_ANIMATION_CONFIG.deletingSpeed;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < HERO_TARGET_TEXT.length) {
          setDisplayedText(HERO_TARGET_TEXT.slice(0, displayedText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(HERO_TARGET_TEXT.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
        }
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting]);

  return (
    <section
      id="hero-section-container"
      className="relative w-full bg-[#172554] text-white py-10 sm:py-14 overflow-hidden"
    >
      {/* Framer Motion Interactive Dot Grid Background */}
      <DotGridBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl text-left">
          {/* Top Announcement Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-100 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Sharda University Advanced Research Infrastructure
          </div>

          {/* Main Headline Section */}
          <div className="flex flex-col items-start w-full">
            <span className="text-xs sm:text-4xl font-bold tracking-widest uppercase text-white mb-2">
              CAIMIF
            </span>

            {/* Height-locked headline container to prevent layout shifting on single line */}
            <div className="min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-start text-left w-full overflow-x-auto sm:overflow-visible">
              <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-[1.7rem] font-extrabold text-white leading-tight whitespace-nowrap tracking-tight text-left">
                <span>{displayedText}</span>
                <span className="inline-block animate-pulse font-light text-blue-300 ml-1">
                  |
                </span>
              </h1>
            </div>
          </div>

          {/* Subtitle / Descriptive Text */}
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-blue-100 max-w-2xl">
            CAIMIF drives AI innovation in medicine, imaging, and forensics through advanced research, training, and global collaboration.
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
            <Link
              href="/facilities"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#172554] shadow-md hover:bg-zinc-100 hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Instruments
            </Link>
            <Link
              href="/research"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Research
            </Link>
          </div>
        </div>

        {/* Dedicated Hero Cards Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HERO_STAT_ITEMS.map((item) => (
            <HeroCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
