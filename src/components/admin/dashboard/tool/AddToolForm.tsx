"use client";

import React, { useEffect, useRef, useState } from "react";
import { createTool } from "@/lib/api/tool.api";
import type { AddToolFormProps, ToolRecord } from "./types";

/**
 * AddToolForm Component
 *
 * Collects attributes synchronized with `Tool` in `prisma/models/tool.prisma`:
 * - image (required image file persisted as `image_key` via S3)
 * - title (required String)
 * - version (required String)
 * - description (required String @db.Text)
 * - category / toolTypeId (required relation referencing `ToolType.id`)
 */
export default function AddToolForm({
  categories,
  onSubmitTool,
  onSuccess,
  onRequestAddCategory,
}: AddToolFormProps) {
  const [toolTypeId, setToolTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    revokePreview();

    if (file && file.type.startsWith("image/")) {
      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    }

    setImageFile(file);
  };

  const handleRemoveFile = () => {
    revokePreview();
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const selectedCategoryId = toolTypeId || categories[0]?.id || "";
    const cleanTitle = title.trim();
    const cleanVersion = version.trim();
    const cleanDescription = description.trim();

    if (!selectedCategoryId) {
      setErrorMsg("Please create and select a tool category first.");
      return;
    }
    if (!imageFile) {
      setErrorMsg("Please select an image for the tool.");
      return;
    }
    if (!cleanTitle) {
      setErrorMsg("Please enter the tool title.");
      return;
    }
    if (!cleanVersion) {
      setErrorMsg("Please enter the tool version.");
      return;
    }
    if (!cleanDescription) {
      setErrorMsg("Please enter a description for the tool.");
      return;
    }

    const payload = new FormData();
    payload.append("toolTypeId", selectedCategoryId);
    payload.append("image", imageFile);
    payload.append("title", cleanTitle);
    payload.append("version", cleanVersion);
    payload.append("description", cleanDescription);

    setIsLoading(true);
    try {
      const created: ToolRecord = onSubmitTool
        ? await onSubmitTool(payload)
        : await createTool(payload);

      setTitle("");
      setVersion("");
      setDescription("");
      handleRemoveFile();
      setSuccessMsg(`Tool "${created.title}" added successfully.`);

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create tool.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveCategoryId = toolTypeId || categories[0]?.id || "";

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Add Tool
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Register a software tool, platform, or framework synced with the Tool model.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/40 space-y-3">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            No tool categories exist yet. Create a tool category before adding tools.
          </p>
          {onRequestAddCategory && (
            <button
              type="button"
              onClick={onRequestAddCategory}
              className="rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a] transition-colors cursor-pointer"
            >
              Go to Add Tool Category
            </button>
          )}
        </div>
      ) : (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tool-title" className={labelClass}>
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="tool-title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. PyTorch"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="tool-version" className={labelClass}>
                Version <span className="text-rose-500">*</span>
              </label>
              <input
                id="tool-version"
                name="version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v2.5.1"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tool-category" className={labelClass}>
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="tool-category"
                name="toolTypeId"
                value={effectiveCategoryId}
                onChange={(e) => setToolTypeId(e.target.value)}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tool-image" className={labelClass}>
                Image <span className="text-rose-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                id="tool-image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#172554] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1e3a8a] dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="flex items-center gap-3 pt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected tool preview"
                className="h-24 w-32 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          <div>
            <label htmlFor="tool-description" className={labelClass}>
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="tool-description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe capabilities, use cases, and cluster usage..."
              className={textareaClass}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Adding Tool..." : "Add Tool"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
