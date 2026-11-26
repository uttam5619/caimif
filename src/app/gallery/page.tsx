"use client";

import React, { useState } from "react";

/**
 * Gallery item representation
 */
interface GalleryItem {
  id: string;
  title: string;
  category: "Micrographs" | "Instruments" | "Workshops";
  instrument: string;
  magnificationOrDetails: string;
  description: string;
  accentColor: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Zinc Oxide (ZnO) Hexagonal Nanorods",
    category: "Micrographs",
    instrument: "Field Emission SEM",
    magnificationOrDetails: "50,000x | Scale: 500 nm",
    description:
      "Hydrothermally synthesized ZnO nanorods exhibiting well-defined crystalline facets and vertical alignment for ultraviolet photodetector applications.",
    accentColor: "from-blue-600 to-cyan-500",
  },
  {
    id: "gal-2",
    title: "HR-TEM Lattice Fringes of MoS2 Nanosheets",
    category: "Micrographs",
    instrument: "High Resolution TEM (200 kV)",
    magnificationOrDetails: "0.27 nm d-spacing | SAED Pattern",
    description:
      "High-resolution transmission electron micrograph showing atomic lattice fringes and hexagonal selected-area electron diffraction spots in 2D MoS2.",
    accentColor: "from-indigo-600 to-purple-600",
  },
  {
    id: "gal-3",
    title: "Cellular Ultrastructure on Carbon Nanotube Scaffold",
    category: "Micrographs",
    instrument: "FE-SEM (Low Vacuum Mode)",
    magnificationOrDetails: "15,000x | Biological Glutaraldehyde Fixation",
    description:
      "Osteoblast cell adhesion and filopodia spreading over electrospun polymeric fibers reinforced with functionalized multi-walled carbon nanotubes.",
    accentColor: "from-emerald-600 to-teal-500",
  },
  {
    id: "gal-4",
    title: "Atomic Force Microscopy (AFM) 3D Surface Topography",
    category: "Micrographs",
    instrument: "AFM (PeakForce Tapping)",
    magnificationOrDetails: "5 um x 5 um Scan | RMS Roughness: 1.4 nm",
    description:
      "Three-dimensional topographic map of atomic-layer-deposited titanium oxide thin film on silicon substrate revealing nanoscale grain boundaries.",
    accentColor: "from-amber-500 to-orange-600",
  },
  {
    id: "gal-5",
    title: "Advanced FE-SEM & EDS Cleanroom Suite",
    category: "Instruments",
    instrument: "JEOL JSM-IT800 Installation",
    magnificationOrDetails: "Vibration-isolated chamber | Class 10,000 Cleanroom",
    description:
      "State-of-the-art electron optics column mounted on an active pneumatic vibration isolation table within an acoustically insulated chamber.",
    accentColor: "from-blue-700 to-indigo-800",
  },
  {
    id: "gal-6",
    title: "500 MHz Bruker Ascend UltraShield NMR Console",
    category: "Instruments",
    instrument: "500 MHz NMR Unit",
    magnificationOrDetails: "Liquid Helium Cryostat | 11.74 Tesla",
    description:
      "Superconducting high-field NMR magnet assembly with automated 24-sample changer and broadband temperature-regulated probe station.",
    accentColor: "from-violet-700 to-purple-800",
  },
  {
    id: "gal-7",
    title: "Hands-on Workshop on Electron Microscopy & Microanalysis",
    category: "Workshops",
    instrument: "National Scientific Workshop",
    magnificationOrDetails: "50+ Participants | Faculty & PhD Scholars",
    description:
      "Five-day intensive training workshop covering specimen preparation, critical point drying, carbon sputtering, and live EDS mapping operations.",
    accentColor: "from-rose-600 to-pink-600",
  },
  {
    id: "gal-8",
    title: "Powder XRD Rietveld Refinement Masterclass",
    category: "Workshops",
    instrument: "Hands-on Software Training",
    magnificationOrDetails: "FullProf & HighScore Plus | 40 Scholars",
    description:
      "Practical computing session on indexing diffraction patterns, phase quantification, peak broadening strain analysis, and structural solving.",
    accentColor: "from-teal-600 to-emerald-700",
  },
];

const CATEGORIES = ["All", "Micrographs", "Instruments", "Workshops"] as const;

/**
 * Gallery Page Component
 */
export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredItems =
    selectedCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Visual Showcase
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Facility Gallery & Micrographs
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-300">
            A visual showcase of atomic-scale imaging, nanoscale surface morphology,
            advanced instrumentation bays, and scientific training workshops held at CAIMIF.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Image Graphic / Placeholder Banner */}
              <div
                className={`relative flex h-52 w-full flex-col justify-between bg-gradient-to-br ${item.accentColor} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded">
                    {item.instrument}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono font-medium opacity-85">
                    {item.magnificationOrDetails}
                  </div>
                  <div className="text-lg font-bold tracking-tight mt-1">
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Instrument: {item.instrument}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    High Resolution
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
