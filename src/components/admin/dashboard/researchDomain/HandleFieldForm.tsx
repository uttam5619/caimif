"use client";

import React, { useState, useRef, useEffect } from "react";
import type {
  DomainFieldType,
  HandleFieldFormProps,
} from "./types";
import { FIELD_TYPE_OPTIONS } from "./researchDomainFields.data";

const CORE_REQUIRED_SYSTEM_FIELDS = new Set([
  "title",
  "shortDescription",
  "description",
]);

const IDENTIFIER_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

/**
 * HandleFieldForm Component
 *
 * One-column modal form component for creating and editing research domain fields.
 * Enforces system-field protection (`isSystem`) and duplicate `uniqueIdentifier` checks.
 */
export default function HandleFieldForm({
  fieldToEdit,
  existingIdentifiers = [],
  onCancel,
  onSubmit,
}: HandleFieldFormProps) {
  const isSystemField = Boolean(fieldToEdit?.isSystem);
  const isCoreRequiredField =
    isSystemField && Boolean(fieldToEdit && CORE_REQUIRED_SYSTEM_FIELDS.has(fieldToEdit.name));

  const [title, setTitle] = useState(fieldToEdit?.label ?? "");
  const [fieldIdentifier, setFieldIdentifier] = useState(fieldToEdit?.name ?? "");
  const [fieldType, setFieldType] = useState<DomainFieldType | "">(fieldToEdit?.type ?? "");
  const [placeHolder, setPlaceHolder] = useState(fieldToEdit?.placeholder ?? "");
  const [isRequired, setIsRequired] = useState<boolean | null>(
    fieldToEdit ? fieldToEdit.required : null
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key press
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleSelectType = (val: DomainFieldType) => {
    setFieldType(val);
    setIsDropdownOpen(false);
    setErrorMsg("");
  };

  const selectedOption = FIELD_TYPE_OPTIONS.find((opt) => opt.value === fieldType);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Auto-slugify fieldIdentifier when creating a new field
    if (!fieldToEdit) {
      const autoIdentifier = newTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, "");

      setFieldIdentifier(autoIdentifier);
    }
  };

  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanTitle = title.trim();
    const cleanIdentifier = fieldIdentifier.trim();
    const cleanPlaceholder = placeHolder.trim();

    if (!cleanTitle) {
      setErrorMsg("Please provide a Title.");
      return;
    }

    if (!cleanIdentifier) {
      setErrorMsg("Please provide a uniqueIdentifier.");
      return;
    }

    if (!IDENTIFIER_REGEX.test(cleanIdentifier)) {
      setErrorMsg(
        "uniqueIdentifier must start with a letter and contain only letters, numbers, or underscores."
      );
      return;
    }

    const isDuplicateIdentifier = existingIdentifiers.some(
      (id) =>
        id.toLowerCase() === cleanIdentifier.toLowerCase() &&
        id !== fieldToEdit?.name
    );

    if (isDuplicateIdentifier) {
      setErrorMsg(`uniqueIdentifier "${cleanIdentifier}" is already in use.`);
      return;
    }

    if (!fieldType) {
      setErrorMsg("Please select a FieldType.");
      return;
    }

    if (!cleanPlaceholder) {
      setErrorMsg("Please provide a placeHolder.");
      return;
    }

    if (isRequired === null) {
      setErrorMsg("Please select whether this field is Required or Optional.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          label: cleanTitle,
          name: cleanIdentifier,
          type: fieldType,
          placeholder: cleanPlaceholder,
          required: isCoreRequiredField ? true : isRequired,
        },
        fieldToEdit?.id
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save field configuration.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="field-modal-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            {fieldToEdit ? "Edit Field" : "Create New Field"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {isSystemField
              ? "System field: label and placeholder can be customized while database keys stay locked."
              : fieldToEdit
              ? "Update the configuration for this field."
              : "Define a new schema attribute for research domains."}
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close form"
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Error Feedback */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50/80 p-2.5 text-xs font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      {/* Single-Column Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3.5">
        {/* 1. Title */}
        <div>
          <label
            htmlFor="field-title"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="field-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., Primary Research Group"
            className={inputClass}
            required
          />
        </div>

        {/* 2. uniqueIdentifier */}
        <div>
          <label
            htmlFor="field-unique-identifier"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
          >
            uniqueIdentifier <span className="text-red-500">*</span>
          </label>
          <input
            id="field-unique-identifier"
            type="text"
            value={fieldIdentifier}
            disabled={isSystemField}
            onChange={(e) => setFieldIdentifier(e.target.value)}
            placeholder="e.g., primaryResearchGroup"
            className={`${inputClass} font-mono`}
            required
          />
        </div>

        {/* 3. FieldType */}
        <div>
          <label
            id="field-type-label"
            htmlFor="field-type-trigger"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
          >
            FieldType <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              id="field-type-trigger"
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-controls="field-type-listbox"
              aria-labelledby="field-type-label"
              disabled={isSystemField}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition-all text-left focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 ${
                !fieldType && errorMsg
                  ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20 dark:border-red-500 dark:bg-red-950/20"
                  : isDropdownOpen
                  ? "border-[#172554] bg-white ring-2 ring-[#172554]/10 dark:border-blue-400 dark:bg-zinc-800 dark:ring-blue-400/20"
                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/60 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 text-zinc-900 dark:text-zinc-100 cursor-pointer"
              }`}
            >
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-200/80 text-[10px] font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                    {selectedOption.badge}
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedOption.label}
                  </span>
                </div>
              ) : fieldType ? (
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase">
                  {fieldType}
                </span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500">
                  Select field type...
                </span>
              )}
              <span
                className={`text-[10px] text-zinc-400 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? "rotate-180 text-[#172554] dark:text-blue-400" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* Custom Styled Popover Options Menu */}
            {isDropdownOpen && !isSystemField && (
              <div
                id="field-type-listbox"
                role="listbox"
                aria-label="Field type options"
                className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-700 dark:bg-zinc-800 backdrop-blur-md"
              >
                <div className="space-y-1">
                  {FIELD_TYPE_OPTIONS.map((opt) => {
                    const isSelected = opt.value === fieldType;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectType(opt.value)}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/80 text-[#172554] dark:bg-blue-950/50 dark:text-blue-300"
                            : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                              isSelected
                                ? "bg-[#172554] text-white dark:bg-blue-600"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            {opt.badge}
                          </span>
                          <div>
                            <div
                              className={`text-xs ${
                                isSelected ? "font-bold" : "font-medium"
                              }`}
                            >
                              {opt.label}
                            </div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              {opt.description}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#172554] dark:text-blue-400">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. placeHolder */}
        <div>
          <label
            htmlFor="field-placeholder"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
          >
            placeHolder <span className="text-red-500">*</span>
          </label>
          <input
            id="field-placeholder"
            type="text"
            value={placeHolder}
            onChange={(e) => setPlaceHolder(e.target.value)}
            placeholder="Hint shown inside empty input"
            className={inputClass}
            required
          />
        </div>

        {/* 5. Required (Mandatory selection) */}
        <div>
          <span
            id="field-required-label"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Required <span className="text-red-500">*</span>
          </span>
          <div
            role="radiogroup"
            aria-labelledby="field-required-label"
            aria-required="true"
            className={`grid grid-cols-2 gap-2 rounded-xl p-1 border transition-all ${
              isRequired === null && errorMsg
                ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20 dark:border-red-500 dark:bg-red-950/20"
                : "border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-800/50"
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isRequired === true}
              onClick={() => {
                setIsRequired(true);
                setErrorMsg("");
              }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                isRequired === true
                  ? "bg-[#172554] text-white shadow-xs dark:bg-blue-600"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/60"
              }`}
            >
              Required
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={isRequired === false}
              disabled={isCoreRequiredField}
              onClick={() => {
                setIsRequired(false);
                setErrorMsg("");
              }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                isRequired === false
                  ? "bg-[#172554] text-white shadow-xs dark:bg-blue-600 cursor-pointer"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/60 cursor-pointer"
              }`}
            >
              Optional
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1e3a8a] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : fieldToEdit
              ? "Save Changes"
              : "Create Field"}
          </button>
        </div>
      </form>
    </div>
  );
}
