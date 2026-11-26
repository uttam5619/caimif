import React from "react";
import Link from "next/link";

/**
 * Key research domains supported by CAIMIF instrumentation
 */
const RESEARCH_DOMAINS = [
  {
    title: "Advanced Nanomaterials & 2D Crystals",
    icon: "⚛️",
    description:
      "Synthesizing and characterizing graphene, MXenes, transition metal dichalcogenides (TMDs), and Metal-Organic Frameworks (MOFs) with atomic-resolution TEM and XPS.",
    instrumentsUsed: ["HR-TEM (200 kV)", "FE-SEM with EDS", "Powder XRD"],
  },
  {
    title: "Energy Storage & Electrochemical Systems",
    icon: "🔋",
    description:
      "Investigating phase transitions, electrode degradation, solid electrolyte interfaces (SEI), and crystal morphology in Lithium-ion, Sodium-ion, and Zinc-air batteries.",
    instrumentsUsed: ["Powder XRD (In-situ)", "TGA / DSC", "FE-SEM"],
  },
  {
    title: "Biomedical Imaging & Nanotherapeutics",
    icon: "🧬",
    description:
      "Cellular uptake investigations, targeted drug-delivery nanoparticles, antimicrobial nanocomposites, and tissue scaffold ultrastructure characterization.",
    instrumentsUsed: ["Confocal Raman", "500 MHz NMR", "AFM"],
  },
  {
    title: "Environmental Remediation & Catalysis",
    icon: "🌱",
    description:
      "Developing heterogeneous nanocatalysts for wastewater dye degradation, microplastic detection, heavy metal trace quantification, and carbon capture materials.",
    instrumentsUsed: ["ICP-MS", "Raman / FTIR", "TGA / DSC"],
  },
  {
    title: "Semiconductor Thin Films & Optoelectronics",
    icon: "💡",
    description:
      "Fabricating halide perovskite solar cells, thin-film transistors, photodetectors, and transparent conducting oxides with precise surface roughness controls.",
    instrumentsUsed: ["Atomic Force Microscopy (AFM)", "GIXRD", "FE-SEM"],
  },
  {
    title: "Polymer Chemistry & Biomaterials",
    icon: "🧪",
    description:
      "Thermal degradation kinetics, monomer conversion rates, copolymer sequencing, and viscoelastic response of biodegradable polymers and hydrogels.",
    instrumentsUsed: ["500 MHz Solution NMR", "TGA / DSC", "FTIR"],
  },
];

/**
 * Recent publications made possible by CAIMIF instrumentation
 */
const PUBLICATIONS = [
  {
    title:
      "Atomic-Scale Defect Engineering in 2D MXene Nanosheets for High-Rate Electrochemical Energy Storage",
    journal: "Journal of Materials Chemistry A, 2025",
    doi: "10.1039/D4TA01824J",
    authors: "R. Sharma, K. Verma, A. K. Gupta, et al.",
    instruments: "HR-TEM, Powder XRD",
  },
  {
    title:
      "Targeted Biocompatible Polymer-Coated Iron Oxide Nanocarriers for Enhanced Doxorubicin Delivery",
    journal: "ACS Applied Bio Materials, 2024",
    doi: "10.1021/acsabm.4c00321",
    authors: "S. Trivedi, P. Bansal, V. Singh, et al.",
    instruments: "FE-SEM, 500 MHz NMR",
  },
  {
    title:
      "Ultra-Trace Multi-Elemental Heavy Metal Profiling in Yamuna Basin Sediments Using High-Precision ICP-MS",
    journal: "Environmental Science & Pollution Research, 2024",
    doi: "10.1007/s11356-024-31998-x",
    authors: "M. Kumar, D. Patel, N. Chaudhary",
    instruments: "ICP-MS, Powder XRD",
  },
];

/**
 * Research Page Component
 */
export default function ResearchPage() {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Scientific Excellence
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Research & Innovation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-300">
            Fostering interdisciplinary discoveries through high-precision characterization,
            collaborative research initiatives, and national scientific grants.
          </p>
        </div>

        {/* Thrust Areas Grid */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Research Thrust Areas
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Our instrumentation enables breakthrough investigations across frontier domains:
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESEARCH_DOMAINS.map((domain) => (
              <div
                key={domain.title}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="text-3xl mb-3">{domain.icon}</div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {domain.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-semibold uppercase text-zinc-500">
                    Primary Tools:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {domain.instrumentsUsed.map((inst, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Publications Section */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Recent Publications
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Peer-reviewed research supported by data collected at CAIMIF.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Browse Micrographs in Gallery &rarr;
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {PUBLICATIONS.map((pub, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 max-w-4xl">
                    {pub.title}
                  </h3>
                  <span className="shrink-0 text-xs font-mono font-medium text-zinc-500">
                    DOI: {pub.doi}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    Authors:{" "}
                  </span>
                  {pub.authors}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {pub.journal}
                  </span>
                  <span>Instruments: {pub.instruments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Acknowledgment Policy */}
        <div className="mt-16 rounded-2xl border border-blue-200/90 bg-blue-50/70 p-8 dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="flex items-start gap-4">
            <div className="text-2xl">📝</div>
            <div>
              <h3 className="text-lg font-bold text-blue-950 dark:text-blue-200">
                Mandatory CAIMIF Publication Acknowledgment Policy
              </h3>
              <p className="mt-2 text-sm text-blue-900/90 dark:text-blue-300 leading-relaxed">
                Researchers utilizing the facilities of CAIMIF are required to include the following acknowledgment in their published journal articles, conference proceedings, or patents:
              </p>
              <div className="mt-4 rounded-xl bg-white p-4 font-mono text-xs text-zinc-800 shadow-sm dark:bg-zinc-900 dark:text-zinc-200 select-all border border-blue-200 dark:border-blue-900">
                &ldquo;The authors acknowledge the Central Analytical Instrumentation & Microscopy Facility (CAIMIF), Sharda University, Greater Noida, for providing access to the [Instrument Name] facility for research data collection.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
