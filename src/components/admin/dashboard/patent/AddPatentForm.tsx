"use client";

import React, { useState } from "react";
import { createPatent } from "@/lib/api/patent.api";
import { PATENT_STATUS_OPTIONS } from "./patent.data";
import type {
  AddPatentFormProps,
  CreatePatentPayload,
  PatentStatus,
} from "./types";

/**
 * AddPatentForm Component
 *
 * Collects attributes synchronized with `Patent` in `prisma/models/patents.prisma`:
 * - title (Patent Name — required)
 * - domain (optional)
 * - status (`PUBLISHED` | `GRANTED` — optional)
 * - nameOfInventors (optional)
 * - patentAgency (optional)
 * - country (optional)
 * - grantNumber (optional, unique when provided)
 *
 * `id`, `createdAt`, and `updatedAt` are auto-generated on the backend.
 */
export default function AddPatentForm({
  onSubmitPatent,
  onSuccess,
}: AddPatentFormProps = {}) {
  const [domain, setDomain] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PatentStatus | "">("");
  const [nameOfInventors, setNameOfInventors] = useState("");
  const [patentAgency, setPatentAgency] = useState("");
  const [country, setCountry] = useState("");
  const [grantNumber, setGrantNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetForm = () => {
    setDomain("");
    setTitle("");
    setStatus("");
    setNameOfInventors("");
    setPatentAgency("");
    setCountry("");
    setGrantNumber("");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMsg("Please enter the patent name.");
      return;
    }

    // Build payload strictly matching `prisma/models/patents.prisma` (no id or extra fields)
    const payload: CreatePatentPayload = {
      domain: domain.trim() || null,
      title: cleanTitle,
      status: status || null,
      nameOfInventors: nameOfInventors.trim() || null,
      patentAgency: patentAgency.trim() || null,
      country: country.trim() || null,
      grantNumber: grantNumber.trim() || null,
    };

    setIsLoading(true);
    try {
      const created = onSubmitPatent
        ? await onSubmitPatent(payload)
        : await createPatent(payload);

      resetForm();
      setSuccessMsg("Patent added successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add patent.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Add Patent
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Register a new patent record. Only Patent Name is required.
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Patent Name (required) & Domain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patent-title" className={labelClass}>
              Patent Name <span className="text-red-500">*</span>
            </label>
            <input
              id="patent-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="patent-domain" className={labelClass}>
              Domain
            </label>
            <input
              id="patent-domain"
              type="text"
              maxLength={191}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Status & Name of Inventors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patent-status" className={labelClass}>
              Status
            </label>
            <select
              id="patent-status"
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
            <label htmlFor="patent-inventors" className={labelClass}>
              Name of Inventors
            </label>
            <input
              id="patent-inventors"
              type="text"
              value={nameOfInventors}
              onChange={(e) => setNameOfInventors(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Patent Agency, Country & Grant Number */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="patent-agency" className={labelClass}>
              Patent Agency
            </label>
            <input
              id="patent-agency"
              type="text"
              maxLength={191}
              value={patentAgency}
              onChange={(e) => setPatentAgency(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="patent-country" className={labelClass}>
              Country
            </label>
            <input
              id="patent-country"
              type="text"
              maxLength={191}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="patent-grant-number" className={labelClass}>
              Grant Number
            </label>
            <input
              id="patent-grant-number"
              type="text"
              maxLength={191}
              value={grantNumber}
              onChange={(e) => setGrantNumber(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-xl bg-[#172554] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Add Patent"}
          </button>
        </div>
      </form>
    </div>
  );
}
