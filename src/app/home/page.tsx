import React from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import AboutCaimif from "@/components/home/about/AboutCaimif";
import MessageFromCaimifHead from "@/components/home/messageFromCaimifHead/MessageFromCaimifHead";
import ResearchDomain from "@/components/home/researchDomain/ResearchDomain";

/**
 * Featured instruments data for Home page preview
 */
const FEATURED_INSTRUMENTS = [
  {
    name: "Field Emission Scanning Electron Microscope (FE-SEM)",
    code: "FE-SEM 8000",
    category: "Microscopy & Surface Analysis",
    description:
      "Ultra-high resolution surface morphology and topological imaging with integrated Energy Dispersive X-Ray Spectroscopy (EDS) for elemental microanalysis.",
    specs: "Resolution: 1.0 nm @ 15 kV | Magnification: 25x to 1,000,000x",
    href: "/facilities#fesem",
  },
  {
    name: "High-Resolution Transmission Electron Microscope (HR-TEM)",
    code: "HR-TEM 200kV",
    category: "Atomic-Scale Microscopy",
    description:
      "Atomic lattice fringe resolution, selected area electron diffraction (SAED), and high-contrast imaging of nanoparticles, 2D materials, and biological specimens.",
    specs: "Accelerating Voltage: 200 kV | Point Resolution: 0.19 nm",
    href: "/facilities#hrtem",
  },
  {
    name: "Powder X-Ray Diffractometer (XRD)",
    code: "XRD SmartLab",
    category: "Diffraction & Crystallography",
    description:
      "Phase identification, quantitative Rietveld analysis, crystallite size determination, residual stress, and thin film grazing incidence diffraction.",
    specs: "Cu K-alpha radiation | 2-theta range: 0.5 deg to 150 deg",
    href: "/facilities#xrd",
  },
  {
    name: "Nuclear Magnetic Resonance Spectrometer (500 MHz NMR)",
    code: "NMR 500 MHz",
    category: "Molecular Spectroscopy",
    description:
      "High-field multi-nuclear 1D (1H, 13C, 19F, 31P) and 2D (COSY, NOESY, HSQC, HMBC) structure elucidation of synthetic molecules and biomacromolecules.",
    specs: "500 MHz UltraShield Plus | Dual channel multinuclear probe",
    href: "/facilities#nmr",
  },
];

/**
 * Access user category cards
 */
const ACCESS_TIERS = [
  {
    title: "Internal Scholars & Students",
    description:
      "Subsidized test rates for undergraduate, postgraduate, and PhD scholars of Sharda University.",
    badge: "Internal",
    actionText: "View Internal Guidelines",
    href: "/facilities",
  },
  {
    title: "External Academic Institutions",
    description:
      "Open access for researchers and faculty from recognized colleges, universities, and government research laboratories.",
    badge: "Academic",
    actionText: "Check Academic Tariff",
    href: "/facilities",
  },
  {
    title: "Industrial & Corporate R&D",
    description:
      "Comprehensive characterization, quality verification, and consultancy services for pharmaceutical, chemical, and materials enterprises.",
    badge: "Industry",
    actionText: "Partner with Us",
    href: "/collaborations",
  },
];

/**
 * Home Page Component
 *
 * Serves as the primary landing page showcasing CAIMIF capabilities, equipment, and access guidelines.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Presentation */}
      <HeroSection />

      {/* About CAIMIF Interdisciplinary Center */}
      <AboutCaimif />

      {/* Official Message from CAIMIF Leadership */}
      <MessageFromCaimifHead />

      {/* Research Thrust Domains */}
      <ResearchDomain />

      {/* Facility Overview & Core Capabilities */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950/60 border-y border-zinc-200/80 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              World-Class Infrastructure for Interdisciplinary Science
            </p>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              CAIMIF houses advanced analytical instrumentation to foster high-impact
              research in physics, chemistry, nanotechnology, biomedical engineering, and material science.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xl mb-4">
                🔬
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Electron Microscopy
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Atomic and sub-nanometer imaging, surface topography, crystal defect profiling, and EDS compositional mapping.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xl mb-4">
                📡
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Diffraction & Crystals
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Powder XRD, thin-film grazing angle scans, phase refinement, and crystal structure solving for novel solids.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400 font-bold text-xl mb-4">
                🧪
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Molecular Spectroscopy
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                500 MHz NMR, Raman spectrometry, and FTIR for molecular structure elucidation and vibrational finger-printing.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xl mb-4">
                🔥
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Thermal & Elemental
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                High-precision TGA/DSC thermal decomposition profiles and ICP-MS ultra-trace elemental concentration detection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Instruments */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Flagship Instruments
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Featured Research Instrumentation
              </p>
            </div>
            <Link
              href="/facilities"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              View all 15+ instruments
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURED_INSTRUMENTS.map((inst) => (
              <div
                key={inst.code}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/70"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {inst.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-zinc-500">
                      {inst.code}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {inst.name}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {inst.description}
                  </p>
                  <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-xs font-medium text-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Key Specs:{" "}
                    </span>
                    {inst.specs}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <Link
                    href={inst.href}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    View Specifications & Rates &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Tiers & User Categories */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              User Access Model
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Transparent Access for All Researchers
            </p>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              CAIMIF follows open-access scientific guidelines welcoming scholars from universities, government labs, and corporate R&D.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACCESS_TIERS.map((tier) => (
              <div
                key={tier.title}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <span className="inline-block rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {tier.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {tier.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={tier.href}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    {tier.actionText} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Accelerate Your Scientific Research
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-blue-100 sm:text-lg">
            Consult with our scientific specialists or review the available slot booking calendar to run your samples at CAIMIF.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/facilities"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-md hover:bg-zinc-100 transition-colors"
            >
              Browse Equipment
            </Link>
            <Link
              href="/contectus"
              className="rounded-xl border border-white/60 bg-blue-500/20 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500/40 transition-colors"
            >
              Contact Facility Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
