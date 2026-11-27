import React from "react";
import { FACILITY_HERO_CONFIG } from "./facilities.config";

/**
 * FacilityHeroSection Component
 *
 * Hero section at the top of the Facilities page featuring:
 * - Centered headline ("NVIDIA DGX H100 Supercomputer & Other Hardware")
 * - Left column hardware rack image
 * - Right column Specifications heading, overview copy, and structured key-value table
 */
export default function FacilityHeroSection() {
  return (
    <section className="w-full pb-14 border-b border-zinc-200/80 dark:border-zinc-800">
      <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        {FACILITY_HERO_CONFIG.title}
      </h1>

      <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Left Column: Hardware Image */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-[260px] overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-900 shadow-sm dark:border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nvidia-dgx-h100.webp"
              alt={FACILITY_HERO_CONFIG.imageAlt}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        {/* Right Column: Specifications & Key-Value Table */}
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {FACILITY_HERO_CONFIG.specsHeading}
          </h2>

          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {FACILITY_HERO_CONFIG.description}
          </p>

          <div className="mt-5 overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
            <table className="w-full border-collapse text-left text-xs">
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {FACILITY_HERO_CONFIG.specs.map((spec) => (
                  <tr key={spec.label}>
                    <th
                      scope="row"
                      className="w-36 sm:w-44 bg-zinc-100/80 px-3.5 py-2.5 font-semibold text-zinc-900 align-middle dark:bg-zinc-900/90 dark:text-zinc-100"
                    >
                      {spec.label}
                    </th>
                    <td className="px-3.5 py-2.5 text-zinc-700 align-middle dark:text-zinc-300">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
