"use client";

import React, { useState } from "react";
import type {
  EditToolCategoryModalProps,
  ToolCategoryRecord,
} from "./types";

interface EditToolCategoryFormInnerProps {
  category: ToolCategoryRecord;
  onClose: () => void;
  onSave: (
    categoryId: string,
    payload: { name?: string }
  ) => Promise<void> | void;
}

function EditToolCategoryFormInner({
  category,
  onClose,
  onSave,
}: EditToolCategoryFormInnerProps) {
  const [name, setName] = useState(category.name);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg("Tool category name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(category.id, { name: cleanName });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update tool category.";
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      <div>
        <label htmlFor="edit-tool-category-name" className={labelClass}>
          Category Name
        </label>
        <input
          id="edit-tool-category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#172554] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/**
 * EditToolCategoryModal Component
 *
 * Modal dialog for editing an existing `ToolType` category record.
 */
export default function EditToolCategoryModal({
  isOpen,
  category,
  onClose,
  onSave,
}: EditToolCategoryModalProps) {
  if (!isOpen || !category) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-tool-category-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h3
            id="edit-tool-category-modal-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100"
          >
            Edit Tool Category
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit tool category modal"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <EditToolCategoryFormInner
          key={category.id}
          category={category}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
