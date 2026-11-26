"use client";

import React, { useState } from "react";
import type {
  DomainFieldDefinition,
  HandleFieldFormData,
  ManageResearchDomainsProps,
} from "./types";
import { INITIAL_DOMAIN_FIELDS } from "./researchDomainFields.data";
import DomainFieldModal from "./DomainFieldModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

/**
 * ManageResearchDomains Component
 *
 * Dedicated component on the "Manage Research Domains" tab.
 * Supports persisted backend field operations via async handlers as well as
 * standalone local state when rendered in isolation.
 */
export default function ManageResearchDomains({
  initialFields,
  onFieldsChange,
  onCreateField,
  onUpdateField,
  onDeleteField,
}: ManageResearchDomainsProps = {}) {
  const [internalFields, setInternalFields] = useState<DomainFieldDefinition[]>(
    initialFields ?? INITIAL_DOMAIN_FIELDS
  );

  const isExternallyControlled = Boolean(
    initialFields && (onFieldsChange || onCreateField || onUpdateField || onDeleteField)
  );
  const fields = isExternallyControlled && initialFields ? initialFields : internalFields;

  const updateLocalFields = (updated: DomainFieldDefinition[]) => {
    setInternalFields(updated);
    if (onFieldsChange) onFieldsChange(updated);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<DomainFieldDefinition | null>(null);
  const [fieldToDelete, setFieldToDelete] = useState<DomainFieldDefinition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);

  const existingIdentifiers = fields.map((f) => f.name);

  const handleOpenCreateModal = () => {
    setFieldToEdit(null);
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleOpenEditModal = (field: DomainFieldDefinition) => {
    setFieldToEdit(field);
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFieldToEdit(null);
  };

  const handleSaveField = async (
    fieldData: HandleFieldFormData,
    editId?: string
  ) => {
    if (editId) {
      if (onUpdateField) {
        await onUpdateField(editId, fieldData);
      } else {
        const updated = fields.map((f) =>
          f.id === editId ? { ...f, ...fieldData } : f
        );
        updateLocalFields(updated);
      }

      setStatusMessage({
        type: "success",
        text: `Field "${fieldData.label}" updated successfully.`,
      });
    } else {
      if (onCreateField) {
        await onCreateField(fieldData);
      } else {
        const newField: DomainFieldDefinition = {
          id: `field-${Date.now()}`,
          ...fieldData,
          required: fieldData.required ?? false,
          isSystem: false,
        };
        updateLocalFields([...fields, newField]);
      }

      setStatusMessage({
        type: "success",
        text: `Field "${fieldData.label}" created successfully.`,
      });
    }

    handleCloseModal();
  };

  const handleRequestDeleteField = (field: DomainFieldDefinition) => {
    if (field.isSystem) return;
    setFieldToDelete(field);
  };

  const handleConfirmDeleteField = async () => {
    if (!fieldToDelete) return;
    setIsDeleting(true);

    try {
      if (onDeleteField) {
        await onDeleteField(fieldToDelete.id);
      } else {
        const updated = fields.filter((f) => f.id !== fieldToDelete.id);
        updateLocalFields(updated);
      }

      setStatusMessage({
        type: "info",
        text: `Field "${fieldToDelete.label}" was deleted.`,
      });
      setFieldToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete field.";
      setStatusMessage({ type: "error", text: message });
      setFieldToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Notification Banner */}
      {statusMessage && (
        <div
          role={statusMessage.type === "error" ? "alert" : "status"}
          className={`rounded-xl p-3 text-xs font-medium flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
              : statusMessage.type === "error"
              ? "bg-red-50/80 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200"
              : "bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold ml-2 cursor-pointer opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Fields List Container */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header with Title and Create Field Button */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Research Domain Fields
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {fields.length} Active institutional schema fields.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#172554] hover:bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            <span>+</span>
            <span>Create Field</span>
          </button>
        </div>

        {/* Fields Rows */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {fields.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              No fields available. Click &quot;Create Field&quot; to define a new field.
            </div>
          ) : (
            fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between py-3.5 px-2 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 rounded-xl transition-colors gap-4"
              >
                {/* Field Name & Requirement/System Badges */}
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {field.label}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    {field.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                      field.required
                        ? "bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50"
                        : "bg-zinc-100 text-zinc-500 border border-zinc-200/70 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    }`}
                  >
                    {field.required ? "Required" : "Optional"}
                  </span>
                  {field.isSystem && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 bg-blue-50 text-[#172554] border border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50">
                      System
                    </span>
                  )}
                </div>

                {/* Actions: Edit and Delete (locked for System fields) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(field)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer border border-blue-200/60 dark:border-blue-900/40"
                  >
                    Edit
                  </button>
                  {!field.isSystem && (
                    <button
                      type="button"
                      onClick={() => handleRequestDeleteField(field)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-950/60 dark:hover:bg-red-900/60 rounded-lg transition-colors cursor-pointer border border-red-200/60 dark:border-red-900/40"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Reusable Modal for Creating and Editing Fields */}
      <DomainFieldModal
        isOpen={isModalOpen}
        fieldToEdit={fieldToEdit}
        existingIdentifiers={existingIdentifiers}
        onClose={handleCloseModal}
        onSave={handleSaveField}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={fieldToDelete !== null}
        title="Delete Field"
        itemName={fieldToDelete?.label ?? ""}
        description="This field will be removed from the Register New Domain form."
        isLoading={isDeleting}
        onCancel={() => setFieldToDelete(null)}
        onConfirm={handleConfirmDeleteField}
      />
    </div>
  );
}
