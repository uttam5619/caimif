import React from "react";
import HeroSection from "@/components/home/HeroSection";
import AboutCaimif from "@/components/home/about/AboutCaimif";
import FeaturedResearch from "@/components/home/featuredResearch/FeaturedResearch";
import MessageFromCaimifHead from "@/components/home/messageFromCaimifHead/MessageFromCaimifHead";
import ResearchDomain from "@/components/home/researchDomain/ResearchDomain";

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

      {/* Featured Research Publications & Highlights */}
      <FeaturedResearch />


    </div>
  );
}
