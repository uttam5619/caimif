"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useContactInquiries } from "@/hooks/useContactInquiries";
import { CONTACT_TABS } from "./contact.data";
import MessageList from "./MessageList";
import type { ContactInquiryRecord, ContactTabId } from "./types";

export interface ContactViewProps {
  userRole?: AdminRole;
}

/**
 * ContactView Component
 *
 * Admin dashboard section for reviewing inquiries stored in `contact_inquiries`,
 * exposing a single "List of message" tab.
 */
export default function ContactView({
  userRole = "SecurityAdmin",
}: ContactViewProps = {}) {
  const {
    items,
    pagination,
    search,
    isLoading,
    loadError,
    refreshInquiries,
    deleteInquiry,
    updateSearch,
    goToPage,
  } = useContactInquiries(userRole);

  const [activeTab, setActiveTab] = useState<ContactTabId>("list");
  const [notification, setNotification] = useState<{
    type: "info" | "error";
    msg: string;
  } | null>(null);
  const [inquiryToDelete, setInquiryToDelete] =
    useState<ContactInquiryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);

    try {
      await deleteInquiry(inquiryToDelete.id);
      setNotification({
        type: "info",
        msg: `Message from "${inquiryToDelete.name}" was deleted.`,
      });
      setInquiryToDelete(null);
    } catch (error: unknown) {
      setNotification({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Failed to delete contact message.",
      });
      setInquiryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Contact
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage incoming inquiries submitted to CAIMIF (`contact_inquiries`).
        </p>
      </div>

      {/* Single-Tab Header */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {CONTACT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
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
              {tab.label} ({pagination.total})
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
            notification.type === "error"
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

      {/* Backend Load Error Banner */}
      {loadError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={refreshInquiries}
            className="rounded-lg border border-rose-300 dark:border-rose-800 px-2.5 py-1 text-[11px] font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tab Panel */}
      <MessageList
        items={items}
        pagination={pagination}
        search={search}
        isLoading={isLoading}
        loadError={loadError}
        onSearchChange={updateSearch}
        onPageChange={goToPage}
        onRefresh={refreshInquiries}
        onDelete={(inquiry) => setInquiryToDelete(inquiry)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={inquiryToDelete !== null}
        title="Delete Contact Message"
        itemName={inquiryToDelete?.subject ?? ""}
        description="This contact inquiry record will be deleted permanently."
        isLoading={isDeleting}
        onCancel={() => {
          if (!isDeleting) setInquiryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
