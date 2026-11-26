"use client";

import React from "react";
import type { ResearchDomainListProps } from "./types";

/**
 * ResearchDomainList Component
 *
 * Tab 1 Responsibility:
 * - Renders the list of registered research domains including cover image thumbnails.
 * - Displays ID, Title, Short Description, Truncated Description (max 150 chars),
 *   and populated custom field attributes.
 * - Provides Edit and Delete action controls and loading/empty states.
 */
export default function ResearchDomainList({
  domains,
  fields = [],
  isLoading = false,
  loadError = null,
  onEdit,
  onDelete,
  onRegisterNew,
}: ResearchDomainListProps) {
  const customFieldDefs = fields.filter(
    (f) =>
      f.name !== "title" &&
      f.name !== "shortDescription" &&
      f.name !== "description" &&
      f.name !== "image"
  );

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Published Domains
        </h2>
        <span className="text-xs text-zinc-400">CAIMIF Core Focus</span>
      </div>

      {isLoading && domains.length === 0 ? (
        <div className="p-6 space-y-3 animate-pulse">
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : domains.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {loadError
              ? "Unable to load research domains from the server."
              : "No research domains registered yet."}
          </p>
          {!loadError && (
            <button
              type="button"
              onClick={onRegisterNew}
              className="rounded-xl bg-[#172554] hover:bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Register New Domain
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 w-24">ID</th>
                <th className="px-5 py-3.5 w-64">Domain</th>
                <th className="px-5 py-3.5 w-60">Short Description</th>
                <th className="px-5 py-3.5">Description &amp; Attributes</th>
                <th className="px-5 py-3.5 text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {domains.map((domain) => {
                const populatedCustomEntries = customFieldDefs
                  .map((field) => ({
                    label: field.label,
                    value: domain.customFields?.[field.name],
                  }))
                  .filter(
                    (entry) =>
                      entry.value !== undefined && String(entry.value).trim() !== ""
                  );

                return (
                  <tr
                    key={domain.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-5 py-4 align-top">
                      <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                        {domain.id.slice(0, 10)}
                      </span>
                    </td>

                    {/* Cover Image + Title */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-3">
                        {domain.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={domain.imageUrl}
                            alt={domain.title}
                            className="h-10 w-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#172554] dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold shrink-0">
                            {domain.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                          {domain.title}
                        </span>
                      </div>
                    </td>

                    {/* Short Description */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
                        {domain.shortDescription}
                      </span>
                    </td>

                    {/* Description + Custom Field Pills */}
                    <td className="px-5 py-4 align-top space-y-2">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {domain.description.length > 150
                          ? `${domain.description.slice(0, 150)}...`
                          : domain.description}
                      </p>

                      {populatedCustomEntries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {populatedCustomEntries.map((entry) => (
                            <span
                              key={entry.label}
                              className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-300"
                            >
                              <span className="font-semibold">{entry.label}:</span>
                              <span>{String(entry.value)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Actions: Edit and Delete buttons */}
                    <td className="px-5 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(domain)}
                          className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(domain.id)}
                          className="rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
