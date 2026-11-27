/**
 * Data contracts for the Facilities page hero section.
 */

export interface FacilitySpecItem {
  label: string;
  value: string;
}

export interface FacilityHeroConfig {
  title: string;
  imageSrc: string;
  imageAlt: string;
  specsHeading: string;
  description: string;
  specs: FacilitySpecItem[];
}

export interface HardwareCardItem {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  specs: string[];
}
