"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import GalleryPaginationBar from "./GalleryPaginationBar";
import type { PhotoListProps } from "./types";

/**
 * PhotoList Component
 *
 * Displays a searchable, album-filterable, paginated list of `GalleryImage` records
 * fetched from `/api/gallery-images`, with thumbnail previews, Edit, and Delete controls.
 */
export default function PhotoList({
  photos,
  albums,
  pagination,
  search,
  albumFilter,
  isLoading,
  loadError = null,
  onSearchChange,
  onAlbumFilterChange,
  onPageChange,
  onEdit,
  onDelete,
}: PhotoListProps) {
  const albumTitleMap = new Map(albums.map((album) => [album.id, album.title]));

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      {/* Header, Album Filter & Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Gallery Photos
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total photo{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <select
            aria-label="Filter by album"
            value={albumFilter}
            onChange={(e) => onAlbumFilterChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-xs font-medium text-zinc-700 focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200"
          >
            <option value="">All Albums</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>

          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search photo description..."
            ariaLabel="Search gallery photos"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && photos.length === 0 ? (
        <div className="p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : photos.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load gallery photos from the server."
              : search.trim() || albumFilter
                ? "No photos matched your active filters."
                : "No photos uploaded yet."}
          </p>
          {(search.trim() || albumFilter) && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                onAlbumFilterChange("");
              }}
              className="rounded-xl border border-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="p-5 flex flex-col gap-4">
            {photos.map((photo) => {
              const albumTitle =
                albumTitleMap.get(photo.galleryId) ?? "Unknown Album";

              return (
                <article
                  key={photo.id}
                  className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-[#172554]/35 dark:hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 min-w-0 flex-1">
                    {photo.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={photo.imageUrl}
                        alt={photo.description || albumTitle}
                        className="h-24 w-full sm:w-36 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                      />
                    ) : (
                      <div className="flex h-24 w-full sm:w-36 items-center justify-center rounded-xl bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 text-xs font-semibold shrink-0">
                        No Preview
                      </div>
                    )}

                    <div className="min-w-0 space-y-1.5 flex-1">
                      <span className="inline-flex rounded-full border border-blue-200/80 bg-blue-50/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                        Album: {albumTitle}
                      </span>

                      {photo.description ? (
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                          {photo.description}
                        </p>
                      ) : (
                        <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                          No description provided.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEdit(photo)}
                      className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(photo)}
                      className="rounded-lg border border-rose-200/60 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <GalleryPaginationBar
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
