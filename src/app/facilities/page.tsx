"use client";

import React, { useState } from "react";
import Link from "next/link";

/**
 * Detailed instrumentation inventory for CAIMIF
 */
const INSTRUMENTS = [
  {
    id: "fesem",
    name: "Field Emission Scanning Electron Microscope (FE-SEM)",
    model: "JEOL JSM-IT800 / Carl Zeiss Gemini",
    category: "Microscopy",
    description:
      "Ultra-high resolution imaging of conductive and non-conductive surfaces at low accelerating voltages, equipped with EDS for elemental spot, line, and mapping analysis.",
    specs: [
      "Resolution: 0.9 nm at 15 kV, 1.3 nm at 1 kV",
      "Magnification: 20x to 1,000,000x",
      "Detector Suite: In-lens SE, Backscatter (BSE), Oxford EDS detector",
      "Vacuum: High vacuum and low vacuum mode for outgassing samples",
    ],
    sampleRequirements:
      "Dry, solid, vacuum-compatible samples. Max diameter 50 mm, thickness < 10 mm. Non-conductive samples require gold/carbon sputtering.",
    rates: {
      internal: "₹ 500 / sample",
      academic: "₹ 1,500 / sample",
      industry: "₹ 4,000 / sample",
    },
  },
  {
    id: "hrtem",
    name: "High Resolution Transmission Electron Microscope (HR-TEM)",
    model: "Thermo Scientific Talos F200X (200 kV)",
    category: "Microscopy",
    description:
      "Atomic-scale resolution TEM and STEM capabilities with high-speed 4-quadrant Super-X EDS detection for elemental nanometer chemical characterization.",
    specs: [
      "Accelerating Voltage: 80 kV to 200 kV",
      "TEM Point Resolution: 0.24 nm | Information limit: 0.12 nm",
      "STEM HAADF Resolution: 0.16 nm",
      "Diffraction: Selected Area Electron Diffraction (SAED)",
    ],
    sampleRequirements:
      "Samples must be ultra-thin (< 100 nm) dispersed on a 3 mm carbon-coated copper/nickel grid. Completely dry and solvent-free.",
    rates: {
      internal: "₹ 1,000 / sample",
      academic: "₹ 3,000 / sample",
      industry: "₹ 8,000 / sample",
    },
  },
  {
    id: "xrd",
    name: "Powder X-Ray Diffractometer (XRD)",
    model: "Rigaku SmartLab / Malvern Panalytical Empyrean",
    category: "Diffraction",
    description:
      "Versatile theta-theta geometry diffractometer for crystal phase identification, thin film grazing incidence diffraction (GIXRD), and stress/texture analysis.",
    specs: [
      "X-Ray Source: Cu K-alpha (wavelength = 1.5406 Angstrom)",
      "Detector: High-speed 1D/2D silicon strip detector",
      "Angular Range: 2-theta from 2 deg to 140 deg",
      "Sample stages: Flat powder stage, capillary spinner, thin-film stage",
    ],
    sampleRequirements:
      "Finely ground homogeneous powder (minimum 100-200 mg) or smooth flat thin film (min 10x10 mm).",
    rates: {
      internal: "₹ 250 / sample",
      academic: "₹ 600 / sample",
      industry: "₹ 2,000 / sample",
    },
  },
  {
    id: "nmr",
    name: "500 MHz Nuclear Magnetic Resonance Spectrometer (NMR)",
    model: "Bruker Avance NEO 500 MHz",
    category: "Spectroscopy",
    description:
      "Multi-nuclear high-resolution solution state NMR for 1D and 2D correlation experiments to determine organic, organometallic, and biomolecular structures.",
    specs: [
      "Magnetic Field: 11.74 Tesla (500 MHz 1H resonance frequency)",
      "Probe: 5 mm broadband BBFO probe with automatic tuning (ATMA)",
      "Supported Nuclei: 1H, 13C, 19F, 31P, 29Si, 11B, 15N",
      "Temperature Control Range: -40 deg C to +120 deg C",
    ],
    sampleRequirements:
      "10-20 mg for 1H NMR, 30-50 mg for 13C/2D NMR dissolved in 0.6 mL deuterated solvent (CDCl3, DMSO-d6, D2O, CD3OD) in a 5 mm NMR tube.",
    rates: {
      internal: "₹ 300 / sample (1H)",
      academic: "₹ 800 / sample (1H)",
      industry: "₹ 2,500 / sample (1H)",
    },
  },
  {
    id: "afm",
    name: "Atomic Force Microscope (AFM)",
    model: "Bruker Dimension Icon / Park NX10",
    category: "Microscopy",
    description:
      "Quantitative nanomechanical and 3D surface topography mapping with sub-angstrom vertical resolution in both contact, tapping, and PeakForce Tapping modes.",
    specs: [
      "XY Scan Range: 90 um x 90 um | Z Range: 10 um",
      "Vertical Noise Floor: < 0.03 nm RMS",
      "Modes: Tapping, Contact, Phase Imaging, Magnetic Force (MFM), Conductive AFM (C-AFM)",
    ],
    sampleRequirements:
      "Rigid solid flat substrate (silicon, mica, glass) with surface roughness < 1 um. Maximum sample size 25x25 mm.",
    rates: {
      internal: "₹ 400 / sample",
      academic: "₹ 1,200 / sample",
      industry: "₹ 3,500 / sample",
    },
  },
  {
    id: "tga-dsc",
    name: "Simultaneous Thermal Analyzer (TGA / DSC)",
    model: "TA Instruments SDT 650",
    category: "Thermal",
    description:
      "Simultaneous measurement of heat flow (DSC) and weight change (TGA) on the same sample to study decomposition, phase transitions, oxidation, and stability.",
    specs: [
      "Temperature Range: Ambient to 1500 deg C",
      "Balance Sensitivity: 0.1 ug",
      "Purge Gas: Nitrogen, Argon, Air with automated gas switching",
      "Calorimetric Accuracy: +/- 2%",
    ],
    sampleRequirements:
      "10 to 20 mg powder or tiny solid chunk. Non-explosive and non-corrosive under high thermal degradation.",
    rates: {
      internal: "₹ 300 / sample",
      academic: "₹ 800 / sample",
      industry: "₹ 2,500 / sample",
    },
  },
  {
    id: "icpms",
    name: "Inductively Coupled Plasma Mass Spectrometer (ICP-MS)",
    model: "Agilent 7900 ICP-MS",
    category: "Thermal",
    description:
      "Ultra-trace multi-elemental analysis capable of measuring parts-per-trillion (ppt) to parts-per-billion (ppb) concentrations across the periodic table.",
    specs: [
      "Matrix Tolerance: Up to 25% total dissolved solids (TDS)",
      "Dynamic Range: 10 orders of magnitude",
      "Collision/Reaction Cell (CRC) for interference removal",
    ],
    sampleRequirements:
      "Liquid solutions completely digested in trace-metal grade nitric acid, particle-free filtered through 0.22 um filter.",
    rates: {
      internal: "₹ 600 / sample",
      academic: "₹ 1,800 / sample",
      industry: "₹ 5,000 / sample",
    },
  },
  {
    id: "ftir-raman",
    name: "Confocal Raman & FTIR Spectrometer Suite",
    model: "Horiba LabRAM HR Evolution / Bruker Tensor II",
    category: "Spectroscopy",
    description:
      "High-resolution Raman mapping with multiple laser excitation lines (532 nm, 785 nm) alongside ATR-FTIR for organic functional group and defect analysis.",
    specs: [
      "Lasers: 532 nm (solid state) and 785 nm (diode laser)",
      "Spectral Resolution: < 0.5 cm^-1",
      "FTIR Range: 4000 to 400 cm^-1 (Diamond ATR crystal)",
    ],
    sampleRequirements:
      "Solid powders, thin films, polymer films, or non-fluorescent liquid solutions.",
    rates: {
      internal: "₹ 250 / sample",
      academic: "₹ 700 / sample",
      industry: "₹ 2,000 / sample",
    },
  },
];

const CATEGORIES = ["All", "Microscopy", "Diffraction", "Spectroscopy", "Thermal"];

/**
 * Facilities Page Component
 */
export default function FacilitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredInstruments =
    selectedCategory === "All"
      ? INSTRUMENTS
      : INSTRUMENTS.filter((inst) => inst.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Research Infrastructure
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Analytical Facilities & Instrumentation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-300">
            Explore our comprehensive suite of advanced instrumentation. Review technical
            specifications, sample preparation criteria, and subsidized tariff structures.
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

        {/* Instruments Grid */}
        <div className="mt-12 space-y-8">
          {filteredInstruments.map((inst) => (
            <div
              key={inst.id}
              id={inst.id}
              className="scroll-mt-24 rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {inst.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
                      Model: {inst.model}
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {inst.name}
                  </h2>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 max-w-4xl leading-relaxed">
                    {inst.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <Link
                    href="/contectus"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                  >
                    Request Slot
                  </Link>
                </div>
              </div>

              {/* Technical Specifications & Sample Prep */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Key Specifications
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                    {inst.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Sample Requirements
                  </h3>
                  <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 dark:bg-zinc-950/60 dark:border-zinc-800">
                    {inst.sampleRequirements}
                  </p>
                </div>
              </div>

              {/* Rate Matrix */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                  Subsidized User Charges
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="text-xs font-medium text-zinc-500">Sharda Internal</div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                      {inst.rates.internal}
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="text-xs font-medium text-zinc-500">External Academic</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {inst.rates.academic}
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="text-xs font-medium text-zinc-500">Industry / Corporate</div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                      {inst.rates.industry}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Booking Workflow */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white sm:p-12 shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl text-center">
            How to Book an Instrument Slot
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-blue-200">01</div>
              <h3 className="mt-2 font-bold text-lg">Prepare Samples</h3>
              <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                Ensure samples strictly adhere to purity, vacuum, and size criteria outlined above.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-blue-200">02</div>
              <h3 className="mt-2 font-bold text-lg">Submit Requisition</h3>
              <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                Fill the online booking form or submit endorsed request with faculty recommendation.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-blue-200">03</div>
              <h3 className="mt-2 font-bold text-lg">Analysis Run</h3>
              <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                Attend scheduled slot or have scientific staff run samples under certified conditions.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-blue-200">04</div>
              <h3 className="mt-2 font-bold text-lg">Data & Reports</h3>
              <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                Receive calibrated raw and processed data (.dm4, .raw, .fid, .spc) securely via cloud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
