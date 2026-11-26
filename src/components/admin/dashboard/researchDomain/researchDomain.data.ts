import type { ResearchDomain } from "./types";

/**
 * Initial static mock dataset for CAIMIF Research Domains.
 * Decoupled from the ResearchDomainView UI component to adhere to SRP and OCP.
 */
export const INITIAL_DOMAINS: ResearchDomain[] = [
  {
    id: "RD-001",
    title: "Medical Imaging & Diagnostic Radiology",
    shortDescription: "AI algorithms for medical scans and clinical reporting",
    description:
      "Deep learning algorithms for CT, MRI, and ultrasound image segmentation, lesion detection, and automated clinical reporting.",
  },
  {
    id: "RD-002",
    title: "Forensic Biometrics & Pattern Recognition",
    shortDescription: "Forensic evidence analysis and digital biometrics",
    description:
      "AI-driven forensic evidence analysis, 3D facial reconstruction, fingerprint enhancement, and digital multimedia forensics.",
  },
  {
    id: "RD-003",
    title: "Computational Genomics & Precision Medicine",
    shortDescription: "Genomic variant analysis and targeted diagnostics",
    description:
      "High-throughput machine learning workflows for genomic variant impact scoring, transcriptomic profiling, and targeted drug diagnostics.",
  },
];
