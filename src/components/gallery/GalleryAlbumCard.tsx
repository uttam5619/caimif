import React from "react";
import Link from "next/link";
import type { GalleryAlbumCardProps } from "./types";

/**
 * Loading skeleton matching an individual `GalleryAlbumCard`.
 */
export function GalleryAlbumCardSkeleton() {
  return (
    <div className="flex w-full max-w-[300px] flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div className="h-44 w-full bg-zinc-200/80 dark:bg-zinc-800" />
      <div className="p-5 space-y-2.5">
        <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-4 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800/70" />
      </div>
    </div>
  );
}

/**
 * GalleryAlbumCard Component
 *
 * Clickable album card displayed on `/gallery`. Clicking anywhere on the card
 * navigates to `/gallery/[id]` to inspect all photos belonging to that album.
 */
export default function GalleryAlbumCard({ album }: GalleryAlbumCardProps) {
  const coverUrl = album.images[0]?.imageUrl;

  return (
    <Link
      href={`/gallery/${album.id}`}
      className="group flex w-full max-w-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
    >
      <div>
        {/* Cover Thumbnail */}
        <div className="relative h-44 w-full overflow-hidden border-b border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
          {coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverUrl}
              alt={album.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#172554]/5 text-[#172554]/45 dark:bg-blue-950/30 dark:text-blue-300/60">
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-zinc-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
            {album.imageCount} {album.imageCount === 1 ? "Photo" : "Photos"}
          </span>
        </div>

        {/* Album Metadata */}
        <div className="p-6 space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#172554] dark:group-hover:text-blue-300 transition-colors">
            {album.title}
          </h2>

          {album.description ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
              {album.description}
            </p>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
              Click to browse photos in this album.
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-[#172554] dark:text-blue-400">
        <span>Open Album</span>
        <span className="transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </div>
    </Link>
  );
}
