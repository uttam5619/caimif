"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { usePatents } from "@/hooks/usePatents";
import AddPatentForm from "./AddPatentForm";
import EditPatentModal from "./EditPatentModal";
import { PATENT_TABS } from "./patent.data";
import PatentList from "./PatentList";
import type {
  PatentRecord,
  PatentTabId,
  UpdatePatentPayload,
} from "./types";

export interface PatentViewProps {
  userRole?: AdminRole;
}

/**
 * PatentView Component
 *
 * Tabbed container managing CAIMIF Patents:
 * - Tab 1: "List of Patents" (delegated to PatentList with Edit and Delete actions)
 * - Tab 2: "Add Patent" (delegated to AddPatentForm)
 */
export default function PatentView({
  userRole = "SecurityAdmin",
}: PatentViewProps = {}) {
  const {
    patents,
    pagination,
    search,
    isLoading,
    loadError,
    refreshPatents,
    createPatent,
    updatePatent,
    deletePatent,
    updateSearch,
    goToPage,
  } = usePatents(userRole);

  const [activeTab, setActiveTab] = useState<PatentTabId>("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingPatent, setEditingPatent] = useState<PatentRecord | null>(null);
  const [patentToDelete, setPatentToDelete] = useState<PatentRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSavePatent = async (
    patentId: string,
    payload: UpdatePatentPayload
  ) => {
    const updated = await updatePatent(patentId, payload);
    setNotification({
      type: "success",
      msg: `Patent "${updated.title}" updated successfully.`,
    });
    setEditingPatent(null);
  };

  const handleConfirmDelete = async () => {
    if (!patentToDelete) return;
    setIsDeleting(true);

    try {
      await deletePatent(patentToDelete.id);
      setNotification({
        type: "info",
        msg: `Patent "${patentToDelete.title}" was deleted.`,
      });
      setPatentToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete patent.";
      setNotification({ type: "error", msg: message });
      setPatentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Patents
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage patent filings and grants authored by CAIMIF researchers.
        </p>
      </div>

      {/* Data-Driven Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {PATENT_TABS.map((tab) => {
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
            onClick={() => void refreshPatents()}
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
        <PatentList
          patents={patents}
          pagination={pagination}
          search={search}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onPageChange={goToPage}
          onEdit={(patent) => setEditingPatent(patent)}
          onDelete={(patent) => setPatentToDelete(patent)}
        />
      ) : (
        <AddPatentForm
          onSubmitPatent={createPatent}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Patent "${created.title}" added successfully.`,
            });
          }}
        />
      )}

      {/* Edit Patent Modal */}
      <EditPatentModal
        isOpen={editingPatent !== null}
        patent={editingPatent}
        onClose={() => setEditingPatent(null)}
        onSave={handleSavePatent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={patentToDelete !== null}
        title="Delete Patent"
        itemName={patentToDelete?.title ?? ""}
        description="This patent record will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => setPatentToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
