import React from "react";
import { GALLERY_PAGE_HEADER } from "./gallery.config";

/**
 * GalleryHeroHeader Component
 *
 * Displays the top heading and overview on the public `/gallery` page.
 */
export default function GalleryHeroHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-[#172554] dark:bg-blue-950 dark:text-blue-300">
        {GALLERY_PAGE_HEADER.badge}
      </span>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        {GALLERY_PAGE_HEADER.title}
      </h1>
      <p className="mt-4 text-base sm:text-sm text-zinc-600 dark:text-zinc-300">
        {GALLERY_PAGE_HEADER.subtitle}
      </p>
    </div>
  );
}
