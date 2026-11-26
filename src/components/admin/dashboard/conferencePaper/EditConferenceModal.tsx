"use client";

import React, { useState } from "react";
import type {
  ConferencePaper,
  EditConferenceModalProps,
  UpdateConferencePaperPayload,
} from "./types";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

interface EditConferenceFormInnerProps {
  conference: ConferencePaper;
  onClose: () => void;
  onSave: (
    conferenceId: string,
    payload: UpdateConferencePaperPayload
  ) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={conference.id}` so state resets cleanly
 * whenever a different Conference Paper record is opened for editing.
 */
function EditConferenceFormInner({
  conference,
  onClose,
  onSave,
}: EditConferenceFormInnerProps) {
  const [year, setYear] = useState(String(conference.year));
  const [domain, setDomain] = useState(conference.domain);
  const [title, setTitle] = useState(conference.title);
  const [authorFromCaimif, setAuthorFromCaimif] = useState(
    conference.authorFromCaimif
  );
  const [otherAuthors, setOtherAuthors] = useState(conference.otherAuthors ?? "");
  const [conferenceName, setConferenceName] = useState(conference.conferenceName);
  const [publisher, setPublisher] = useState(conference.publisher ?? "");
  const [indexing, setIndexing] = useState(conference.indexing ?? "");
  const [quartile, setQuartile] = useState(conference.quartile ?? "");
  const [weblink, setWeblink] = useState(conference.weblink ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    let parsedYear: number | undefined;
    if (year.trim()) {
      const numYear = Number(year.trim());
      if (
        !Number.isInteger(numYear) ||
        numYear < MIN_YEAR ||
        numYear > MAX_YEAR
      ) {
        setErrorMsg(
          `Please enter a valid publication year between ${MIN_YEAR} and ${MAX_YEAR}.`
        );
        return;
      }
      parsedYear = numYear;
    }

    const cleanDomain = domain.trim();
    const cleanTitle = title.trim();
    const cleanAuthorFromCaimif = authorFromCaimif.trim();
    const cleanConferenceName = conferenceName.trim();

    const cleanWeblink = weblink.trim();
    if (cleanWeblink) {
      try {
        const parsedUrl = new URL(cleanWeblink);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          throw new Error("Unsupported protocol");
        }
      } catch {
        setErrorMsg("Web link must be a valid http(s) URL.");
        return;
      }
    }

    const payload: UpdateConferencePaperPayload = {
      ...(parsedYear !== undefined ? { year: parsedYear } : {}),
      ...(cleanDomain ? { domain: cleanDomain } : {}),
      ...(cleanTitle ? { title: cleanTitle } : {}),
      ...(cleanAuthorFromCaimif
        ? { authorFromCaimif: cleanAuthorFromCaimif }
        : {}),
      otherAuthors: otherAuthors.trim() || null,
      ...(cleanConferenceName ? { conferenceName: cleanConferenceName } : {}),
      publisher: publisher.trim() || null,
      indexing: indexing.trim() || null,
      quartile: quartile.trim() || null,
      weblink: cleanWeblink || null,
    };

    setIsSaving(true);
    try {
      await onSave(conference.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update conference paper.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <>
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="edit-conference-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Conference Paper
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update details for {conference.id}.
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

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-conf-year" className={labelClass}>
              Year
            </label>
            <input
              id="edit-conf-year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-conf-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="edit-conf-domain"
              type="text"
              maxLength={191}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-conf-title" className={labelClass}>
            Title
          </label>
          <input
            id="edit-conf-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-conf-caimif" className={labelClass}>
              Author From CAIMIF
            </label>
            <textarea
              id="edit-conf-caimif"
              rows={2}
              value={authorFromCaimif}
              onChange={(e) => setAuthorFromCaimif(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="edit-conf-other" className={labelClass}>
              Other Authors
            </label>
            <textarea
              id="edit-conf-other"
              rows={2}
              value={otherAuthors}
              onChange={(e) => setOtherAuthors(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-conf-name" className={labelClass}>
              Conference Name
            </label>
            <input
              id="edit-conf-name"
              type="text"
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-conf-publisher" className={labelClass}>
              Publisher
            </label>
            <input
              id="edit-conf-publisher"
              type="text"
              maxLength={191}
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="edit-conf-indexing" className={labelClass}>
              Indexing
            </label>
            <input
              id="edit-conf-indexing"
              type="text"
              maxLength={191}
              value={indexing}
              onChange={(e) => setIndexing(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-conf-quartile" className={labelClass}>
              Quartile
            </label>
            <input
              id="edit-conf-quartile"
              type="text"
              maxLength={50}
              value={quartile}
              onChange={(e) => setQuartile(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-conf-weblink" className={labelClass}>
              Web Link
            </label>
            <input
              id="edit-conf-weblink"
              type="url"
              value={weblink}
              onChange={(e) => setWeblink(e.target.value)}
              className={inputClass}
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
 * EditConferenceModal Component
 *
 * Modal dialog for editing an existing Conference Paper record.
 */
export default function EditConferenceModal({
  isOpen,
  conference,
  onClose,
  onSave,
}: EditConferenceModalProps) {
  if (!isOpen || !conference) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-conference-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditConferenceFormInner
          key={conference.id}
          conference={conference}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
