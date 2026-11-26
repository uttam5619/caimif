"use client";

import React, { useEffect, useRef, useState } from "react";
import type { EditEventModalProps, EventRecord } from "./types";

/**
 * Formats an ISO timestamp string into local `YYYY-MM-DDTHH:mm` for `<input type="datetime-local" />`.
 */
function toDateTimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (val: number) => String(val).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface EditEventFormInnerProps {
  event: EventRecord;
  onClose: () => void;
  onSave: (eventId: number, payload: FormData) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={event.id}` so state resets cleanly
 * whenever a different Event record is opened for editing.
 */
function EditEventFormInner({
  event,
  onClose,
  onSave,
}: EditEventFormInnerProps) {
  const [title, setTitle] = useState(event.title);
  const [shortDescription, setShortDescription] = useState(
    event.shortDescription ?? ""
  );
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(() =>
    toDateTimeLocalValue(event.startDate)
  );
  const [endDate, setEndDate] = useState(() =>
    toDateTimeLocalValue(event.endDate)
  );
  const [location, setLocation] = useState(event.location ?? "");
  const [venue, setVenue] = useState(event.venue ?? "");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(
    event.isRegistrationOpen
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
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

    if (file) {
      setRemoveImage(false);
    }

    if (file && file.type.startsWith("image/")) {
      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    }

    setSelectedFile(file);
  };

  const handleClearImage = () => {
    revokePreview();
    setSelectedFile(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    const parsedStart = startDate ? new Date(startDate) : null;
    const parsedEnd = endDate ? new Date(endDate) : null;
    if (parsedStart && Number.isNaN(parsedStart.getTime())) {
      setErrorMsg("Start date must be a valid date.");
      return;
    }
    if (parsedEnd && Number.isNaN(parsedEnd.getTime())) {
      setErrorMsg("End date must be a valid date.");
      return;
    }
    const effectiveStart = parsedStart ?? new Date(event.startDate);
    const effectiveEnd = parsedEnd ?? new Date(event.endDate);
    if (effectiveEnd.getTime() < effectiveStart.getTime()) {
      setErrorMsg("End date must be on or after the start date.");
      return;
    }

    const payload = new FormData();
    if (cleanTitle) {
      payload.append("title", cleanTitle);
    }
    payload.append("shortDescription", shortDescription.trim());
    if (cleanDescription) {
      payload.append("description", cleanDescription);
    }
    if (parsedStart) {
      payload.append("startDate", parsedStart.toISOString());
    }
    if (parsedEnd) {
      payload.append("endDate", parsedEnd.toISOString());
    }
    payload.append("location", location.trim());
    payload.append("venue", venue.trim());
    payload.append("isRegistrationOpen", String(isRegistrationOpen));
    if (removeImage) {
      payload.append("removeImage", "true");
    }
    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    setIsSaving(true);
    try {
      await onSave(event.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update event.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1";

  const activePreview =
    previewUrl ?? (removeImage ? undefined : event.imageUrl);

  return (
    <>
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="edit-event-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Event
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update details for Event #{event.id}.
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
            <label htmlFor="edit-event-name" className={labelClass}>
              Title
            </label>
            <input
              id="edit-event-name"
              type="text"
              maxLength={191}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-event-short-desc" className={labelClass}>
              Short Description
            </label>
            <input
              id="edit-event-short-desc"
              type="text"
              maxLength={191}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-event-desc" className={labelClass}>
            Description
          </label>
          <textarea
            id="edit-event-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-event-start" className={labelClass}>
              Start Date
            </label>
            <input
              id="edit-event-start"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-event-end" className={labelClass}>
              End Date
            </label>
            <input
              id="edit-event-end"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-event-location" className={labelClass}>
              Location
            </label>
            <input
              id="edit-event-location"
              type="text"
              maxLength={191}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-event-venue" className={labelClass}>
              Venue
            </label>
            <input
              id="edit-event-venue"
              type="text"
              maxLength={191}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-event-image" className={labelClass}>
            Image
          </label>
          {selectedFile || activePreview ? (
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2.5 dark:border-zinc-700 dark:bg-zinc-800/60">
              {activePreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activePreview}
                  alt="Event cover preview"
                  className="h-12 w-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200/70 text-sm dark:bg-zinc-700">
                  🖼️
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-100 truncate block">
                  {selectedFile ? selectedFile.name : "Current cover image"}
                </span>
                <label
                  htmlFor="edit-event-image"
                  className="text-[11px] font-semibold text-[#172554] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Replace image
                </label>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
              <input
                id="edit-event-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <label
              htmlFor="edit-event-image"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-3 py-3 text-xs font-medium text-zinc-600 cursor-pointer hover:border-[#172554] dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300"
            >
              <span>Upload Image</span>
              <input
                id="edit-event-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/40">
          <span
            id="edit-event-registration-open-label"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Is Registration Open
          </span>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
              {isRegistrationOpen ? "Open" : "Closed"}
            </span>
            <button
              id="edit-event-registration-open"
              type="button"
              role="switch"
              aria-checked={isRegistrationOpen}
              aria-labelledby="edit-event-registration-open-label"
              onClick={() => setIsRegistrationOpen((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] cursor-pointer ${
                isRegistrationOpen
                  ? "bg-[#172554] dark:bg-blue-500"
                  : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  isRegistrationOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
 * EditEventModal Component
 *
 * Modal dialog for editing an existing Event record.
 */
export default function EditEventModal({
  isOpen,
  event,
  onClose,
  onSave,
}: EditEventModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditEventFormInner
          key={event.id}
          event={event}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
