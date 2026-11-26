"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useJournals } from "@/hooks/useJournals";
import AddJournalPaperForm from "./AddJournalPaperForm";
import EditJournalPaperModal from "./EditJournalPaperModal";
import JournalPaperList from "./JournalPaperList";
import type { JournalPaper, UpdateJournalPaperPayload } from "./types";

export interface JournalPaperViewProps {
  userRole?: AdminRole;
}

/**
 * JournalPaperView Component (High-Level Orchestrator)
 *
 * Tabbed container managing CAIMIF Journal Paper publications:
 * - Tab 1: "Journal Paper List" (delegated to JournalPaperList with Edit and Delete actions)
 * - Tab 2: "Add Paper" (delegated to AddJournalPaperForm)
 */
export default function JournalPaperView({
  userRole = "SecurityAdmin",
}: JournalPaperViewProps = {}) {
  const {
    journals,
    pagination,
    search,
    isLoading,
    loadError,
    refreshJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    updateSearch,
    goToPage,
  } = useJournals(userRole);

  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingPaper, setEditingPaper] = useState<JournalPaper | null>(null);
  const [paperToDelete, setPaperToDelete] = useState<JournalPaper | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSavePaper = async (
    journalId: string,
    payload: UpdateJournalPaperPayload
  ) => {
    const updated = await updateJournal(journalId, payload);
    setNotification({
      type: "success",
      msg: `Journal paper "${updated.title}" updated successfully.`,
    });
    setEditingPaper(null);
  };

  const handleConfirmDelete = async () => {
    if (!paperToDelete) return;
    setIsDeleting(true);

    try {
      await deleteJournal(paperToDelete.id);
      setNotification({
        type: "info",
        msg: `Journal paper "${paperToDelete.title}" was deleted.`,
      });
      setPaperToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete journal paper.";
      setNotification({ type: "error", msg: message });
      setPaperToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Journal Papers
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage peer-reviewed journal publications authored by CAIMIF researchers.
        </p>
      </div>

      {/* Tabbed Section Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "list"
              ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Journal Paper List ({pagination.total})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "add"
              ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Add Paper
        </button>
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
            onClick={() => void refreshJournals()}
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

      {/* Dynamic Tab Content */}
      {activeTab === "list" && (
        <JournalPaperList
          journals={journals}
          pagination={pagination}
          search={search}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onPageChange={goToPage}
          onEdit={(paper) => setEditingPaper(paper)}
          onDelete={(paper) => setPaperToDelete(paper)}
        />
      )}

      {activeTab === "add" && (
        <AddJournalPaperForm
          onSubmitPaper={createJournal}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Journal paper "${created.title}" added successfully.`,
            });
          }}
        />
      )}

      {/* Edit Journal Paper Modal */}
      <EditJournalPaperModal
        isOpen={editingPaper !== null}
        paper={editingPaper}
        onClose={() => setEditingPaper(null)}
        onSave={handleSavePaper}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={paperToDelete !== null}
        title="Delete Journal Paper"
        itemName={paperToDelete?.title ?? ""}
        description="This journal paper record will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => setPaperToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
