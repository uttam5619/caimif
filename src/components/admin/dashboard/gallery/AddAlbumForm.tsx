"use client";

import React, { useState } from "react";
import { createGalleryAlbum } from "@/lib/api/gallery.api";
import type { AddAlbumFormProps, GalleryAlbumRecord } from "./types";

/**
 * AddAlbumForm Component
 *
 * Collects attributes synchronized with `Gallery` in `prisma/models/gallery.prisma`:
 * - title (required String)
 * - description (optional String? @db.Text)
 */
export default function AddAlbumForm({
  onSubmitAlbum,
  onSuccess,
}: AddAlbumFormProps = {}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setErrorMsg("Please enter an album title.");
      return;
    }

    const payload = {
      title: cleanTitle,
      description: cleanDescription || null,
    };

    setIsLoading(true);
    try {
      const created: GalleryAlbumRecord = onSubmitAlbum
        ? await onSubmitAlbum(payload)
        : await createGalleryAlbum(payload);

      setTitle("");
      setDescription("");
      setSuccessMsg(`Album "${created.title}" created successfully.`);

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create album.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Add Gallery Album
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Create a new album to organize CAIMIF laboratory micrographs, facilities, and event photographs.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        <div>
          <label htmlFor="gallery-album-title" className={labelClass}>
            Album Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="gallery-album-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Electron Microscopy Lab"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="gallery-album-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="gallery-album-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this photo album..."
            className={textareaClass}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Creating Album..." : "Add Album"}
          </button>
        </div>
      </form>
    </div>
  );
}
