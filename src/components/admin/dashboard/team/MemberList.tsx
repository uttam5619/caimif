"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import { TEAM_CATEGORY_LABELS, TEAM_CATEGORY_OPTIONS } from "./team.data";
import type { MemberListProps, TeamCategory } from "./types";

/**
 * MemberList Component
 *
 * Displays a searchable, category-filterable, paginated responsive card grid
 * of CAIMIF Team members fetched from `/api/team`, avoiding horizontal tables
 * so no scrollbars appear at any viewport width.
 */
export default function MemberList({
  members,
  pagination,
  search,
  categoryFilter,
  isLoading,
  loadError = null,
  onSearchChange,
  onCategoryChange,
  onPageChange,
  onEdit,
  onDelete,
}: MemberListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      {/* Header, Category Filter & Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Team Directory
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total member{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) =>
              onCategoryChange(e.target.value as TeamCategory | "")
            }
            className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-xs font-medium text-zinc-700 focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200"
          >
            <option value="">All Categories</option>
            {TEAM_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search name, designation, school, email..."
            ariaLabel="Search team members"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && members.length === 0 ? (
        <div className="p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-36 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-36 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-36 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : members.length === 0 ? (
        /* Empty / Error State */
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load team members from the server."
              : search.trim() || categoryFilter
                ? "No team members matched your active filters."
                : "No team members registered yet."}
          </p>
          {(search.trim() || categoryFilter) && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                onCategoryChange("");
              }}
              className="rounded-xl border border-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Full-Width Stacked Member Cards (prevents horizontal overflow/scrollbars) */}
          <div className="p-5 flex flex-col gap-4">
            {members.map((member) => (
              <article
                key={member.id}
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col justify-between gap-4 hover:border-[#172554]/35 dark:hover:border-blue-500/40 transition-colors"
              >
                <div className="space-y-3">
                  {/* Top Identity & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {member.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="h-12 w-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#172554] dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold shrink-0">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words">
                            {member.name}
                          </h3>
                          <span className="inline-flex rounded-full border border-blue-200/80 bg-blue-50/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                            {TEAM_CATEGORY_LABELS[member.category] ??
                              member.category}
                          </span>
                        </div>
                        {member.designation && (
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 break-words">
                            {member.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEdit(member)}
                        className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(member)}
                        className="rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* About */}
                  {member.about && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">
                      {member.about.length > 160
                        ? `${member.about.slice(0, 160)}...`
                        : member.about}
                    </p>
                  )}

                  {/* Academic & Contact Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 pt-1">
                    {member.school && (
                      <div className="break-words">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          School:
                        </span>{" "}
                        {member.school}
                      </div>
                    )}
                    {member.department && (
                      <div className="break-words">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          Department:
                        </span>{" "}
                        {member.department}
                      </div>
                    )}
                    {member.email && (
                      <div className="break-all">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          Email:
                        </span>{" "}
                        {member.email}
                      </div>
                    )}
                    {member.qualification && (
                      <div className="break-words">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                          Qualification:
                        </span>{" "}
                        {member.qualification}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specializations, Certifications & Area of Interest */}
                {(member.specializations.length > 0 ||
                  member.certifications.length > 0 ||
                  Boolean(member.areaOfInterest)) && (
                  <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800 space-y-2">
                    {member.specializations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mr-1">
                          Specializations:
                        </span>
                        {member.specializations.map((item) => (
                          <span
                            key={`spec-${item}`}
                            className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {member.certifications.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mr-1">
                          Certifications:
                        </span>
                        {member.certifications.map((cert) => (
                          <span
                            key={`cert-${cert}`}
                            className="inline-flex rounded-md border border-emerald-200/70 bg-emerald-50/70 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}

                    {member.areaOfInterest && (
                      <div className="text-xs text-zinc-600 dark:text-zinc-300 break-words pt-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mr-1.5">
                          Area of Interest:
                        </span>
                        <span>{member.areaOfInterest}</span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
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
