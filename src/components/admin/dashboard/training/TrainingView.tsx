"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useTrainings } from "@/hooks/useTrainings";
import AddTrainingForm from "./AddTrainingForm";
import EditTrainingModal from "./EditTrainingModal";
import { TRAINING_TABS } from "./training.data";
import TrainingList from "./TrainingList";
import type { TrainingRecord, TrainingTabId } from "./types";

export interface TrainingViewProps {
  userRole?: AdminRole;
}

/**
 * TrainingView Component
 *
 * Tabbed container managing CAIMIF Training programs:
 * - Tab 1: "List of Trainings" (delegated to TrainingList with Edit and Delete actions)
 * - Tab 2: "Add Training" (delegated to AddTrainingForm)
 */
export default function TrainingView({
  userRole = "SecurityAdmin",
}: TrainingViewProps = {}) {
  const {
    trainings,
    pagination,
    search,
    isLoading,
    loadError,
    refreshTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    updateSearch,
    goToPage,
  } = useTrainings(userRole);

  const [activeTab, setActiveTab] = useState<TrainingTabId>("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingTraining, setEditingTraining] =
    useState<TrainingRecord | null>(null);
  const [trainingToDelete, setTrainingToDelete] =
    useState<TrainingRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveTraining = async (trainingId: number, payload: FormData) => {
    const updated = await updateTraining(trainingId, payload);
    setNotification({
      type: "success",
      msg: `Training "${updated.title}" updated successfully.`,
    });
    setEditingTraining(null);
  };

  const handleConfirmDelete = async () => {
    if (!trainingToDelete) return;
    setIsDeleting(true);

    try {
      await deleteTraining(trainingToDelete.id);
      setNotification({
        type: "info",
        msg: `Training "${trainingToDelete.title}" was deleted.`,
      });
      setTrainingToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete training.";
      setNotification({ type: "error", msg: message });
      setTrainingToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Trainings
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage institutional training programs, workshops, and registration status.
        </p>
      </div>

      {/* Data-Driven Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {TRAINING_TABS.map((tab) => {
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
            onClick={() => void refreshTrainings()}
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
        <TrainingList
          trainings={trainings}
          pagination={pagination}
          search={search}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onPageChange={goToPage}
          onEdit={(training) => setEditingTraining(training)}
          onDelete={(training) => setTrainingToDelete(training)}
        />
      ) : (
        <AddTrainingForm
          onSubmitTraining={createTraining}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Training "${created.title}" added successfully.`,
            });
          }}
        />
      )}

      {/* Edit Training Modal */}
      <EditTrainingModal
        isOpen={editingTraining !== null}
        training={editingTraining}
        onClose={() => setEditingTraining(null)}
        onSave={handleSaveTraining}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={trainingToDelete !== null}
        title="Delete Training"
        itemName={trainingToDelete?.title ?? ""}
        description="This training record will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => setTrainingToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
