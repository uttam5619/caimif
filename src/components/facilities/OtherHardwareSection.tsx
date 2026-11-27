import React from "react";
import HardwareCard from "./HardwareCard";
import {
  OTHER_HARDWARE_CARDS,
  OTHER_HARDWARE_DESCRIPTION,
  OTHER_HARDWARE_SECTION_TITLE,
} from "./facilities.config";

/**
 * OtherHardwareSection Component
 *
 * Displays secondary cluster compute and server software hardware cards
 * directly below the NVIDIA DGX H100 hero section on the Facilities page,
 * followed by a concise overview of the integrated computing environment.
 */
export default function OtherHardwareSection() {
  return (
    <section className="mx-auto w-full max-w-6xl pt-14 pb-6">
      <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554] dark:text-zinc-50">
        {OTHER_HARDWARE_SECTION_TITLE}
      </h2>

      {/* Concise Infrastructure Summary */}
      <div className="mt-10 rounded-2xl border border-zinc-200/90 bg-white px-6 py-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <p className="mx-auto max-w-4xl text-center text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {OTHER_HARDWARE_DESCRIPTION}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {OTHER_HARDWARE_CARDS.map((card) => (
          <HardwareCard key={card.id} card={card} />
        ))}
      </div>

      
    </section>
  );
}
