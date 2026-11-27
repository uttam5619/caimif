"use client";

import React, { useState } from "react";
import { createToolCategory } from "@/lib/api/tool.api";
import type { AddToolCategoryFormProps, ToolCategoryRecord } from "./types";

/**
 * AddToolCategoryForm Component
 *
 * Collects attributes synchronized with `ToolType` in `prisma/models/tool.prisma`:
 * - name (required unique String)
 */
export default function AddToolCategoryForm({
  onSubmitCategory,
  onSuccess,
}: AddToolCategoryFormProps = {}) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg("Please enter a tool category name.");
      return;
    }

    const payload = { name: cleanName };

    setIsLoading(true);
    try {
      const created: ToolCategoryRecord = onSubmitCategory
        ? await onSubmitCategory(payload)
        : await createToolCategory(payload);

      setName("");
      setSuccessMsg(`Tool category "${created.name}" created successfully.`);

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create tool category.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Add Tool Category
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Create a category synced with the ToolType model to classify software frameworks, platforms, and instruments.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        <div>
          <label htmlFor="tool-category-name" className={labelClass}>
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="tool-category-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Deep Learning Frameworks"
            className={inputClass}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Creating Category..." : "Add Tool Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
