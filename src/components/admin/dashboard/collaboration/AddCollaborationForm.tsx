"use client";

import React, { useState } from "react";
import { createCollaboration } from "@/lib/api/collaboration.api";
import type {
  AddCollaborationFormProps,
  CollaborationPayload,
  CollaborationRecord,
} from "./types";

/**
 * AddCollaborationForm Component
 *
 * Synchronized directly with all scalar fields of `Collaboration` in `prisma/models/collaboration.prisma`:
 * - firstParty (required String)
 * - secondParty (required String)
 * - date (required DateTime)
 * - leadingPerson (required String)
 * - type (required String)
 * - content (required String @db.Text)
 */
export default function AddCollaborationForm({
  onSubmitCollaboration,
  onSuccess,
}: AddCollaborationFormProps = {}) {
  const [firstParty, setFirstParty] = useState("");
  const [secondParty, setSecondParty] = useState("");
  const [date, setDate] = useState("");
  const [leadingPerson, setLeadingPerson] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetForm = () => {
    setFirstParty("");
    setSecondParty("");
    setDate("");
    setLeadingPerson("");
    setType("");
    setContent("");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanFirstParty = firstParty.trim();
    const cleanSecondParty = secondParty.trim();
    const cleanDate = date.trim();
    const cleanLeadingPerson = leadingPerson.trim();
    const cleanType = type.trim();
    const cleanContent = content.trim();

    if (!cleanFirstParty) {
      setErrorMsg("Please enter the First Party.");
      return;
    }
    if (!cleanSecondParty) {
      setErrorMsg("Please enter the Second Party.");
      return;
    }
    if (!cleanDate) {
      setErrorMsg("Please select the Collaboration Date.");
      return;
    }
    if (!cleanLeadingPerson) {
      setErrorMsg("Please enter the Leading Person.");
      return;
    }
    if (!cleanType) {
      setErrorMsg("Please enter the Collaboration Type.");
      return;
    }
    if (!cleanContent) {
      setErrorMsg("Please enter the Collaboration Content.");
      return;
    }

    const payload: CollaborationPayload = {
      firstParty: cleanFirstParty,
      secondParty: cleanSecondParty,
      date: cleanDate,
      leadingPerson: cleanLeadingPerson,
      type: cleanType,
      content: cleanContent,
    };

    setIsLoading(true);
    try {
      const created: CollaborationRecord = onSubmitCollaboration
        ? await onSubmitCollaboration(payload)
        : await createCollaboration(payload);

      resetForm();
      setSuccessMsg("Collaboration added successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error ? error.message : "Failed to add collaboration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Add Collaboration
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Register a new institutional MoU, research partnership, or academic collaboration record.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="collab-first-party" className={labelClass}>
              First Party <span className="text-rose-500">*</span>
            </label>
            <input
              id="collab-first-party"
              type="text"
              value={firstParty}
              onChange={(e) => setFirstParty(e.target.value)}
              placeholder="e.g. CAIMIF, Sharda University"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="collab-second-party" className={labelClass}>
              Second Party <span className="text-rose-500">*</span>
            </label>
            <input
              id="collab-second-party"
              type="text"
              value={secondParty}
              onChange={(e) => setSecondParty(e.target.value)}
              placeholder="e.g. IIT Delhi / Partner Organization"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="collab-date" className={labelClass}>
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="collab-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="collab-leading-person" className={labelClass}>
              Leading Person <span className="text-rose-500">*</span>
            </label>
            <input
              id="collab-leading-person"
              type="text"
              value={leadingPerson}
              onChange={(e) => setLeadingPerson(e.target.value)}
              placeholder="e.g. Prof. Ashok Kumar"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="collab-type" className={labelClass}>
              Type <span className="text-rose-500">*</span>
            </label>
            <input
              id="collab-type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. MoU / Industry / Academic"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="collab-content" className={labelClass}>
            Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="collab-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe the scope, objectives, and key deliverables of this collaboration..."
            className={textareaClass}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Adding Collaboration..." : "Add Collaboration"}
          </button>
        </div>
      </form>
    </div>
  );
}
