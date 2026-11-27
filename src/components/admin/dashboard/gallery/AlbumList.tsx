"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import GalleryPaginationBar from "./GalleryPaginationBar";
import type { AlbumListProps } from "./types";

/**
 * AlbumList Component
 *
 * Displays a searchable, paginated list of Gallery albums fetched from `/api/galleries`,
 * with cover thumbnails, image counts, Edit, and Delete controls.
 */
export default function AlbumList({
  albums,
  pagination,
  search,
  isLoading,
  loadError = null,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
}: AlbumListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      {/* Header & Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Gallery Albums
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total album{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search album title, description..."
          ariaLabel="Search gallery albums"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && albums.length === 0 ? (
        <div className="p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : albums.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load gallery albums from the server."
              : search.trim()
                ? `No albums matched "${search.trim()}".`
                : "No gallery albums created yet."}
          </p>
          {search.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="rounded-xl border border-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="p-5 flex flex-col gap-4">
            {albums.map((album) => {
              const coverUrl = album.images[0]?.imageUrl;

              return (
                <article
                  key={album.id}
                  className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-[#172554]/35 dark:hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 min-w-0 flex-1">
                    {coverUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={coverUrl}
                        alt={album.title}
                        className="h-24 w-full sm:w-36 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                      />
                    ) : (
                      <div className="flex h-24 w-full sm:w-36 items-center justify-center rounded-xl bg-blue-50 text-[#172554] dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold shrink-0">
                        {album.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words">
                          {album.title}
                        </h3>
                        <span className="inline-flex rounded-full border border-blue-200/80 bg-blue-50/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                          {album.imageCount}{" "}
                          {album.imageCount === 1 ? "photo" : "photos"}
                        </span>
                      </div>

                      {album.description ? (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">
                          {album.description.length > 220
                            ? `${album.description.slice(0, 220)}...`
                            : album.description}
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
                      onClick={() => onEdit(album)}
                      className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(album)}
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
