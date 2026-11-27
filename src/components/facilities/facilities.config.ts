import type { FacilityHeroConfig, HardwareCardItem } from "./types";

/**
 * Static configuration and hardware specification table for the Facilities hero section.
 * Decoupled from FacilityHeroSection JSX to adhere to SRP and OCP.
 */
export const FACILITY_HERO_CONFIG: FacilityHeroConfig = {
  title: "NVIDIA DGX H100 Supercomputer & Other Hardware",
  imageSrc: "/images/nvidia-dgx-h100.webp",
  imageAlt: "NVIDIA DGX H100 Supercomputer rack installed at CAIMIF",
  specsHeading: "Specifications",
  description:
    "The fourth generation of the most powerful supercomputer for machine learning and AI calculations, equipped with eight Hopper architecture GPUs, delivering unprecedented performance for complex scientific and industrial applications.",
  specs: [
    { label: "GPU", value: "8x NVIDIA H100 Tensor Core GPUs" },
    { label: "GPU memory", value: "640GB total" },
    { label: "Performance", value: "32 petaFLOPS FP8" },
    { label: "System power usage", value: "10.2kW max" },
    {
      label: "CPU",
      value: "Dual Intel Xeon Platinum 8480C (2.0 GHz base, 3.8 GHz boost)",
    },
    { label: "System memory", value: "2TB" },
    { label: "Networking", value: "4x OSFP ports, up to 400Gb/s" },
    { label: "Management network", value: "2x dual-port ConnectX-7 VPI" },
    { label: "Storage", value: "OS: 2x 192TB NVMe M.2" },
  ],
};

export const OTHER_HARDWARE_SECTION_TITLE = "Other Hardware";

export const OTHER_HARDWARE_DESCRIPTION =
  "Together, the NVIDIA DGX H100 supercomputer, Dell R650Xs servers, high-performance virtualization compute node, and enterprise GPU virtualization software form an integrated high-performance computing environment at CAIMIF—supporting large-scale deep learning training, medical imaging analysis, and collaborative AI research.";

/**
 * Verbatim specification cards for secondary cluster compute & software stack
 * displayed directly below the DGX H100 hero section on /facilities.
 */
export const OTHER_HARDWARE_CARDS: HardwareCardItem[] = [
  {
    id: "dell-r650xs",
    title: "Dell R650Xs Servers (2 units)",
    imageSrc: "/images/dell-r650xs.jpg",
    imageAlt: "Dell R650Xs Servers",
    imageFit: "cover",
    specs: [
      "2 Intel Xeon Silver processors (24 cores total)",
      "128GB RAM",
      "4TB storage",
    ],
  },
  {
    id: "hexadata-virtualization-server",
    title: "High Performance Virtualization Compute Server",
    imageSrc: "/images/hexadata-compute-server.jpg",
    imageAlt: "High Performance Virtualization Compute Server",
    imageFit: "cover",
    specs: [
      "HexaData 4 GPU 4U Rack Chassis with 2 x 2200W Power Supply",
      "2 x Xeon Silver 4210R Processors (10 Cores @ 2.4GHz)",
      "RAM 256GB, 16TB SSDr",
      "NVidia Tesla T4 16GB GPU",
    ],
  },
  {
    id: "server-software",
    title: "Server Software",
    imageSrc: "/images/vmware-horizon-view.webp",
    imageAlt: "VMware Horizon View Server Software",
    imageFit: "contain",
    specs: [
      "NVidia Quadro vDWS Subscription, NVidia Virtual Compute Server",
      "Academic VMware Horizon 7 Enterprise",
    ],
  },
];

export const TOOLS_SECTION_TITLE = "Tools And Softwares";

export const TOOLS_SECTION_DESCRIPTION =
  "Explore the specialized research software suites, computational simulation platforms, and domain-specific toolkits available across CAIMIF computing infrastructure.";
