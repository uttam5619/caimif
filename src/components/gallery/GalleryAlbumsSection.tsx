import React, { Suspense } from "react";
import GalleryAlbumCard, { GalleryAlbumCardSkeleton } from "./GalleryAlbumCard";
import { getAllGalleryAlbums } from "./gallery.data";

function GalleryAlbumsGridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-start">
      <GalleryAlbumCardSkeleton />
      <GalleryAlbumCardSkeleton />
      <GalleryAlbumCardSkeleton />
      <GalleryAlbumCardSkeleton />
    </div>
  );
}

async function GalleryAlbumsGrid() {
  const { items, loadFailed } = await getAllGalleryAlbums();

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {loadFailed
            ? "Gallery albums are temporarily unavailable."
            : "No gallery albums have been added yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-start">
      {items.map((album) => (
        <GalleryAlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}

/**
 * GalleryAlbumsSection Component
 *
 * Loads and renders all `Gallery` album cards inside `<Suspense>` on `/gallery`.
 */
export default function GalleryAlbumsSection() {
  return (
    <section className="w-full">
      <Suspense fallback={<GalleryAlbumsGridSkeleton />}>
        <GalleryAlbumsGrid />
      </Suspense>
    </section>
  );
}
