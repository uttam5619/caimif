"use client";

import React, { useState } from "react";
import type {
  CollaborationPayload,
  CollaborationRecord,
  EditCollaborationModalProps,
} from "./types";

function toDateInputValue(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
}

interface EditCollaborationFormInnerProps {
  record: CollaborationRecord;
  onClose: () => void;
  onSave: (
    recordId: string,
    payload: Partial<CollaborationPayload>
  ) => Promise<void> | void;
}

function EditCollaborationFormInner({
  record,
  onClose,
  onSave,
}: EditCollaborationFormInnerProps) {
  const [firstParty, setFirstParty] = useState(record.firstParty);
  const [secondParty, setSecondParty] = useState(record.secondParty);
  const [date, setDate] = useState(toDateInputValue(record.date));
  const [leadingPerson, setLeadingPerson] = useState(record.leadingPerson);
  const [type, setType] = useState(record.type);
  const [content, setContent] = useState(record.content);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const payload: Partial<CollaborationPayload> = {
      firstParty: firstParty.trim() || record.firstParty,
      secondParty: secondParty.trim() || record.secondParty,
      date: date.trim() || record.date,
      leadingPerson: leadingPerson.trim() || record.leadingPerson,
      type: type.trim() || record.type,
      content: content.trim() || record.content,
    };

    setIsSaving(true);
    try {
      await onSave(record.id, payload);
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to update collaboration."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="edit-collab-first-party" className={labelClass}>
            First Party
          </label>
          <input
            id="edit-collab-first-party"
            type="text"
            value={firstParty}
            onChange={(e) => setFirstParty(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="edit-collab-second-party" className={labelClass}>
            Second Party
          </label>
          <input
            id="edit-collab-second-party"
            type="text"
            value={secondParty}
            onChange={(e) => setSecondParty(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="edit-collab-date" className={labelClass}>
            Date
          </label>
          <input
            id="edit-collab-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="edit-collab-leading-person" className={labelClass}>
            Leading Person
          </label>
          <input
            id="edit-collab-leading-person"
            type="text"
            value={leadingPerson}
            onChange={(e) => setLeadingPerson(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="edit-collab-type" className={labelClass}>
            Type
          </label>
          <input
            id="edit-collab-type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="edit-collab-content" className={labelClass}>
          Content
        </label>
        <textarea
          id="edit-collab-content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={textareaClass}
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
 * EditCollaborationModal Component
 *
 * Non-scrollable dialog for editing an existing `Collaboration` record.
 */
export default function EditCollaborationModal({
  isOpen,
  record,
  onClose,
  onSave,
}: EditCollaborationModalProps) {
  if (!isOpen || !record) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-collaboration-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h3
            id="edit-collaboration-modal-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100"
          >
            Edit Collaboration
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit collaboration modal"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <EditCollaborationFormInner
          key={record.id}
          record={record}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
