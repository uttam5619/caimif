"use client";

import React, { useEffect } from "react";
import { resolveSafeWeblink } from "./researchOutputUtils";
import type { RecordDetailModalProps } from "./types";

/**
 * RecordDetailModal Component
 *
 * Shared single-column modal used across Research Domain cards and
 * Research Outputs table rows. Renders all provided attributes cleanly
 * without an internal scrollbar over a blurred neutral backdrop, returning
 * users to their exact scroll position when closed.
 */
export default function RecordDetailModal({
  isOpen,
  badgeLabel,
  title,
  fields,
  onClose,
}: RecordDetailModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Lock background scroll while keeping exact page offset intact.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-detail-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/55 p-4 backdrop-blur-md"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative my-auto w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Neutral Modal Header with Cross Button */}
        <div className="flex items-start justify-between gap-4 rounded-t-2xl border-b border-zinc-200 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <div>
            <span className="inline-block rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {badgeLabel}
            </span>
            <h3
              id="research-detail-modal-title"
              className="mt-1.5 text-base sm:text-lg font-bold leading-snug text-zinc-900 dark:text-zinc-100"
            >
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details modal"
            className="shrink-0 rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Single-Column Full Attribute List */}
        <div className="px-6 py-3">
          <dl className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800">
            {fields.map((field) => {
              if (field.isWeblink) {
                const href = resolveSafeWeblink(field.value);
                return (
                  <div
                    key={field.key}
                    className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5"
                  >
                    <dt className="sm:w-52 shrink-0 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:pt-0.5">
                      {field.label}
                    </dt>
                    <dd className="text-sm font-medium">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-900 underline underline-offset-4 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                        >
                          Link
                          <span aria-hidden="true">&rarr;</span>
                        </a>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">
                          —
                        </span>
                      )}
                    </dd>
                  </div>
                );
              }

              const formattedValue =
                field.value !== null &&
                field.value !== undefined &&
                String(field.value).trim() !== ""
                  ? String(field.value).trim()
                  : "—";

              return (
                <div
                  key={field.key}
                  className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5"
                >
                  <dt className="sm:w-52 shrink-0 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:pt-0.5">
                    {field.label}
                  </dt>
                  <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words leading-snug">
                    {formattedValue}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}
