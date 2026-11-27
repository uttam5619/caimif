"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TEAM_CARD_TABS } from "./team.config";
import type { TeamCardTabKey, TeamMemberCardProps } from "./types";

/**
 * Computes up to two uppercase initials for the circular avatar fallback when no photo exists.
 */
function getMemberInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0 && !/^(dr|prof|mr|ms|er)\.?$/i.test(word));
  if (parts.length === 0) {
    return name.trim().slice(0, 2).toUpperCase() || "TM";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Loading skeleton matching the compact tabbed `TeamMemberCard` silhouette.
 */
export function TeamMemberCardSkeleton() {
  return (
    <div className="w-full max-w-[330px] rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div className="mx-auto h-24 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-5 grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-4 rounded bg-zinc-100 dark:bg-zinc-800/70" />
      </div>
      <div className="mt-4 min-h-[145px] space-y-2.5">
        <div className="h-3.5 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-3.5 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-3.5 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-3.5 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800/70" />
      </div>
      <div className="mt-5 h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

/**
 * Renders the active tab body (`Profile`, `Area of Interest`, or `Qualifications`).
 */
function renderTabContent(
  tab: TeamCardTabKey,
  member: TeamMemberCardProps["member"]
): React.ReactNode {
  if (tab === "profile") {
    const profileRows = [
      { label: "Name", value: member.name },
      { label: "Designation", value: member.designation },
      { label: "Department", value: member.department },
      { label: "School", value: member.school },
      { label: "Email", value: member.email },
    ].filter((row): row is { label: string; value: string } =>
      Boolean(row.value && row.value.trim().length > 0)
    );

    return (
      <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
        {profileRows.map((row) => (
          <p key={row.label} className="break-words">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {row.label}:{" "}
            </span>
            {row.value}
          </p>
        ))}
      </div>
    );
  }

  if (tab === "interests") {
    const hasInterest = Boolean(member.areaOfInterest?.trim());
    const hasSpecializations = member.specializations.length > 0;

    if (!hasInterest && !hasSpecializations) {
      return (
        <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400">
          No research interests listed yet.
        </p>
      );
    }

    return (
      <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
        {hasInterest && (
          <p className="break-words">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Area of Interest:{" "}
            </span>
            {member.areaOfInterest}
          </p>
        )}
        {hasSpecializations && (
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Specializations:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {member.specializations.map((spec) => (
                <span
                  key={`${member.id}-spec-${spec}`}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const hasQualification = Boolean(member.qualification?.trim());
  const hasCertifications = member.certifications.length > 0;
  const hasAbout = Boolean(member.about?.trim());

  if (!hasQualification && !hasCertifications && !hasAbout) {
    return (
      <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400">
        No qualifications listed yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
      {hasQualification && (
        <p className="break-words">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Qualification:{" "}
          </span>
          {member.qualification}
        </p>
      )}
      {hasCertifications && (
        <div>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
            Certifications:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {member.certifications.map((cert) => (
              <span
                key={`${member.id}-cert-${cert}`}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
      {hasAbout && (
        <p className="break-words line-clamp-4">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            About:{" "}
          </span>
          {member.about}
        </p>
      )}
    </div>
  );
}

/**
 * TeamMemberCard Component
 *
 * Interactive team member card featuring:
 * - Centered circular avatar photo (or initials fallback)
 * - Top-right Share button copying/sharing the member's profile URL
 * - Three horizontal tabs (`Profile`, `Area of Interest`, `Qualifications`)
 * - Full-width `Visit Profile` CTA redirecting to `/team/[id]`
 */
export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [activeTab, setActiveTab] = useState<TeamCardTabKey>("profile");
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const profileHref = `/team/${member.id}`;

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${profileHref}`
        : profileHref;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: member.name,
          text: member.designation ?? `${member.name} — CAIMIF Team`,
          url: shareUrl,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        if (copyTimerRef.current) {
          clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Ignore cancelled native share sheets
    }
  };

  return (
    <article className="relative flex w-full max-w-[330px] flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Top-Right Circular Share Button */}
      <div className="absolute right-4 top-4 flex items-center gap-1.5">
        {copied && (
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
            Copied
          </span>
        )}
        <button
          type="button"
          onClick={handleShare}
          aria-label={`Share ${member.name}'s profile`}
          title="Share profile link"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50/70 text-[#1d4ed8] transition-colors hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.9}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>

      <div>
        {/* Centered Circular Avatar */}
        <div className="flex justify-center pt-1">
          {member.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={member.imageUrl}
              alt={member.name}
              className="h-24 w-24 rounded-full object-cover border border-zinc-200/80 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#172554] text-white text-xl font-bold shadow-xs">
              {getMemberInitials(member.name)}
            </div>
          )}
        </div>

        {/* 3 Card Tabs */}
        <div
          role="tablist"
          aria-label={`${member.name} details`}
          className="mt-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800"
        >
          {TEAM_CARD_TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`-mb-px border-b-2 pb-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "border-orange-500 font-semibold text-orange-600 dark:text-orange-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div role="tabpanel" className="mt-4 min-h-[150px]">
          {renderTabContent(activeTab, member)}
        </div>
      </div>

      {/* Visit Profile Action Button */}
      <Link
        href={profileHref}
        className="mt-5 block w-full rounded-xl bg-gradient-to-r from-[#0b132b] via-[#172554] to-[#0b132b] py-3 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
      >
        Visit Profile
      </Link>
    </article>
  );
}
