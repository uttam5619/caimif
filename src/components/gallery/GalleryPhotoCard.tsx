import React from "react";
import type { GalleryPhotoCardProps } from "./types";

/**
 * GalleryPhotoCard Component
 *
 * Displays an individual photograph and its description inside `/gallery/[id]`.
 */
export default function GalleryPhotoCard({
  photo,
  albumTitle,
}: GalleryPhotoCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {photo.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo.imageUrl}
            alt={photo.description || albumTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
            Image unavailable
          </div>
        )}
      </div>

      {photo.description && (
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
            {photo.description}
          </p>
        </div>
      )}
    </article>
  );
}
