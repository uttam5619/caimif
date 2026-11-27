import React from "react";

/**
 * AboutCaimif Component
 *
 * Displays the 3 primary institutional sections of CAIMIF matching the design figure:
 * 1. Left Card: Comprehensive introduction to CAIMIF's multidisciplinary advantage.
 * 2. Top Right Card: Our Vision (Future & Purpose).
 * 3. Bottom Right Card: Our Mission (Goals & Direction with numbered milestones).
 */
export default function AboutCaimif() {
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-slate-50/70 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Introduction Card */}
          <div className="flex flex-col justify-center rounded-3xl border border-zinc-200/80 bg-white p-7 sm:p-10 lg:p-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
              As the world witnesses the unprecedented and exponentially growing
              impact of Artificial Intelligence on every sphere of human life,
              the Center for Artificial Intelligence in Medicine, Imaging &amp;
              Forensics at Sharda University stands poised to lead this
              transformation. With state-of-the-art computing facilities,
              cutting-edge infrastructure, and the combined strength of
              thousands of students and faculty members from all fourteen
              schools of the university on a single campus, the center enjoys a
              unique multidisciplinary advantage.
            </p>

            <p className="mt-6 text-sm sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
              This collaborative environment is further enriched by access to
              invaluable medical data from the School of Medical Sciences &amp;
              Research, School of Dental Sciences, and School of Allied Health
              Sciences, enabling the development of innovative AI-driven
              solutions in medicine and healthcare.
            </p>
          </div>

          {/* Right Column: Stacked Vision & Mission Cards */}
          <div className="flex flex-col gap-6">
            {/* Our Vision Card */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {/* Vision Header */}
              <div className="flex items-center gap-3.5">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/70 shadow-xs dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50">
                  {/* Compass / Navigation Icon for Future Vision */}
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Our Vision
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-400">
                    FUTURE &amp; PURPOSE
                  </span>
                </div>
              </div>

              {/* Vision Body */}
              <p className="mt-4 text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
                To be an international hub for research, development and
                training in applications of Artificial Intelligence leading to a
                healthier, secure &amp; prosperous society.
              </p>
            </div>

            {/* Our Mission Card */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {/* Mission Header */}
              <div className="flex items-center gap-3.5">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 border border-orange-200/70 shadow-xs dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900/50">
                  {/* Precision Target / Bullseye Icon for Mission & Strategic Milestones */}
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v3m0 12v3m9-9h-3M6 12H3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Our Mission
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-orange-500 dark:text-orange-400">
                    GOALS &amp; DIRECTION
                  </span>
                </div>
              </div>

              {/* Mission Numbered Points */}
              <div className="mt-4 space-y-3.5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-500 dark:bg-orange-950/80 dark:text-orange-400">
                    1
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
                    To develop a multidisciplinary and vibrant academic and
                    research atmosphere for AI related learning and research in
                    medicine, imaging and forensics.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-500 dark:bg-orange-950/80 dark:text-orange-400">
                    2
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    To lead development of innovative and transformative AI
                    applications, algorithms and data processing methods to
                    advance healthcare and crime-prevention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
