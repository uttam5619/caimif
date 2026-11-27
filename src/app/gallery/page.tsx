import React from "react";
import GalleryAlbumsSection from "@/components/gallery/GalleryAlbumsSection";
import GalleryHeroHeader from "@/components/gallery/GalleryHeroHeader";

/**
 * Gallery Page Component (`/gallery`)
 *
 * Thin route orchestrator composing `GalleryHeroHeader` and `GalleryAlbumsSection`
 * from `src/components/gallery/`.
 */
export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <GalleryHeroHeader />
        <GalleryAlbumsSection />
      </div>
    </div>
  );
}
