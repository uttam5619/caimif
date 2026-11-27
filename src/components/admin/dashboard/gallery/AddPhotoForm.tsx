"use client";

import React, { useEffect, useRef, useState } from "react";
import { createGalleryPhoto } from "@/lib/api/gallery.api";
import type { AddPhotoFormProps, GalleryImageRecord } from "./types";

/**
 * AddPhotoForm Component
 *
 * Collects attributes synchronized with `GalleryImage` in `prisma/models/gallery.prisma`:
 * - galleryId (required parent Gallery album ID)
 * - image (required image file persisted as S3 key)
 * - description (optional String? @db.Text)
 */
export default function AddPhotoForm({
  albums,
  onSubmitPhoto,
  onSuccess,
  onRequestAddAlbum,
}: AddPhotoFormProps) {
  const [galleryId, setGalleryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    revokePreview();

    if (file && file.type.startsWith("image/")) {
      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    }

    setImageFile(file);
  };

  const handleRemoveFile = () => {
    revokePreview();
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const selectedAlbumId = galleryId || albums[0]?.id || "";
    if (!selectedAlbumId) {
      setErrorMsg("Please create and select an album first.");
      return;
    }
    if (!imageFile) {
      setErrorMsg("Please select a photo to upload.");
      return;
    }

    const payload = new FormData();
    payload.append("galleryId", selectedAlbumId);
    payload.append("image", imageFile);
    if (description.trim()) {
      payload.append("description", description.trim());
    }

    setIsLoading(true);
    try {
      const created: GalleryImageRecord = onSubmitPhoto
        ? await onSubmitPhoto(payload)
        : await createGalleryPhoto(payload);

      setDescription("");
      handleRemoveFile();
      setSuccessMsg("Photo uploaded to album successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to upload photo.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveAlbumId = galleryId || albums[0]?.id || "";

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Add Photo to Album
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Upload an image into an existing CAIMIF gallery album.
        </p>
      </div>

      {albums.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/40 space-y-3">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            No gallery albums exist yet. Create an album before uploading photos.
          </p>
          {onRequestAddAlbum && (
            <button
              type="button"
              onClick={onRequestAddAlbum}
              className="rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a] transition-colors cursor-pointer"
            >
              Go to Add Album
            </button>
          )}
        </div>
      ) : (
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
            <label htmlFor="gallery-photo-album" className={labelClass}>
              Select Album <span className="text-rose-500">*</span>
            </label>
            <select
              id="gallery-photo-album"
              value={effectiveAlbumId}
              onChange={(e) => setGalleryId(e.target.value)}
              className={inputClass}
            >
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="gallery-photo-file" className={labelClass}>
              Photo File <span className="text-rose-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              id="gallery-photo-file"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#172554] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1e3a8a] dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
            />
            {previewUrl && (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected photo preview"
                  className="h-24 w-36 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gallery-photo-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="gallery-photo-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional caption or description for this photograph..."
              className={textareaClass}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Uploading Photo..." : "Add Photo"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
