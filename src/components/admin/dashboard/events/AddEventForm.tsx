"use client";

import React, { useEffect, useRef, useState } from "react";
import { createEvent } from "@/lib/api/event.api";
import type { AddEventFormProps, EventRecord } from "./types";


/**
 * AddEventForm Component
 *
 * Collects attributes synchronized with `Event` in `prisma/models/events.prisma`:
 * - title (required String)
 * - shortDescription (optional String?)
 * - description (required String @db.Text)
 * - image (optional S3 cover image File)
 * - startDate (required DateTime)
 * - endDate (required DateTime, >= startDate)
 * - location (optional String?)
 * - venue (optional String?)
 * - isRegistrationOpen (Boolean, default true, rendered as a toggle switch)
 *
 * `id`, `createdAt`, and `updatedAt` are auto-generated on the backend.
 */


export default function AddEventForm({
  onSubmitEvent,
  onSuccess,
}: AddEventFormProps = {}) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

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
  };

  const resetForm = () => {
    setTitle("");
    setShortDescription("");
    setDescription("");
    handleRemoveFile();
    setStartDate("");
    setEndDate("");
    setLocation("");
    setVenue("");
    setIsRegistrationOpen(true);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setErrorMsg("Please enter the event title.");
      return;
    }
    if (!cleanDescription) {
      setErrorMsg("Please enter the event description.");
      return;
    }
    if (!startDate) {
      setErrorMsg("Please select the start date.");
      return;
    }
    if (!endDate) {
      setErrorMsg("Please select the end date.");
      return;
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    if (Number.isNaN(parsedStart.getTime())) {
      setErrorMsg("Start date must be a valid date/time.");
      return;
    }
    if (Number.isNaN(parsedEnd.getTime())) {
      setErrorMsg("End date must be a valid date/time.");
      return;
    }
    if (parsedEnd.getTime() < parsedStart.getTime()) {
      setErrorMsg("End date must be on or after the start date.");
      return;
    }

    const payload = new FormData();
    payload.append("title", cleanTitle);
    if (shortDescription.trim()) {
      payload.append("shortDescription", shortDescription.trim());
    }
    payload.append("description", cleanDescription);
    if (imageFile) {
      payload.append("image", imageFile);
    }
    payload.append("startDate", parsedStart.toISOString());
    payload.append("endDate", parsedEnd.toISOString());
    if (location.trim()) {
      payload.append("location", location.trim());
    }
    if (venue.trim()) {
      payload.append("venue", venue.trim());
    }
    payload.append("isRegistrationOpen", String(isRegistrationOpen));

    setIsLoading(true);
    try {
      const created: EventRecord = onSubmitEvent
        ? await onSubmitEvent(payload)
        : await createEvent(payload);

      resetForm();
      setSuccessMsg("Event added successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add event.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Add Events
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Register a new event, seminar, or conference hosted by CAIMIF.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Title & Short Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-title" className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="event-title"
              type="text"
              maxLength={191}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="event-short-description" className={labelClass}>
              Short Description
            </label>
            <input
              id="event-short-description"
              type="text"
              maxLength={191}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="event-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="event-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-start-date" className={labelClass}>
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="event-start-date"
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="event-end-date" className={labelClass}>
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="event-end-date"
              type="datetime-local"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Location & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-location" className={labelClass}>
              Location
            </label>
            <input
              id="event-location"
              type="text"
              maxLength={191}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="event-venue" className={labelClass}>
              Venue
            </label>
            <input
              id="event-venue"
              type="text"
              maxLength={191}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="event-image" className={labelClass}>
            Image
          </label>
          {imageFile ? (
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt="Event cover preview"
                  className="h-16 w-16 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-200/70 text-lg dark:bg-zinc-700">
                  🖼️
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate block">
                  {imageFile.name}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  {(imageFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              htmlFor="event-image"
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-6 cursor-pointer hover:border-[#172554] dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-blue-400 transition-colors"
            >
              <span className="text-2xl mb-1">🖼️</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Click to upload image
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                PNG, JPG, WebP, GIF supported (max 5 MB)
              </span>
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Is Registration Open Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div>
            <span
              id="event-registration-open-label"
              className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block"
            >
              Is Registration Open
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Controls whether participants can currently register for this event.
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
              {isRegistrationOpen ? "Open" : "Closed"}
            </span>
            <button
              id="event-registration-open"
              type="button"
              role="switch"
              aria-checked={isRegistrationOpen}
              aria-labelledby="event-registration-open-label"
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

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-xl bg-[#172554] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
