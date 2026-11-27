"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useCollaborations } from "@/hooks/useCollaborations";
import AddCollaborationForm from "./AddCollaborationForm";
import CollaborationList from "./CollaborationList";
import { COLLABORATION_TABS } from "./collaboration.data";
import EditCollaborationModal from "./EditCollaborationModal";
import type {
  CollaborationPayload,
  CollaborationRecord,
  CollaborationTabId,
} from "./types";

export interface CollaborationViewProps {
  userRole?: AdminRole;
}

/**
 * CollaborationView Component
 *
 * Two-tab admin dashboard container for managing CAIMIF collaborations:
 * - List of Collaborations
 * - Add Collaboration
 */
export default function CollaborationView({
  userRole = "SecurityAdmin",
}: CollaborationViewProps = {}) {
  const {
    items,
    pagination,
    search,
    isLoading,
    loadError,
    refreshCollaborations,
    createCollaboration,
    updateCollaboration,
    deleteCollaboration,
    updateSearch,
    goToPage,
  } = useCollaborations(userRole);

  const [activeTab, setActiveTab] = useState<CollaborationTabId>("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingRecord, setEditingRecord] =
    useState<CollaborationRecord | null>(null);
  const [recordToDelete, setRecordToDelete] =
    useState<CollaborationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveRecord = async (
    recordId: string,
    payload: Partial<CollaborationPayload>
  ) => {
    const updated = await updateCollaboration(recordId, payload);
    setNotification({
      type: "success",
      msg: `Collaboration "${updated.firstParty} ↔ ${updated.secondParty}" updated successfully.`,
    });
    setEditingRecord(null);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);

    try {
      await deleteCollaboration(recordToDelete.id);
      setNotification({
        type: "info",
        msg: `Collaboration "${recordToDelete.firstParty} ↔ ${recordToDelete.secondParty}" was deleted.`,
      });
      setRecordToDelete(null);
    } catch (error: unknown) {
      setNotification({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Failed to delete collaboration.",
      });
      setRecordToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Collaborations
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage institutional MoUs, academic partnerships, and industry collaborations.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {COLLABORATION_TABS.map((tab) => {
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

      {/* Transient Feedback Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : notification.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                : "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          <span>{notification.msg}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Backend Connectivity Error */}
      {loadError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={refreshCollaborations}
            className="rounded-lg border border-rose-300 dark:border-rose-800 px-2.5 py-1 text-[11px] font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Active Tab Content */}
      {activeTab === "list" ? (
        <CollaborationList
          items={items}
          pagination={pagination}
          search={search}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onPageChange={goToPage}
          onEdit={(record) => setEditingRecord(record)}
          onDelete={(record) => setRecordToDelete(record)}
        />
      ) : (
        <AddCollaborationForm
          onSubmitCollaboration={createCollaboration}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Collaboration "${created.firstParty} ↔ ${created.secondParty}" added successfully.`,
            });
            setActiveTab("list");
          }}
        />
      )}

      {/* Edit Modal */}
      <EditCollaborationModal
        isOpen={editingRecord !== null}
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleSaveRecord}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={recordToDelete !== null}
        title="Delete Collaboration"
        itemName={
          recordToDelete
            ? `${recordToDelete.firstParty} ↔ ${recordToDelete.secondParty}`
            : ""
        }
        description="This collaboration record will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => {
          if (!isDeleting) setRecordToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
