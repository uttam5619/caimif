import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import GalleryAlbumDetailView from "@/components/gallery/GalleryAlbumDetailView";
import { getGalleryAlbumById } from "@/components/gallery/gallery.data";

interface GalleryAlbumPageProps {
  params: Promise<{ id: string }>;
}

function GalleryAlbumDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/70" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="aspect-[4/3] rounded-2xl bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="aspect-[4/3] rounded-2xl bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="aspect-[4/3] rounded-2xl bg-zinc-200/80 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

async function GalleryAlbumLoader({ params }: GalleryAlbumPageProps) {
  const { id } = await params;
  const album = await getGalleryAlbumById(id);

  if (!album) {
    notFound();
  }

  return <GalleryAlbumDetailView album={album} />;
}

/**
 * Dynamic Gallery Album Page (`/gallery/[id]`)
 *
 * Displays all photographs belonging to the selected gallery album.
 */
export default function GalleryAlbumPage({ params }: GalleryAlbumPageProps) {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<GalleryAlbumDetailSkeleton />}>
          <GalleryAlbumLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
