"use client";

import React, { useState } from "react";
import type { EditAlbumModalProps, GalleryAlbumRecord } from "./types";

interface EditAlbumFormInnerProps {
  album: GalleryAlbumRecord;
  onClose: () => void;
  onSave: (
    albumId: string,
    payload: { title?: string; description?: string | null }
  ) => Promise<void> | void;
}

function EditAlbumFormInner({
  album,
  onClose,
  onSave,
}: EditAlbumFormInnerProps) {
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    const payload: { title?: string; description?: string | null } = {
      title: cleanTitle || album.title,
      description: cleanDescription || null,
    };

    setIsSaving(true);
    try {
      await onSave(album.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update album.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

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
        <label htmlFor="edit-album-title" className={labelClass}>
          Album Title
        </label>
        <input
          id="edit-album-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="edit-album-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="edit-album-description"
          rows={4}
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
 * EditAlbumModal Component
 *
 * Modal dialog for editing an existing `Gallery` album without scrollbars.
 */
export default function EditAlbumModal({
  isOpen,
  album,
  onClose,
  onSave,
}: EditAlbumModalProps) {
  if (!isOpen || !album) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-album-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h3
            id="edit-album-modal-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100"
          >
            Edit Album
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit album modal"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <EditAlbumFormInner
          key={album.id}
          album={album}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
