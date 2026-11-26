"use client";

import React, { useState } from "react";
import { useResearchDomains } from "@/hooks/useResearchDomains";
import type { ResearchDomain, ResearchDomainViewProps } from "./types";
import ResearchDomainList from "./ResearchDomainList";
import RegisterNewDomainForm from "./RegisterNewDomainForm";
import ManageResearchDomains from "./ManageResearchDomains";
import EditDomainModal from "./EditDomainModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

/**
 * ResearchDomainView Component (High-Level Orchestrator)
 *
 * Tabbed container managing CAIMIF Research Domains backed by MySQL/Prisma APIs:
 * - Tab 1: "Domain List" (delegated to ResearchDomainList, with Edit and Delete actions)
 * - Tab 2: "Register New Domain" (delegated to RegisterNewDomainForm)
 * - Tab 3: "Manage Research Domains" (delegated to ManageResearchDomains)
 *   Strictly visible only to Security Admin (`userRole === "SecurityAdmin"`).
 */
export default function ResearchDomainView({
  userRole = "SecurityAdmin",
}: ResearchDomainViewProps = {}) {
  const {
    domains,
    fields,
    setFields,
    isLoading,
    loadError,
    refreshAll,
    createDomain,
    updateDomain,
    deleteDomain,
    createField,
    updateField,
    deleteField,
  } = useResearchDomains(userRole);

  const [activeTab, setActiveTab] = useState<"list" | "register" | "manage">("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingDomain, setEditingDomain] = useState<ResearchDomain | null>(null);
  const [domainToDelete, setDomainToDelete] = useState<ResearchDomain | null>(null);
  const [isDeletingDomain, setIsDeletingDomain] = useState(false);

  // Security check: Only Security Admin can access the Manage tab
  const isSecurityAdmin = userRole === "SecurityAdmin";

  const handleSaveDomain = async (domainId: string, payload: FormData) => {
    const updated = await updateDomain(domainId, payload);
    setNotification({
      type: "success",
      msg: `Domain "${updated.title}" updated successfully.`,
    });
    setEditingDomain(null);
  };

  const handleRequestDeleteDomain = (id: string) => {
    const target = domains.find((d) => d.id === id) ?? null;
    setDomainToDelete(target);
  };

  const handleConfirmDeleteDomain = async () => {
    if (!domainToDelete) return;
    setIsDeletingDomain(true);

    try {
      await deleteDomain(domainToDelete.id);
      setNotification({
        type: "info",
        msg: `Domain "${domainToDelete.title}" was deleted.`,
      });
      setDomainToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete domain.";
      setNotification({ type: "error", msg: message });
      setDomainToDelete(null);
    } finally {
      setIsDeletingDomain(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Research Domains
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage institutional research domain categories, descriptions, and visual assets.
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
          Domain List ({domains.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "register"
              ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Register New Domain
        </button>

        {/* Tab visible ONLY to Security Admin */}
        {isSecurityAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "manage"
                ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <span>Manage Research Domains</span>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950 text-[#172554] dark:text-blue-300 px-1.5 py-0.2 text-[9px] font-bold">
              Security Admin
            </span>
          </button>
        )}
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
            onClick={() => void refreshAll()}
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
        <ResearchDomainList
          domains={domains}
          fields={fields}
          isLoading={isLoading}
          loadError={loadError}
          onEdit={(domain) => setEditingDomain(domain)}
          onDelete={handleRequestDeleteDomain}
          onRegisterNew={() => setActiveTab("register")}
        />
      )}

      {activeTab === "register" && (
        <RegisterNewDomainForm
          fields={fields}
          onSubmitDomain={createDomain}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Domain "${created.title}" registered successfully.`,
            });
          }}
        />
      )}

      {activeTab === "manage" && isSecurityAdmin && (
        <ManageResearchDomains
          initialFields={fields}
          onFieldsChange={setFields}
          onCreateField={async (fieldData) => {
            await createField(fieldData);
          }}
          onUpdateField={async (editId, fieldData) => {
            await updateField(editId, fieldData);
          }}
          onDeleteField={deleteField}
        />
      )}

      {/* Decoupled Domain Edit Modal */}
      <EditDomainModal
        isOpen={editingDomain !== null}
        domain={editingDomain}
        fields={fields}
        onClose={() => setEditingDomain(null)}
        onSave={handleSaveDomain}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={domainToDelete !== null}
        title="Delete Research Domain"
        itemName={domainToDelete?.title ?? ""}
        description="This research domain record will be removed permanently."
        isLoading={isDeletingDomain}
        onCancel={() => setDomainToDelete(null)}
        onConfirm={handleConfirmDeleteDomain}
      />
    </div>
  );
}
