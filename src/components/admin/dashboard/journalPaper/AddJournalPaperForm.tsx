"use client";

import React, { useState } from "react";
import { createJournal } from "@/lib/api/journal.api";
import type {
  AddJournalPaperFormProps,
  CreateJournalPaperPayload,
} from "./types";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/**
 * AddJournalPaperForm Component
 *
 * Collects exclusively the attributes defined on `Journal` in `prisma/models/journal.prisma`:
 * - year (required Int)
 * - domain (required String)
 * - title (required String)
 * - authorFromCaimif (required String)
 * - otherAuthors (optional String?)
 * - journalName (required String)
 * - publisher (optional String?)
 * - indexing (optional String?)
 * - quartile (optional String?)
 * - weblink (optional String? http/https URL)
 *
 * `id`, `createdAt`, and `updatedAt` are auto-generated on the backend.
 */
export default function AddJournalPaperForm({
  onSubmitPaper,
  onSuccess,
}: AddJournalPaperFormProps = {}) {
  const [year, setYear] = useState("");
  const [domain, setDomain] = useState("");
  const [title, setTitle] = useState("");
  const [authorFromCaimif, setAuthorFromCaimif] = useState("");
  const [otherAuthors, setOtherAuthors] = useState("");
  const [journalName, setJournalName] = useState("");
  const [publisher, setPublisher] = useState("");
  const [indexing, setIndexing] = useState("");
  const [quartile, setQuartile] = useState("");
  const [weblink, setWeblink] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetForm = () => {
    setYear("");
    setDomain("");
    setTitle("");
    setAuthorFromCaimif("");
    setOtherAuthors("");
    setJournalName("");
    setPublisher("");
    setIndexing("");
    setQuartile("");
    setWeblink("");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const parsedYear = Number(year.trim());
    if (
      !year.trim() ||
      !Number.isInteger(parsedYear) ||
      parsedYear < MIN_YEAR ||
      parsedYear > MAX_YEAR
    ) {
      setErrorMsg(`Please enter a valid publication year between ${MIN_YEAR} and ${MAX_YEAR}.`);
      return;
    }

    const cleanDomain = domain.trim();
    const cleanTitle = title.trim();
    const cleanAuthorFromCaimif = authorFromCaimif.trim();
    const cleanJournalName = journalName.trim();

    if (!cleanDomain) {
      setErrorMsg("Please enter the research domain.");
      return;
    }
    if (!cleanTitle) {
      setErrorMsg("Please enter the paper title.");
      return;
    }
    if (!cleanAuthorFromCaimif) {
      setErrorMsg("Please enter the CAIMIF author(s).");
      return;
    }
    if (!cleanJournalName) {
      setErrorMsg("Please enter the journal name.");
      return;
    }

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

    // Build payload strictly matching `prisma/models/journal.prisma` (no id or extra fields)
    const payload: CreateJournalPaperPayload = {
      year: parsedYear,
      domain: cleanDomain,
      title: cleanTitle,
      authorFromCaimif: cleanAuthorFromCaimif,
      otherAuthors: otherAuthors.trim() || null,
      journalName: cleanJournalName,
      publisher: publisher.trim() || null,
      indexing: indexing.trim() || null,
      quartile: quartile.trim() || null,
      weblink: cleanWeblink || null,
    };

    setIsLoading(true);
    try {
      const created = onSubmitPaper
        ? await onSubmitPaper(payload)
        : await createJournal(payload);

      resetForm();
      setSuccessMsg("Journal paper added successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add journal paper.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Add Journal Paper
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Register a new peer-reviewed journal publication record.
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
        {/* Year & Domain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="journal-year" className={labelClass}>
              Year 
            </label>
            <input
              id="journal-year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="journal-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="journal-domain"
              type="text"
              maxLength={191}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Paper Title */}
        <div>
          <label htmlFor="journal-title" className={labelClass}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="journal-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Authors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="journal-caimif-authors" className={labelClass}>
              Author From CAIMIF
            </label>
            <textarea
              id="journal-caimif-authors"
              rows={2}
              value={authorFromCaimif}
              onChange={(e) => setAuthorFromCaimif(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="journal-other-authors" className={labelClass}>
              Other Authors
            </label>
            <textarea
              id="journal-other-authors"
              rows={2}
              value={otherAuthors}
              onChange={(e) => setOtherAuthors(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Journal Name & Publisher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="journal-name" className={labelClass}>
              Journal Name <span className="text-red-500">*</span>
            </label>
            <input
              id="journal-name"
              type="text"
              required
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="journal-publisher" className={labelClass}>
              Publisher
            </label>
            <input
              id="journal-publisher"
              type="text"
              maxLength={191}
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Indexing, Quartile & Weblink */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="journal-indexing" className={labelClass}>
              Indexing
            </label>
            <input
              id="journal-indexing"
              type="text"
              maxLength={191}
              value={indexing}
              onChange={(e) => setIndexing(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="journal-quartile" className={labelClass}>
              Quartile
            </label>
            <input
              id="journal-quartile"
              type="text"
              maxLength={50}
              value={quartile}
              onChange={(e) => setQuartile(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="journal-weblink" className={labelClass}>
              Web Link
            </label>
            <input
              id="journal-weblink"
              type="url"
              value={weblink}
              onChange={(e) => setWeblink(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-xl bg-[#172554] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Add Paper"}
          </button>
        </div>
      </form>
    </div>
  );
}
