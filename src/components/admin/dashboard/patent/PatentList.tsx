"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import type { PatentListProps } from "./types";

/**
 * PatentList Component
 *
 * Displays a searchable, paginated table of CAIMIF Patent records
 * fetched from `/api/patents`, with Edit and Delete action controls per record.
 */
export default function PatentList({
  patents,
  pagination,
  search,
  isLoading,
  loadError = null,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
}: PatentListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-xs">
      {/* Table Header & Search */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Registered Patents
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total patent{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search patent name, domain, status, inventors, grant no..."
          ariaLabel="Search patents"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && patents.length === 0 ? (
        <div className="p-6 space-y-3 animate-pulse">
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : patents.length === 0 ? (
        /* Empty / Error State */
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load patents from the server."
              : search.trim()
                ? `No patents matched "${search.trim()}".`
                : "No patents registered yet."}
          </p>
          {search.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="rounded-xl border border-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Patent Name</th>
                  <th className="px-5 py-3.5 w-44">Domain</th>
                  <th className="px-5 py-3.5 w-28">Status</th>
                  <th className="px-5 py-3.5 w-56">Inventors</th>
                  <th className="px-5 py-3.5 w-44">Patent Agency</th>
                  <th className="px-5 py-3.5 w-32">Country</th>
                  <th className="px-5 py-3.5 w-40">Grant Number</th>
                  <th className="px-5 py-3.5 text-right w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {patents.map((patent) => (
                  <tr
                    key={patent.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Patent Name */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 block leading-snug">
                        {patent.title}
                      </span>
                    </td>

                    {/* Domain */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">
                        {patent.domain || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 align-top">
                      {patent.status ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            patent.status === "GRANTED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/50"
                              : "bg-blue-50 text-[#172554] border border-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/50"
                          }`}
                        >
                          {patent.status}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>

                    {/* Inventors */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">
                        {patent.nameOfInventors || "—"}
                      </span>
                    </td>

                    {/* Patent Agency */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">
                        {patent.patentAgency || "—"}
                      </span>
                    </td>

                    {/* Country */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">
                        {patent.country || "—"}
                      </span>
                    </td>

                    {/* Grant Number */}
                    <td className="px-5 py-4 align-top">
                      {patent.grantNumber ? (
                        <span className="font-mono text-xs text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                          {patent.grantNumber}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>

                    {/* Actions: Edit and Delete buttons */}
                    <td className="px-5 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(patent)}
                          className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(patent)}
                          className="rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || isLoading}
                  onClick={() => onPageChange(pagination.page - 1)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  onClick={() => onPageChange(pagination.page + 1)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
