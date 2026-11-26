"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useConferences } from "@/hooks/useConferences";
import AddConferencePaperForm from "./AddConferencePaperForm";
import { CONFERENCE_PAPER_TABS } from "./conferencePaper.data";
import ConferencePaperList from "./ConferencePaperList";
import EditConferenceModal from "./EditConferenceModal";
import type {
  ConferencePaper,
  ConferencePaperTabId,
  UpdateConferencePaperPayload,
} from "./types";

export interface ConferencePaperViewProps {
  userRole?: AdminRole;
}

/**
 * ConferencePaperView Component
 *
 * Tabbed container for the Conference Paper dashboard section.
 * Renders the two data-driven tabs ("Conference Paper List" and "Add Paper")
 * imported from `conferencePaper.data.ts`, and coordinates listing, searching,
 * creating, editing, and deleting conference records.
 */
export default function ConferencePaperView({
  userRole = "SecurityAdmin",
}: ConferencePaperViewProps = {}) {
  const {
    conferences,
    pagination,
    search,
    isLoading,
    loadError,
    refreshConferences,
    createConference,
    updateConference,
    deleteConference,
    updateSearch,
    goToPage,
  } = useConferences(userRole);

  const [activeTab, setActiveTab] = useState<ConferencePaperTabId>("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingConference, setEditingConference] =
    useState<ConferencePaper | null>(null);
  const [conferenceToDelete, setConferenceToDelete] =
    useState<ConferencePaper | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveConference = async (
    conferenceId: string,
    payload: UpdateConferencePaperPayload
  ) => {
    const updated = await updateConference(conferenceId, payload);
    setNotification({
      type: "success",
      msg: `Conference paper "${updated.title}" updated successfully.`,
    });
    setEditingConference(null);
  };

  const handleConfirmDelete = async () => {
    if (!conferenceToDelete) return;
    setIsDeleting(true);

    try {
      await deleteConference(conferenceToDelete.id);
      setNotification({
        type: "info",
        msg: `Conference paper "${conferenceToDelete.title}" was deleted.`,
      });
      setConferenceToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete conference paper.";
      setNotification({ type: "error", msg: message });
      setConferenceToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Conference Papers
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage conference proceedings and paper publications authored by CAIMIF researchers.
        </p>
      </div>

      {/* Data-Driven Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {CONFERENCE_PAPER_TABS.map((tab) => {
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
            onClick={() => void refreshConferences()}
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
        <ConferencePaperList
          conferences={conferences}
          pagination={pagination}
          search={search}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onPageChange={goToPage}
          onEdit={(paper) => setEditingConference(paper)}
          onDelete={(paper) => setConferenceToDelete(paper)}
        />
      ) : (
        <AddConferencePaperForm
          onSubmitPaper={createConference}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Conference paper "${created.title}" added successfully.`,
            });
          }}
        />
      )}

      {/* Edit Conference Modal */}
      <EditConferenceModal
        isOpen={editingConference !== null}
        conference={editingConference}
        onClose={() => setEditingConference(null)}
        onSave={handleSaveConference}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={conferenceToDelete !== null}
        title="Delete Conference Paper"
        itemName={conferenceToDelete?.title ?? ""}
        description="This conference publication record will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => setConferenceToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
