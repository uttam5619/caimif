"use client";

import React, { useState } from "react";
import type {
  BookChapterRecord,
  EditBookChapterModalProps,
  UpdateBookChapterPayload,
} from "./types";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

interface EditBookChapterFormInnerProps {
  bookChapter: BookChapterRecord;
  onClose: () => void;
  onSave: (
    chapterId: string,
    payload: UpdateBookChapterPayload
  ) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={bookChapter.id}` so state resets cleanly
 * whenever a different Book Chapter record is opened for editing.
 */
function EditBookChapterFormInner({
  bookChapter,
  onClose,
  onSave,
}: EditBookChapterFormInnerProps) {
  const [year, setYear] = useState(
    bookChapter.year !== null ? String(bookChapter.year) : ""
  );
  const [domain, setDomain] = useState(bookChapter.domain ?? "");
  const [chapterTitle, setChapterTitle] = useState(bookChapter.chapterTitle);
  const [bookName, setBookName] = useState(bookChapter.bookName);
  const [authorFromCaimif, setAuthorFromCaimif] = useState(
    bookChapter.authorFromCaimif ?? ""
  );
  const [otherAuthors, setOtherAuthors] = useState(
    bookChapter.otherAuthors ?? ""
  );
  const [publisher, setPublisher] = useState(bookChapter.publisher ?? "");
  const [indexing, setIndexing] = useState(bookChapter.indexing ?? "");
  const [quartile, setQuartile] = useState(bookChapter.quartile ?? "");
  const [weblink, setWeblink] = useState(bookChapter.weblink ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanChapterTitle = chapterTitle.trim();
    const cleanBookName = bookName.trim();

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

    const payload: UpdateBookChapterPayload = {
      year: parsedYear,
      domain: domain.trim() || null,
      ...(cleanChapterTitle ? { chapterTitle: cleanChapterTitle } : {}),
      ...(cleanBookName ? { bookName: cleanBookName } : {}),
      authorFromCaimif: authorFromCaimif.trim() || null,
      otherAuthors: otherAuthors.trim() || null,
      publisher: publisher.trim() || null,
      indexing: indexing.trim() || null,
      quartile: quartile.trim() || null,
      weblink: cleanWeblink || null,
    };

    setIsSaving(true);
    try {
      await onSave(bookChapter.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update book chapter.";
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
            id="edit-book-chapter-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Book Chapter
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update details for {bookChapter.id}.
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
            <label htmlFor="edit-chapter-year" className={labelClass}>
              Year
            </label>
            <input
              id="edit-chapter-year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-chapter-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="edit-chapter-domain"
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
            <label htmlFor="edit-chapter-title" className={labelClass}>
              Chapter Title
            </label>
            <input
              id="edit-chapter-title"
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-chapter-book-name" className={labelClass}>
              Book Name
            </label>
            <input
              id="edit-chapter-book-name"
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-chapter-caimif" className={labelClass}>
              Author from CAIMIF
            </label>
            <textarea
              id="edit-chapter-caimif"
              rows={2}
              value={authorFromCaimif}
              onChange={(e) => setAuthorFromCaimif(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="edit-chapter-other" className={labelClass}>
              Other Authors
            </label>
            <textarea
              id="edit-chapter-other"
              rows={2}
              value={otherAuthors}
              onChange={(e) => setOtherAuthors(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-chapter-publisher" className={labelClass}>
              Publisher
            </label>
            <input
              id="edit-chapter-publisher"
              type="text"
              maxLength={191}
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-chapter-indexing" className={labelClass}>
              Indexing
            </label>
            <input
              id="edit-chapter-indexing"
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
            <label htmlFor="edit-chapter-quartile" className={labelClass}>
              Quartile
            </label>
            <input
              id="edit-chapter-quartile"
              type="text"
              maxLength={50}
              value={quartile}
              onChange={(e) => setQuartile(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-chapter-weblink" className={labelClass}>
              Web Link
            </label>
            <input
              id="edit-chapter-weblink"
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
 * EditBookChapterModal Component
 *
 * Modal dialog for editing an existing Book Chapter record.
 */
export default function EditBookChapterModal({
  isOpen,
  bookChapter,
  onClose,
  onSave,
}: EditBookChapterModalProps) {
  if (!isOpen || !bookChapter) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-book-chapter-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditBookChapterFormInner
          key={bookChapter.id}
          bookChapter={bookChapter}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
