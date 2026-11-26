"use client";

import React, { useEffect } from "react";
import type { DeleteConfirmModalProps } from "./types";

/**
 * DeleteConfirmModal Component
 *
 * Reusable confirmation dialog shown before deleting a research domain record
 * or a configured schema field. Supports Escape key and backdrop dismissal.
 */
export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  description = "This action cannot be undone.",
  isLoading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  // Allow closing the confirmation dialog with the Escape key when not deleting
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={() => {
        if (!isLoading) onCancel();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200/70 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/50 text-base font-bold">
            !
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="delete-confirm-title"
              className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
            >
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                &quot;{itemName}&quot;
              </span>
              ? {description}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
