"use client";

import React, { useState } from "react";
import { PATENT_STATUS_OPTIONS } from "./patent.data";
import type {
  EditPatentModalProps,
  PatentRecord,
  PatentStatus,
  UpdatePatentPayload,
} from "./types";

interface EditPatentFormInnerProps {
  patent: PatentRecord;
  onClose: () => void;
  onSave: (
    patentId: string,
    payload: UpdatePatentPayload
  ) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={patent.id}` so state resets cleanly
 * whenever a different Patent record is opened for editing.
 */
function EditPatentFormInner({
  patent,
  onClose,
  onSave,
}: EditPatentFormInnerProps) {
  const [title, setTitle] = useState(patent.title);
  const [domain, setDomain] = useState(patent.domain ?? "");
  const [status, setStatus] = useState<PatentStatus | "">(patent.status ?? "");
  const [nameOfInventors, setNameOfInventors] = useState(
    patent.nameOfInventors ?? ""
  );
  const [patentAgency, setPatentAgency] = useState(patent.patentAgency ?? "");
  const [country, setCountry] = useState(patent.country ?? "");
  const [grantNumber, setGrantNumber] = useState(patent.grantNumber ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanTitle = title.trim();

    const payload: UpdatePatentPayload = {
      ...(cleanTitle ? { title: cleanTitle } : {}),
      domain: domain.trim() || null,
      status: status || null,
      nameOfInventors: nameOfInventors.trim() || null,
      patentAgency: patentAgency.trim() || null,
      country: country.trim() || null,
      grantNumber: grantNumber.trim() || null,
    };

    setIsSaving(true);
    try {
      await onSave(patent.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update patent.";
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
    <>
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="edit-patent-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Patent
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update details for {patent.id}.
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

      {errorMsg && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50/80 p-2.5 text-xs font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-patent-name" className={labelClass}>
              Patent Name
            </label>
            <input
              id="edit-patent-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-patent-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="edit-patent-domain"
              type="text"
              maxLength={191}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-patent-status" className={labelClass}>
              Status
            </label>
            <select
              id="edit-patent-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PatentStatus | "")}
              className={inputClass}
            >
              <option value="">Select status</option>
              {PATENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-patent-inventors" className={labelClass}>
              Name of Inventors
            </label>
            <input
              id="edit-patent-inventors"
              type="text"
              value={nameOfInventors}
              onChange={(e) => setNameOfInventors(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="edit-patent-agency" className={labelClass}>
              Patent Agency
            </label>
            <input
              id="edit-patent-agency"
              type="text"
              maxLength={191}
              value={patentAgency}
              onChange={(e) => setPatentAgency(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-patent-country" className={labelClass}>
              Country
            </label>
            <input
              id="edit-patent-country"
              type="text"
              maxLength={191}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-patent-grant-number" className={labelClass}>
              Grant Number
            </label>
            <input
              id="edit-patent-grant-number"
              type="text"
              maxLength={191}
              value={grantNumber}
              onChange={(e) => setGrantNumber(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

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
 * EditPatentModal Component
 *
 * Modal dialog for editing an existing Patent record.
 */
export default function EditPatentModal({
  isOpen,
  patent,
  onClose,
  onSave,
}: EditPatentModalProps) {
  if (!isOpen || !patent) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-patent-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditPatentFormInner
          key={patent.id}
          patent={patent}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
