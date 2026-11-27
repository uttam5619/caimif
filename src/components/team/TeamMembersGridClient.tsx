"use client";

import React, { useState } from "react";
import TeamMemberCard from "./TeamMemberCard";
import { TEAM_CATEGORY_FILTERS, TEAM_CATEGORY_SECTIONS } from "./team.config";
import type {
  TeamCategoryFilterKey,
  TeamMembersGridClientProps,
} from "./types";

/**
 * TeamMembersGridClient Component
 *
 * Displays a top category filter bar (`All`, `Head`, `Professor`, `PhD Scholar`, `Alumni`)
 * followed by category-grouped `TeamMemberCard` sections with at most 3 cards per row.
 */
export default function TeamMembersGridClient({
  items,
  loadFailed,
}: TeamMembersGridClientProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<TeamCategoryFilterKey>("ALL");

  if (items.length === 0) {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {loadFailed
            ? "Team directory is temporarily unavailable."
            : "No team members have been added yet."}
        </p>
      </div>
    );
  }

  const sectionsToRender =
    selectedCategory === "ALL"
      ? TEAM_CATEGORY_SECTIONS.map((section) => ({
          ...section,
          members: items.filter(
            (member) => member.category === section.category
          ),
        })).filter((section) => section.members.length > 0)
      : TEAM_CATEGORY_SECTIONS.filter(
          (section) => section.category === selectedCategory
        ).map((section) => ({
          ...section,
          members: items.filter(
            (member) => member.category === section.category
          ),
        }));

  return (
    <div className="mt-10 w-full">
      {/* Top Category Filter Pills */}
      <div
        role="group"
        aria-label="Filter team members by category"
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {TEAM_CATEGORY_FILTERS.map((filter) => {
          const isActive = filter.key === selectedCategory;

          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedCategory(filter.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#172554] text-white shadow-sm dark:bg-blue-600"
                  : "border border-zinc-200/90 bg-white text-zinc-700 shadow-xs hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Filtered Category Sections (Max 3 Cards Per Row) */}
      <div className="mt-10 space-y-14">
        {sectionsToRender.map((section) => {
          const count = section.members.length;

          return (
            <section key={section.category} className="w-full">
              <div className="flex items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 shrink-0">
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800" />
                <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-100/80 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  {count} {count === 1 ? "member" : "members"}
                </span>
              </div>

              {count === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    No members found in the {section.title} category.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("ALL")}
                    className="mt-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    Show All Categories
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center sm:justify-items-start">
                  {section.members.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
