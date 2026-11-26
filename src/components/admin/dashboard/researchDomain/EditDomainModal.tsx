"use client";

import React, { useEffect, useRef, useState } from "react";
import { INITIAL_DOMAIN_FIELDS } from "./researchDomainFields.data";
import type {
  DomainFieldDefinition,
  EditDomainModalProps,
  ResearchDomain,
} from "./types";

interface EditDomainFormInnerProps {
  domain: ResearchDomain;
  fields: DomainFieldDefinition[];
  onClose: () => void;
  onSave: (domainId: string, payload: FormData) => Promise<void> | void;
}

/**
 * Builds the initial scalar values dictionary from core domain columns
 * and dynamic `customFields` stored on the record.
 */
function buildInitialValues(
  domain: ResearchDomain,
  fields: DomainFieldDefinition[]
): Record<string, string> {
  const initial: Record<string, string> = {};

  for (const field of fields) {
    if (field.type === "file") continue;
    if (field.name === "title") {
      initial[field.name] = domain.title;
    } else if (field.name === "shortDescription") {
      initial[field.name] = domain.shortDescription;
    } else if (field.name === "description") {
      initial[field.name] = domain.description;
    } else {
      const customVal = domain.customFields?.[field.name];
      initial[field.name] = customVal !== undefined ? String(customVal) : "";
    }
  }

  return initial;
}

/**
 * Inner form component initialized via React `key={domain.id}`.
 * Supports editing core columns, replacing/removing the cover image,
 * and updating dynamic custom fields configured by SecurityAdmin.
 */
function EditDomainFormInner({
  domain,
  fields,
  onClose,
  onSave,
}: EditDomainFormInnerProps) {
  const [textValues, setTextValues] = useState<Record<string, string>>(() =>
    buildInitialValues(domain, fields)
  );
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [removeImage, setRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const previewUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const urlsMap = previewUrlsRef.current;
    return () => {
      Object.values(urlsMap).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const revokePreviewUrl = (fieldName: string) => {
    const existing = previewUrlsRef.current[fieldName];
    if (existing) {
      URL.revokeObjectURL(existing);
      delete previewUrlsRef.current[fieldName];
    }
  };

  const handleFileChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    revokePreviewUrl(fieldName);

    if (fieldName === "image" && file) {
      setRemoveImage(false);
    }

    if (file && file.type.startsWith("image/")) {
      const nextUrl = URL.createObjectURL(file);
      previewUrlsRef.current[fieldName] = nextUrl;
      setPreviewUrls((prev) => ({ ...prev, [fieldName]: nextUrl }));
    } else {
      setPreviewUrls((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }

    setSelectedFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleClearImage = (fieldName: string) => {
    revokePreviewUrl(fieldName);
    setPreviewUrls((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setSelectedFiles((prev) => ({ ...prev, [fieldName]: null }));
    if (fieldName === "image") {
      setRemoveImage(true);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = new FormData();
    if (removeImage) {
      payload.append("removeImage", "true");
    }

    for (const field of fields) {
      if (field.type === "file") {
        const file = selectedFiles[field.name];
        if (file) {
          payload.append(field.name, file);
        }
      } else {
        const trimmed = (textValues[field.name] ?? "").trim();
        // Preserve existing value if a field flagged as required in schema is left blank during edit
        const fallbackValue =
          !trimmed && field.required
            ? field.name === "title"
              ? domain.title
              : field.name === "shortDescription"
              ? domain.shortDescription
              : field.name === "description"
              ? domain.description
              : domain.customFields?.[field.name] !== undefined
              ? String(domain.customFields[field.name])
              : ""
            : trimmed;
        payload.append(field.name, fallbackValue);
      }
    }

    setIsSaving(true);
    try {
      await onSave(domain.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update research domain.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  return (
    <>
      {/* Modal Header */}
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="edit-domain-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Research Domain
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update institutional details for {domain.id}.
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

      {/* Error Banner */}
      {errorMsg && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50/80 p-2.5 text-xs font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      {/* Dynamic Edit Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
        {fields.map((field) => {
          const inputId = `edit-domain-${field.id}`;

          if (field.type === "textarea") {
            return (
              <div key={field.id}>
                <label
                  htmlFor={inputId}
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  {field.label}
                </label>
                <textarea
                  id={inputId}
                  rows={3}
                  placeholder={field.placeholder || field.label}
                  value={textValues[field.name] ?? ""}
                  onChange={(e) =>
                    setTextValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  className={`${inputClass} resize-none`}
                />
              </div>
            );
          }

          if (field.type === "file") {
            const selectedFile = selectedFiles[field.name] ?? null;
            const existingUrl =
              field.name === "image"
                ? removeImage
                  ? undefined
                  : domain.imageUrl
                : typeof domain.customFields?.[field.name] === "string"
                ? String(domain.customFields[field.name])
                : undefined;
            const activePreview = previewUrls[field.name] ?? existingUrl;

            return (
              <div key={field.id}>
                <label
                  htmlFor={inputId}
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  {field.label}
                </label>

                {selectedFile || activePreview ? (
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2.5 dark:border-zinc-700 dark:bg-zinc-800/60">
                    {activePreview ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={activePreview}
                        alt={`${field.label} preview`}
                        className="h-12 w-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200/70 text-sm dark:bg-zinc-700">
                        📄
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-100 truncate block">
                        {selectedFile ? selectedFile.name : "Current cover asset"}
                      </span>
                      <label
                        htmlFor={inputId}
                        className="text-[11px] font-semibold text-[#172554] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Replace file
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClearImage(field.name)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 cursor-pointer"
                    >
                      Remove
                    </button>
                    <input
                      id={inputId}
                      type="file"
                      accept={field.name === "image" ? "image/*" : undefined}
                      onChange={(e) => handleFileChange(field.name, e)}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <label
                    htmlFor={inputId}
                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-3 py-3 text-xs font-medium text-zinc-600 cursor-pointer hover:border-[#172554] dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300"
                  >
                    <span>Upload {field.label}</span>
                    <input
                      id={inputId}
                      type="file"
                      accept={field.name === "image" ? "image/*" : undefined}
                      onChange={(e) => handleFileChange(field.name, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            );
          }

          const htmlInputType =
            field.type === "number" ||
            field.type === "url" ||
            field.type === "date" ||
            field.type === "email"
              ? field.type
              : "text";

          return (
            <div key={field.id}>
              <label
                htmlFor={inputId}
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
              >
                {field.label}
              </label>
              <input
                id={inputId}
                type={htmlInputType}
                placeholder={field.placeholder || field.label}
                value={textValues[field.name] ?? ""}
                onChange={(e) =>
                  setTextValues((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          );
        })}

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
 * EditDomainModal Component
 *
 * Dedicated modal dialog for editing an existing research domain,
 * dynamically adapting to schema fields managed by SecurityAdmin.
 */
export default function EditDomainModal({
  isOpen,
  domain,
  fields = INITIAL_DOMAIN_FIELDS,
  onClose,
  onSave,
}: EditDomainModalProps) {
  if (!isOpen || !domain) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-domain-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditDomainFormInner
          key={domain.id}
          domain={domain}
          fields={fields}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
