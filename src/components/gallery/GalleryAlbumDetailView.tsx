import React from "react";
import Link from "next/link";
import GalleryPhotoCard from "./GalleryPhotoCard";
import type { GalleryAlbumDetailViewProps } from "./types";

/**
 * GalleryAlbumDetailView Component
 *
 * Displays a selected `Gallery` album's title, description, back link,
 * and responsive grid of all photographs inside `/gallery/[id]`.
 */
export default function GalleryAlbumDetailView({
  album,
}: GalleryAlbumDetailViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#172554] hover:underline dark:text-blue-400"
        >
          &larr; Back to Gallery Albums
        </Link>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {album.title}
            </h1>
            {album.description && (
              <p className="max-w-3xl text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {album.description}
              </p>
            )}
          </div>

          <span className="shrink-0 self-start rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {album.imageCount} {album.imageCount === 1 ? "Photo" : "Photos"}
          </span>
        </div>
      </div>

      {album.images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            No photos have been uploaded to this album yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.images.map((photo) => (
            <GalleryPhotoCard
              key={photo.id}
              photo={photo}
              albumTitle={album.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
