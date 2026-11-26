"use client";

import React from "react";
import type { DomainFieldModalProps } from "./types";
import HandleFieldForm from "./HandleFieldForm";

/**
 * DomainFieldModal Component
 *
 * Dedicated modal dialog container wrapping the HandleFieldForm component.
 * Responsible strictly for modal backdrop, overlay handling, and dialog shell.
 */
export default function DomainFieldModal({
  isOpen,
  fieldToEdit,
  existingIdentifiers = [],
  onClose,
  onSave,
}: DomainFieldModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="field-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <HandleFieldForm
          key={fieldToEdit?.id ?? "create-new-field"}
          fieldToEdit={fieldToEdit}
          existingIdentifiers={existingIdentifiers}
          onCancel={onClose}
          onSubmit={onSave}
        />
      </div>
    </div>
  );
}
