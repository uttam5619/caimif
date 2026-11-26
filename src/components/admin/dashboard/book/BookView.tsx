"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useBooks } from "@/hooks/useBooks";
import AddBookForm from "./AddBookForm";
import { BOOK_TABS } from "./book.data";
import BookList from "./BookList";
import EditBookModal from "./EditBookModal";
import type {
  BookRecord,
  BookTabId,
  UpdateBookPayload,
} from "./types";

export interface BookViewProps {
  userRole?: AdminRole;
}

/**
 * BookView Component
 *
 * Tabbed container managing CAIMIF Books:
 * - Tab 1: "List of Books" (delegated to BookList with Edit and Delete actions)
 * - Tab 2: "Add Book" (delegated to AddBookForm)
 */
export default function BookView({
  userRole = "SecurityAdmin",
}: BookViewProps = {}) {
  const {
    books,
    pagination,
    search,
    isLoading,
    loadError,
    refreshBooks,
    createBook,
    updateBook,
    deleteBook,
    updateSearch,
    goToPage,
  } = useBooks(userRole);

  const [activeTab, setActiveTab] = useState<BookTabId>("list");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);
  const [editingBook, setEditingBook] = useState<BookRecord | null>(null);
  const [bookToDelete, setBookToDelete] = useState<BookRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveBook = async (
    bookId: string,
    payload: UpdateBookPayload
  ) => {
    const updated = await updateBook(bookId, payload);
    setNotification({
      type: "success",
      msg: `Book "${updated.title}" updated successfully.`,
    });
    setEditingBook(null);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);

    try {
      await deleteBook(bookToDelete.id);
      setNotification({
        type: "info",
        msg: `Book "${bookToDelete.title}" was deleted.`,
      });
      setBookToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete book.";
      setNotification({ type: "error", msg: message });
      setBookToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Books
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage academic books authored or edited by CAIMIF researchers.
        </p>
      </div>

      {/* Data-Driven Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {BOOK_TABS.map((tab) => {
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
            onClick={() => void refreshBooks()}
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
        <BookList
          books={books}
          pagination={pagination}
          search={search}
          isLoading={isLoading}
          loadError={loadError}
          onSearchChange={updateSearch}
          onPageChange={goToPage}
          onEdit={(book) => setEditingBook(book)}
          onDelete={(book) => setBookToDelete(book)}
        />
      ) : (
        <AddBookForm
          onSubmitBook={createBook}
          onSuccess={(created) => {
            setNotification({
              type: "success",
              msg: `Book "${created.title}" added successfully.`,
            });
          }}
        />
      )}

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={editingBook !== null}
        book={editingBook}
        onClose={() => setEditingBook(null)}
        onSave={handleSaveBook}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={bookToDelete !== null}
        title="Delete Book"
        itemName={bookToDelete?.title ?? ""}
        description="This book record will be removed permanently."
        isLoading={isDeleting}
        onCancel={() => setBookToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
