"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  EditFeaturedResearchModalProps,
  FeaturedResearchRecord,
} from "./types";

interface EditFeaturedResearchFormInnerProps {
  record: FeaturedResearchRecord;
  onClose: () => void;
  onSave: (recordId: string, payload: FormData) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={record.id}` so state resets cleanly
 * whenever a different FeaturedResearch record is opened for editing.
 */
function EditFeaturedResearchFormInner({
  record,
  onClose,
  onSave,
}: EditFeaturedResearchFormInnerProps) {
  const [title, setTitle] = useState(record.title);
  const [authorName, setAuthorName] = useState(record.authorName);
  const [description, setDescription] = useState(record.description);
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

    const cleanTitle = title.trim();
    const cleanAuthorName = authorName.trim();
    const cleanDescription = description.trim();

    const payload = new FormData();
    if (cleanTitle) {
      payload.append("title", cleanTitle);
    }
    if (cleanAuthorName) {
      payload.append("authorName", cleanAuthorName);
    }
    if (cleanDescription) {
      payload.append("description", cleanDescription);
    }
    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    // Preserve existing values if all editable fields were cleared without selecting an image
    if (
      !cleanTitle &&
      !cleanAuthorName &&
      !cleanDescription &&
      !selectedFile
    ) {
      payload.append("title", record.title);
    }

    setIsSaving(true);
    try {
      await onSave(record.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update featured research.";
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

  const activePreview = previewUrl ?? record.imageUrl;

  return (
    <>
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="edit-featured-research-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Featured Research
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update details for {record.title}.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Close dialog"
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer leading-none disabled:opacity-50"
        >
          ✕
        </button>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50/80 p-2.5 text-xs font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-featured-title" className={labelClass}>
              Title
            </label>
            <input
              id="edit-featured-title"
              type="text"
              maxLength={191}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-featured-author" className={labelClass}>
              Author Name
            </label>
            <input
              id="edit-featured-author"
              type="text"
              maxLength={191}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-featured-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="edit-featured-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textareaClass}
          />
        </div>

        <div>
          <label htmlFor="edit-featured-image" className={labelClass}>
            Featured Image
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2.5 dark:border-zinc-700 dark:bg-zinc-800/60">
            {activePreview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activePreview}
                alt="Featured research preview"
                className="h-12 w-16 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
              />
            ) : (
              <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-zinc-200/70 text-sm dark:bg-zinc-700">
                🖼️
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-100 truncate block">
                {selectedFile ? selectedFile.name : "Current featured image"}
              </span>
              <label
                htmlFor="edit-featured-image"
                className="text-[11px] font-semibold text-[#172554] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Replace image
              </label>
            </div>
            {selectedFile && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 cursor-pointer"
              >
                Revert
              </button>
            )}
            <input
              id="edit-featured-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1e3a8a] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}

/**
 * EditFeaturedResearchModal Component
 *
 * Modal dialog for editing an existing FeaturedResearch record without scrollbars
 * or mandatory field locks.
 */
export default function EditFeaturedResearchModal({
  isOpen,
  record,
  onClose,
  onSave,
}: EditFeaturedResearchModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-featured-research-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditFeaturedResearchFormInner
          key={record.id}
          record={record}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
