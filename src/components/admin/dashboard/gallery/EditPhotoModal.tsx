"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  EditPhotoModalProps,
  GalleryAlbumRecord,
  GalleryImageRecord,
} from "./types";

interface EditPhotoFormInnerProps {
  photo: GalleryImageRecord;
  albums: GalleryAlbumRecord[];
  onClose: () => void;
  onSave: (photoId: string, payload: FormData) => Promise<void> | void;
}

function EditPhotoFormInner({
  photo,
  albums,
  onClose,
  onSave,
}: EditPhotoFormInnerProps) {
  const [galleryId, setGalleryId] = useState(photo.galleryId);
  const [description, setDescription] = useState(photo.description ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    setSelectedFile(file);
  };

  const handleClearSelection = () => {
    revokePreview();
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = new FormData();
    if (galleryId) {
      payload.append("galleryId", galleryId);
    }
    payload.append("description", description.trim());
    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    setIsSaving(true);
    try {
      await onSave(photo.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update photo.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = previewUrl ?? photo.imageUrl;

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      <div>
        <label htmlFor="edit-photo-album" className={labelClass}>
          Album
        </label>
        <select
          id="edit-photo-album"
          value={galleryId}
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
        <label htmlFor="edit-photo-file" className={labelClass}>
          Replace Photo
        </label>
        {displayImage && (
          <div className="mb-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt="Gallery photo preview"
              className="h-20 w-32 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
            />
            {selectedFile && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="rounded-lg border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        )}
        <input
          id="edit-photo-file"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={handleFileChange}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-1.5 text-xs text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#172554] file:px-3 file:py-1 file:text-[11px] file:font-semibold file:text-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
        />
      </div>

      <div>
        <label htmlFor="edit-photo-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="edit-photo-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={textareaClass}
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#172554] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/**
 * EditPhotoModal Component
 *
 * Modal dialog for editing an existing `GalleryImage` without scrollbars.
 */
export default function EditPhotoModal({
  isOpen,
  photo,
  albums,
  onClose,
  onSave,
}: EditPhotoModalProps) {
  if (!isOpen || !photo) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-photo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h3
            id="edit-photo-modal-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100"
          >
            Edit Photo
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit photo modal"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <EditPhotoFormInner
          key={photo.id}
          photo={photo}
          albums={albums}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
