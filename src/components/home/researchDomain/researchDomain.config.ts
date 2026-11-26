import { ResearchDomainItem } from "./types";

/**
 * Header text and descriptive metadata for the ResearchDomain section.
 */
export const RESEARCH_DOMAIN_HEADER = {
  badge: "Interdisciplinary Research Frontiers",
  title: "Thrust Areas Driving Scientific Breakthroughs",
  subtitle:
    "CAIMIF integrates deep computational intelligence with world-class central instrumentation to power transformative investigations across medicine, imaging, forensics, and material science.",
};

/**
 * Primary research domains supported by CAIMIF infrastructure.
 * Decoupled from JSX to satisfy component architecture rules.
 */
export const RESEARCH_DOMAINS: ResearchDomainItem[] = [
  {
    id: "ai-medicine",
    title: "AI in Medicine & Precision Healthcare",
    badge: "Clinical AI & Oncology",
    description:
      "Developing explainable deep learning models for early cancer detection, genomic biomarker discovery, computational pathology, and predictive clinical prognosis.",
    tools: ["Clinical Data Lake", "Deep Learning Cluster", "Genomic Pipeline"],
    icon: "medicine",
    href: "/research#medicine",
  },
  {
    id: "ai-imaging",
    title: "AI in Medical & Material Imaging",
    badge: "Computer Vision & Microscopy",
    description:
      "Harnessing computer vision on data acquired from electron microscopes and clinical scanners to achieve atomic defect profiling, automated radiological segmentation, and 3D tissue reconstruction.",
    tools: ["FE-SEM (1.0 nm)", "HR-TEM (200 kV)", "Vision Transformers"],
    icon: "imaging",
    href: "/research#imaging",
  },
  {
    id: "ai-forensics",
    title: "AI in Forensic Science & Biometrics",
    badge: "Investigative AI & Security",
    description:
      "Pioneering automated biometric verification (face, fingerprint, iris), digital evidence forensics, spectroscopic chemical trace identification, and document forgery authentication.",
    tools: ["Confocal Raman", "500 MHz NMR", "Neural Biometrics"],
    icon: "forensics",
    href: "/research#forensics",
  },
  {
    id: "nanomaterials",
    title: "Advanced Nanomaterials & 2D Crystals",
    badge: "Nanotechnology & Surfaces",
    description:
      "Synthesizing and characterizing graphene, MXenes, transition metal dichalcogenides (TMDs), and Metal-Organic Frameworks (MOFs) with atomic lattice fringe resolution.",
    tools: ["HR-TEM (0.19 nm)", "FE-SEM with EDS", "Powder XRD"],
    icon: "nanomaterials",
    href: "/facilities#hrtem",
  },
  {
    id: "energy-systems",
    title: "Energy Storage & Electrochemical Systems",
    badge: "Clean Energy Tech",
    description:
      "Investigating in-situ phase transitions, electrode degradation kinetics, solid electrolyte interfaces (SEI), and crystal morphology in Lithium-ion and next-generation battery chemistries.",
    tools: ["In-situ Powder XRD", "TGA / DSC", "FE-SEM"],
    icon: "energy",
    href: "/facilities#xrd",
  },
  {
    id: "biomaterials",
    title: "Biomaterials & Molecular Spectroscopy",
    badge: "Chemical Biology",
    description:
      "High-field multi-nuclear 1D/2D NMR structure elucidation of synthetic biomacromolecules, targeted drug-delivery nanoparticles, and polymer degradation kinetics.",
    tools: ["500 MHz Solution NMR", "Confocal Raman", "FTIR Spectroscopy"],
    icon: "biomaterials",
    href: "/facilities#nmr",
  },
];
