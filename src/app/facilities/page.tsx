"use client";

import React, { useState } from "react";
import Link from "next/link";
import FacilityHeroSection from "@/components/facilities/FacilityHeroSection";
import OtherHardwareSection from "@/components/facilities/OtherHardwareSection";
import ToolComponent from "@/components/facilities/ToolComponent";

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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FacilityHeroSection />
        <OtherHardwareSection />
        <ToolComponent />
      </div>
    </div>
  );
}
