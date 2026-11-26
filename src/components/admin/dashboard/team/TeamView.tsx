"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useTeam } from "@/hooks/useTeam";
import AddMemberForm from "./AddMemberForm";
import EditMemberModal from "./EditMemberModal";
import MemberList from "./MemberList";
import { TEAM_TABS } from "./team.data";
import type { TeamMemberRecord, TeamTabId } from "./types";

export interface TeamViewProps {
  userRole?: AdminRole;
}

/**
 * TeamView Component
 *
 * Tabbed container managing CAIMIF Team members:
 * - Tab 1: "List of Members" (delegated to MemberList with Edit and Delete actions)
 * - Tab 2: "Add Members" (delegated to AddMemberForm)
 */
export default function TeamView({
  userRole = "SecurityAdmin",
}: TeamViewProps = {}) {
  const {
    members,
    pagination,
    search,
    categoryFilter,
    isLoading,
    loadError,
    refreshMembers,
    createMember,
    updateMember,
    deleteMember,
    updateSearch,
    updateCategoryFilter,
    goToPage,
  } = useTeam(userRole);

  const [activeTab, setActiveTab] = useState<TeamTabId>("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMemberRecord | null>(
    null
  );
  const [memberToDelete, setMemberToDelete] =
    useState<TeamMemberRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveMember = async (memberId: string, payload: FormData) => {
    const updated = await updateMember(memberId, payload);
    setNotification({
      type: "success",
      msg: `Member "${updated.name}" updated successfully.`,
    });
    setEditingMember(null);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);

    try {
      await deleteMember(memberToDelete.id);
      setNotification({
        type: "info",
        msg: `Member "${memberToDelete.name}" was removed from the team.`,
      });
      setMemberToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete team member.";
      setNotification({ type: "error", msg: message });
      setMemberToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Team
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage CAIMIF leadership, faculty professors, PhD scholars, and alumni profiles.
        </p>
      </div>

      {/* Data-Driven Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {TEAM_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const label =
            tab.id === "list" ? `${tab.label} (${pagination.total})` : tab.label;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
                isActive
                  ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Load Error Banner */}
      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 flex items-center justify-between gap-3"
        >
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => void refreshMembers()}
            className="rounded-lg border border-amber-300 dark:border-amber-800 px-2.5 py-1 text-[11px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div
          role={notification.type === "error" ? "alert" : "status"}
          className={`rounded-xl border p-3 text-xs font-medium flex items-center justify-between ${
            notification.type === "error"
              ? "border-red-200 bg-red-50/70 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
              : "border-blue-200 bg-blue-50/70 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200"
          }`}
        >
          <span>{notification.msg}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-bold ml-2 cursor-pointer opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Tab Content */}
      {activeTab === "list" ? (
        <MemberList
          members={members}
          pagination={pagination}
          search={search}
          categoryFilter={categoryFilter}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onCategoryChange={updateCategoryFilter}
          onPageChange={goToPage}
          onEdit={(member) => setEditingMember(member)}
          onDelete={(member) => setMemberToDelete(member)}
        />
      ) : (
        <AddMemberForm
          onSubmitMember={createMember}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Member "${created.name}" added successfully.`,
            });
          }}
        />
      )}

      {/* Edit Team Member Modal */}
      <EditMemberModal
        isOpen={editingMember !== null}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveMember}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={memberToDelete !== null}
        title="Delete Team Member"
        itemName={memberToDelete?.name ?? ""}
        description="This team member profile will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
