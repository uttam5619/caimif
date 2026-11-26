"use client";

import React from "react";
import type { StringListFieldProps } from "./types";

/**
 * Splits a raw draft string by commas or newlines and merges unique,
 * non-empty entries into an existing list while preserving original order.
 */
export function mergeListItems(existing: string[], rawDraft: string): string[] {
  const parts = rawDraft
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (parts.length === 0) return existing;

  const seen = new Set(existing.map((item) => item.toLowerCase()));
  const next = [...existing];

  for (const part of parts) {
    const key = part.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      next.push(part);
    }
  }

  return next;
}

/**
 * StringListField Component
 *
 * Self-contained multi-value tag input used for JSON string-array attributes
 * (`specializations` and `certifications`) on the `Team` model.
 * Supports Enter-key submission, comma-separated pasting, and chip removal.
 */
export default function StringListField({
  id,
  label,
  hint,
  items,
  draftValue,
  onDraftChange,
  onItemsChange,
}: StringListFieldProps) {
  const commitDraft = () => {
    const merged = mergeListItems(items, draftValue);
    if (merged.length !== items.length) {
      onItemsChange(merged);
    }
    onDraftChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    }
  };

  const handleRemoveItem = (targetIndex: number) => {
    onItemsChange(items.filter((_, index) => index !== targetIndex));
  };

  const inputClass =
    "flex-1 min-w-0 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          value={draftValue}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hint}
          className={inputClass}
        />
        <button
          type="button"
          onClick={commitDraft}
          disabled={!draftValue.trim()}
          className="shrink-0 rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200/80 bg-blue-50/70 px-2.5 py-1 text-xs font-medium text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-200"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                aria-label={`Remove ${item}`}
                className="text-[11px] font-bold opacity-60 hover:opacity-100 cursor-pointer leading-none"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
