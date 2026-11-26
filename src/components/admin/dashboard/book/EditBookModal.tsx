"use client";

import React, { useState } from "react";
import type {
  BookRecord,
  EditBookModalProps,
  UpdateBookPayload,
} from "./types";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

interface EditBookFormInnerProps {
  book: BookRecord;
  onClose: () => void;
  onSave: (
    bookId: string,
    payload: UpdateBookPayload
  ) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={book.id}` so state resets cleanly
 * whenever a different Book record is opened for editing.
 */
function EditBookFormInner({
  book,
  onClose,
  onSave,
}: EditBookFormInnerProps) {
  const [year, setYear] = useState(book.year !== null ? String(book.year) : "");
  const [domain, setDomain] = useState(book.domain ?? "");
  const [title, setTitle] = useState(book.title);
  const [bookAuthor, setBookAuthor] = useState(book.bookAuthor);
  const [authorFromCaimif, setAuthorFromCaimif] = useState(
    book.authorFromCaimif ?? ""
  );
  const [otherAuthors, setOtherAuthors] = useState(book.otherAuthors ?? "");
  const [publisher, setPublisher] = useState(book.publisher ?? "");
  const [indexing, setIndexing] = useState(book.indexing ?? "");
  const [quartile, setQuartile] = useState(book.quartile ?? "");
  const [weblink, setWeblink] = useState(book.weblink ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanTitle = title.trim();
    const cleanBookAuthor = bookAuthor.trim();

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

    const payload: UpdateBookPayload = {
      year: parsedYear,
      domain: domain.trim() || null,
      ...(cleanTitle ? { title: cleanTitle } : {}),
      ...(cleanBookAuthor ? { bookAuthor: cleanBookAuthor } : {}),
      authorFromCaimif: authorFromCaimif.trim() || null,
      otherAuthors: otherAuthors.trim() || null,
      publisher: publisher.trim() || null,
      indexing: indexing.trim() || null,
      quartile: quartile.trim() || null,
      weblink: cleanWeblink || null,
    };

    setIsSaving(true);
    try {
      await onSave(book.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update book.";
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
            id="edit-book-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Book
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update details for {book.id}.
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
            <label htmlFor="edit-book-year" className={labelClass}>
              Year
            </label>
            <input
              id="edit-book-year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-book-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="edit-book-domain"
              type="text"
              maxLength={191}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-book-name" className={labelClass}>
              Book Title
            </label>
            <input
              id="edit-book-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-book-author" className={labelClass}>
              Book Author
            </label>
            <input
              id="edit-book-author"
              type="text"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-book-caimif" className={labelClass}>
              Author from CAIMIF
            </label>
            <textarea
              id="edit-book-caimif"
              rows={2}
              value={authorFromCaimif}
              onChange={(e) => setAuthorFromCaimif(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="edit-book-other" className={labelClass}>
              Other Authors
            </label>
            <textarea
              id="edit-book-other"
              rows={2}
              value={otherAuthors}
              onChange={(e) => setOtherAuthors(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-book-publisher" className={labelClass}>
              Publisher
            </label>
            <input
              id="edit-book-publisher"
              type="text"
              maxLength={191}
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-book-indexing" className={labelClass}>
              Indexing
            </label>
            <input
              id="edit-book-indexing"
              type="text"
              maxLength={191}
              value={indexing}
              onChange={(e) => setIndexing(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-book-quartile" className={labelClass}>
              Quartile
            </label>
            <input
              id="edit-book-quartile"
              type="text"
              maxLength={50}
              value={quartile}
              onChange={(e) => setQuartile(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-book-weblink" className={labelClass}>
              Web Link
            </label>
            <input
              id="edit-book-weblink"
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
 * EditBookModal Component
 *
 * Modal dialog for editing an existing Book record.
 */
export default function EditBookModal({
  isOpen,
  book,
  onClose,
  onSave,
}: EditBookModalProps) {
  if (!isOpen || !book) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-book-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditBookFormInner
          key={book.id}
          book={book}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
