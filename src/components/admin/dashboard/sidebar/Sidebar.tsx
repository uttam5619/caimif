"use client";

import React, { useState } from "react";
import type { SidebarProps } from "./types";
import { NAV_ITEMS } from "./sidebar.data";

/**
 * Sidebar Component
 *
 * Left section of the Admin Dashboard.
 * Filters RBAC-restricted entries (`SecurityAdmin` vs `SubAdmin`), displays the
 * verified user's live identity, and connects Sign Out / Sign Out All Devices actions.
 */
export default function Sidebar({
  activeTab: externalActiveTab,
  onSelectTab,
  user,
  onSignOut,
  onSignOutAll,
  isSigningOut = false,
}: SidebarProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState("research-domains");
  const currentTab = externalActiveTab ?? internalActiveTab;

  const userRole = user?.adminRole ?? "SubAdmin";
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const initials =
    user?.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || (userRole === "SecurityAdmin" ? "SA" : "AD");

  const roleDisplay =
    userRole === "SecurityAdmin" ? "Security Admin" : "Sub Admin";

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const navItemClass =
    "flex items-center gap-3 w-full rounded-xl px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer text-left";

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 h-full p-4 select-none">
      {/* Top Branding Section */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-3 px-2 py-3 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172554] text-white font-extrabold text-base shadow-xs">
            C
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-900 dark:text-zinc-100 block">
              CAIMIF Admin
            </span>
            <span className="text-[10px] font-medium text-zinc-500 block">
              Sharda University
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Section */}
        <nav className="mt-4 flex-1 overflow-y-auto space-y-1 pr-1">
          {visibleItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`${navItemClass} ${
                  isActive
                    ? "bg-[#172554] text-white shadow-xs font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Session Controls */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5 flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-[#172554] dark:text-blue-300 font-bold text-xs">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
              {user?.name || roleDisplay}
            </span>
            <span className="text-[10px] text-zinc-500 truncate block">
              {roleDisplay} · {user?.email || ""}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={isSigningOut}
          onClick={onSignOut}
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>

        {onSignOutAll && (
          <button
            type="button"
            disabled={isSigningOut}
            onClick={onSignOutAll}
            className="flex items-center justify-center w-full rounded-xl px-3 py-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Sign Out All Devices
          </button>
        )}
      </div>
    </aside>
  );
}
