"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  DomainFieldDefinition,
  RegisterNewDomainFormProps,
  ResearchDomain,
} from "./types";
import { INITIAL_DOMAIN_FIELDS } from "./researchDomainFields.data";

/**
 * RegisterNewDomainForm Component
 *
 * Dynamically renders form inputs from the configured `fields` schema,
 * validates required fields, manages object URL image previews safely,
 * and submits collected `FormData` to the parent handler (or configured endpoint).
 */
export default function RegisterNewDomainForm({
  fields = INITIAL_DOMAIN_FIELDS,
  onSubmitDomain,
  onSuccess,
}: RegisterNewDomainFormProps = {}) {
  const [formValues, setFormValues] = useState<Record<string, string | File | null>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const previewUrlsRef = useRef<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const endpoint = process.env.NEXT_PUBLIC_REGISTER_DOMAIN_ENDPOINT || "/api/research-domains";

  // Revoke any remaining object URLs when the form unmounts
  useEffect(() => {
    const urlsMap = previewUrlsRef.current;
    return () => {
      Object.values(urlsMap).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const revokePreviewUrl = (fieldName: string) => {
    const existingUrl = previewUrlsRef.current[fieldName];
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
      delete previewUrlsRef.current[fieldName];
    }
  };

  const handleTextChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    revokePreviewUrl(fieldName);

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

    setFormValues((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleRemoveFile = (fieldName: string) => {
    revokePreviewUrl(fieldName);
    setPreviewUrls((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setFormValues((prev) => ({ ...prev, [fieldName]: null }));
  };

  const clearAllPreviews = () => {
    Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = {};
    setPreviewUrls({});
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Block creation if any required field (including file uploads) is empty
    const missingRequiredFields = fields.filter((field) => {
      if (!field.required) return false;
      const value = formValues[field.name];
      if (field.type === "file") {
        return !(value instanceof File);
      }
      return typeof value !== "string" || !value.trim();
    });

    if (missingRequiredFields.length > 0) {
      const missingLabels = missingRequiredFields.map((f) => f.label).join(", ");
      setErrorMsg(
        missingRequiredFields.length === 1
          ? `Please fill in the required field: ${missingLabels}.`
          : `Please fill in the required fields: ${missingLabels}.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();
      for (const field of fields) {
        const value = formValues[field.name];
        if (value instanceof File) {
          payload.append(field.name, value);
        } else if (typeof value === "string" && value.trim()) {
          payload.append(field.name, value.trim());
        }
      }

      let createdDomain: ResearchDomain | undefined;

      if (onSubmitDomain) {
        createdDomain = await onSubmitDomain(payload);
      } else if (endpoint && endpoint !== "#") {
        const res = await fetch(endpoint, {
          method: "POST",
          body: payload,
        });

        const resData = await res.json().catch(() => ({}));
        if (!res.ok || !resData?.success) {
          throw new Error(
            resData?.error?.message ||
              resData?.message ||
              "Failed to register research domain."
          );
        }
        createdDomain = resData.data as ResearchDomain;
      }

      clearAllPreviews();
      setFormValues({});
      setSuccessMsg("Research domain registered successfully.");

      if (createdDomain && onSuccess) {
        onSuccess(createdDomain);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to register research domain.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  const renderFieldInput = (field: DomainFieldDefinition) => {
    const rawValue = formValues[field.name];
    const stringValue = typeof rawValue === "string" ? rawValue : "";
    const fileValue = rawValue instanceof File ? rawValue : null;
    const previewUrl = previewUrls[field.name];
    const inputId = `register-domain-${field.id}`;

    if (field.type === "textarea") {
      return (
        <textarea
          id={inputId}
          required={field.required}
          rows={4}
          placeholder={field.placeholder || field.label}
          value={stringValue}
          onChange={(e) => handleTextChange(field.name, e.target.value)}
          className={`${inputClass} resize-none`}
        />
      );
    }

    if (field.type === "file") {
      const isImageField = field.name.toLowerCase().includes("image");
      return fileValue ? (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
          {previewUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewUrl}
              alt={`${field.label} preview`}
              className="h-16 w-16 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-200/70 text-lg dark:bg-zinc-700">
              📄
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate block">
              {fileValue.name}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              {(fileValue.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleRemoveFile(field.name)}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-6 cursor-pointer hover:border-[#172554] dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-blue-400 transition-colors"
        >
          <span className="text-2xl mb-1">{isImageField ? "🖼️" : "📎"}</span>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {field.placeholder || `Click to upload ${field.label.toLowerCase()}`}
          </span>
          <span className="text-[10px] text-zinc-400 mt-0.5">
            {isImageField ? "PNG, JPG, WebP supported" : "Select a file to upload"}
          </span>
          <input
            id={inputId}
            type="file"
            accept={isImageField ? "image/*" : undefined}
            aria-required={field.required}
            onChange={(e) => handleFileChange(field.name, e)}
            className="hidden"
          />
        </label>
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
      <input
        id={inputId}
        type={htmlInputType}
        required={field.required}
        placeholder={field.placeholder || field.label}
        value={stringValue}
        onChange={(e) => handleTextChange(field.name, e.target.value)}
        className={inputClass}
      />
    );
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Register New Domain
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Fill in the configured research domain fields below.
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

      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          No domain fields configured. Add fields in &quot;Manage Research Domains&quot;.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <label
                htmlFor={`register-domain-${field.id}`}
                className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ))}

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-xl bg-[#172554] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
