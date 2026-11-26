"use client";

import React, { useState } from "react";
import { createBookChapter } from "@/lib/api/bookChapter.api";
import type {
  AddBookChapterFormProps,
  CreateBookChapterPayload,
} from "./types";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/**
 * AddBookChapterForm Component
 *
 * Collects attributes synchronized with `BookChapter` in `prisma/models/bookChapter.prisma`:
 * - year (optional Int?)
 * - domain (optional String?)
 * - chapterTitle (Chapter Title — required String)
 * - bookName (Book Name — required String)
 * - authorFromCaimif (optional String?)
 * - otherAuthors (optional String?)
 * - publisher (optional String?)
 * - indexing (optional String?)
 * - quartile (optional String?)
 * - weblink (optional String? http/https URL)
 *
 * `id`, `createdAt`, and `updatedAt` are auto-generated on the backend.
 * Renders all inputs without placeholders; only Chapter Title and Book Name are required.
 */
export default function AddBookChapterForm({
  onSubmitChapter,
  onSuccess,
}: AddBookChapterFormProps = {}) {
  const [year, setYear] = useState("");
  const [domain, setDomain] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [bookName, setBookName] = useState("");
  const [authorFromCaimif, setAuthorFromCaimif] = useState("");
  const [otherAuthors, setOtherAuthors] = useState("");
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
    setChapterTitle("");
    setBookName("");
    setAuthorFromCaimif("");
    setOtherAuthors("");
    setPublisher("");
    setIndexing("");
    setQuartile("");
    setWeblink("");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanChapterTitle = chapterTitle.trim();
    const cleanBookName = bookName.trim();

    if (!cleanChapterTitle) {
      setErrorMsg("Please enter the chapter title.");
      return;
    }
    if (!cleanBookName) {
      setErrorMsg("Please enter the book name.");
      return;
    }

    // Validate optional year only when provided
    const cleanYearStr = year.trim();
    let parsedYear: number | null = null;
    if (cleanYearStr) {
      const numYear = Number(cleanYearStr);
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

    // Validate optional URL only when provided
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

    // Build payload strictly matching `prisma/models/bookChapter.prisma`
    const payload: CreateBookChapterPayload = {
      year: parsedYear,
      domain: domain.trim() || null,
      chapterTitle: cleanChapterTitle,
      bookName: cleanBookName,
      authorFromCaimif: authorFromCaimif.trim() || null,
      otherAuthors: otherAuthors.trim() || null,
      publisher: publisher.trim() || null,
      indexing: indexing.trim() || null,
      quartile: quartile.trim() || null,
      weblink: cleanWeblink || null,
    };

    setIsLoading(true);
    try {
      const created = onSubmitChapter
        ? await onSubmitChapter(payload)
        : await createBookChapter(payload);

      resetForm();
      setSuccessMsg("Book chapter added successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add book chapter.";
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
          Add Book Chapter
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Register a new book chapter publication record. Only Chapter Title and Book Name are required.
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
            <label htmlFor="chapter-year" className={labelClass}>
              Year
            </label>
            <input
              id="chapter-year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="chapter-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="chapter-domain"
              type="text"
              maxLength={191}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Chapter Title & Book Name (Required) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="chapter-title" className={labelClass}>
              Chapter Title <span className="text-red-500">*</span>
            </label>
            <input
              id="chapter-title"
              type="text"
              required
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="chapter-book-name" className={labelClass}>
              Book Name <span className="text-red-500">*</span>
            </label>
            <input
              id="chapter-book-name"
              type="text"
              required
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Authors: Author from CAIMIF & Other Authors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="chapter-caimif-authors" className={labelClass}>
              Author from CAIMIF
            </label>
            <textarea
              id="chapter-caimif-authors"
              rows={2}
              value={authorFromCaimif}
              onChange={(e) => setAuthorFromCaimif(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="chapter-other-authors" className={labelClass}>
              Other Authors
            </label>
            <textarea
              id="chapter-other-authors"
              rows={2}
              value={otherAuthors}
              onChange={(e) => setOtherAuthors(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Publisher & Indexing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="chapter-publisher" className={labelClass}>
              Publisher
            </label>
            <input
              id="chapter-publisher"
              type="text"
              maxLength={191}
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="chapter-indexing" className={labelClass}>
              Indexing
            </label>
            <input
              id="chapter-indexing"
              type="text"
              maxLength={191}
              value={indexing}
              onChange={(e) => setIndexing(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Quartile & Web Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="chapter-quartile" className={labelClass}>
              Quartile
            </label>
            <input
              id="chapter-quartile"
              type="text"
              maxLength={50}
              value={quartile}
              onChange={(e) => setQuartile(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="chapter-weblink" className={labelClass}>
              Web Link
            </label>
            <input
              id="chapter-weblink"
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
            {isLoading ? "Submitting..." : "Add Book Chapter"}
          </button>
        </div>
      </form>
    </div>
  );
}
