import React from "react";
import Image from "next/image";

export interface CaimifHeadCardProps {
  name?: string;
  title?: string;
  subtitle?: string;
  credentials?: string;
  room?: string;
  email?: string;
  imageUrl?: string;
  initials?: string;
  className?: string;
}

/**
 * CaimifHeadCard Component
 *
 * Dedicated card component for the Head of CAIMIF.
 * Displays academic portrait badge/image, leadership titles, credentials,
 * and office contact details in a distinct, elevated, rounded card.
 */
export default function CaimifHeadCard({
  name = "Prof. (Dr.) Rajesh K. Sharma",
  title = "HEAD & ADVISORY CHAIR, CAIMIF",
  subtitle = "Dean of Research, Sharda University",
  credentials = "Ph.D. (IIT Delhi) • Postdoc (Max Planck)",
  room = "Room 301, Research Complex",
  email = "dean.research@sharda.ac.in",
  imageUrl,
  initials = "RS",
  className = "",
}: CaimifHeadCardProps) {
  return (
    <div
      className={`flex h-full w-full max-w-[340px] sm:max-w-[360px] mx-auto flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-7 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      {/* Profile Image / Avatar Container */}
      <div className="relative mx-auto flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#172554] via-blue-900 to-[#00191E] text-white shadow-md border-3 border-white dark:border-zinc-800 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl sm:text-4xl font-extrabold tracking-wider">
            {initials}
          </span>
        )}
        <span
          className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-800"
          title="Active Research Leadership"
        />
      </div>

      {/* Name & Leadership Titles */}
      <h3 className="mt-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {name}
      </h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
        {title}
      </p>
      {subtitle && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {subtitle}
        </p>
      )}

      {/* Academic Credentials Badge */}
      {credentials && (
        <div className="mt-3.5 inline-flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800/80 px-3.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700">
          {credentials}
        </div>
      )}

      {/* Contact / Office Details */}
      {(room || email) && (
        <div className="mt-5 w-full pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          {room && <p>{room}</p>}
          {email && (
            <p className="font-mono text-xs text-blue-700 dark:text-blue-400">
              {email}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
