import React from "react";
import CaimifHeadCard from "./CaimifHeadCard";

/**
 * MessageFromCaimifHead Component
 *
 * Responsibilities:
 * - Left: Imports and renders the separate CaimifHeadCard component.
 * - Right: Displays the official leadership statement (borderless and shadowless).
 * - Section background: pure white.
 */
export default function MessageFromCaimifHead() {
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Dedicated CaimifHead Card Component (compact width) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <CaimifHeadCard />
          </div>

          {/* Right Column: Leadership Message (borderless and shadowless) */}
          <div className="lg:col-span-8 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            {/* Top Header & Sub-tracker */}
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#172554] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                Leadership Message
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700/80 dark:text-blue-400">
                FROM THE DESK OF THE HEAD
              </span>
            </div>

            {/* Message Body Paragraph */}
            <p className="text-sm sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Welcome to our esteemed university! We are dedicated to fostering an
              environment where innovation thrives, knowledge expands, and students
              are empowered to achieve their full potential. Our commitment to academic
              excellence, groundbreaking research, and community engagement remains
              unwavering. We believe in nurturing holistic development, encouraging
              critical thinking, and preparing our graduates to be global leaders and
              responsible citizens. Join us on a journey of discovery and transformation,
              where your aspirations are our priority.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
