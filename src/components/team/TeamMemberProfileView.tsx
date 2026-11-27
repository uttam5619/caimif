import React from "react";
import Link from "next/link";
import { TEAM_CATEGORY_LABELS } from "./team.config";
import type { TeamMemberProfileViewProps } from "./types";

/**
 * TeamMemberProfileView Component
 *
 * Full member profile page rendered on `/team/[id]` when clicking `Visit Profile`
 * or opening a shared member profile URL.
 */
export default function TeamMemberProfileView({
  member,
}: TeamMemberProfileViewProps) {
  const categoryLabel =
    TEAM_CATEGORY_LABELS[member.category] ?? member.category;

  const attributeRows = [
    { label: "Designation", value: member.designation },
    { label: "Qualification", value: member.qualification },
    { label: "School", value: member.school },
    { label: "Department", value: member.department },
    { label: "Area of Interest", value: member.areaOfInterest },
    { label: "Email", value: member.email },
  ].filter((row): row is { label: string; value: string } =>
    Boolean(row.value && row.value.trim().length > 0)
  );

  return (
    <div className="space-y-6">
      <Link
        href="/team"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#172554] hover:underline dark:text-blue-400"
      >
        &larr; Back to Team Directory
      </Link>

      <article className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-zinc-100 pb-8 dark:border-zinc-800">
          {member.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={member.imageUrl}
              alt={member.name}
              className="h-28 w-28 shrink-0 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#172554] text-white text-2xl font-bold">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#172554] dark:bg-blue-950/60 dark:text-blue-300">
              {categoryLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {member.name}
            </h1>
            {member.designation && (
              <p className="text-sm sm:text-base font-medium text-zinc-600 dark:text-zinc-300">
                {member.designation}
              </p>
            )}
          </div>
        </div>

        {member.about && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              About
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {member.about}
            </p>
          </div>
        )}

        {attributeRows.length > 0 && (
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-zinc-50/80 p-5 dark:bg-zinc-950/60">
            {attributeRows.map((row) => (
              <div key={row.label}>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words">
                  {row.label === "Email" ? (
                    <a
                      href={`mailto:${row.value}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {(member.specializations.length > 0 ||
          member.certifications.length > 0) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {member.specializations.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Specializations
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {member.specializations.map((item) => (
                    <span
                      key={`${member.id}-profile-spec-${item}`}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#172554] dark:bg-blue-950/60 dark:text-blue-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Certifications
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {member.certifications.map((cert) => (
                    <span
                      key={`${member.id}-profile-cert-${cert}`}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
