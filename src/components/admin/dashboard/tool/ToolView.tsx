"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useTool } from "@/hooks/useTool";
import AddToolCategoryForm from "./AddToolCategoryForm";
import AddToolForm from "./AddToolForm";
import EditToolCategoryModal from "./EditToolCategoryModal";
import EditToolModal from "./EditToolModal";
import ToolCategoryList from "./ToolCategoryList";
import ToolList from "./ToolList";
import { TOOL_TABS } from "./tool.data";
import type { ToolCategoryRecord, ToolRecord, ToolTabId } from "./types";

export interface ToolViewProps {
  userRole?: AdminRole;
}

/**
 * ToolView Component
 *
 * Four-tab management dashboard section for CAIMIF software tools & categories:
 * - List of Tools
 * - List of Tool Category
 * - Add Tool Category
 * - Add Tool
 */
export default function ToolView({
  userRole = "SecurityAdmin",
}: ToolViewProps = {}) {
  const {
    categories,
    allCategories,
    categoryPagination,
    categorySearch,
    isLoadingCategories,
    categoryLoadError,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategorySearch,
    goToCategoryPage,

    tools,
    toolPagination,
    toolSearch,
    toolCategoryFilter,
    isLoadingTools,
    toolLoadError,
    refreshTools,
    createTool,
    updateTool,
    deleteTool,
    updateToolSearch,
    updateToolCategoryFilter,
    goToToolPage,
  } = useTool(userRole);

  const [activeTab, setActiveTab] = useState<ToolTabId>("tools");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);

  const [editingCategory, setEditingCategory] =
    useState<ToolCategoryRecord | null>(null);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ToolCategoryRecord | null>(null);

  const [editingTool, setEditingTool] = useState<ToolRecord | null>(null);
  const [toolToDelete, setToolToDelete] = useState<ToolRecord | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveCategory = async (
    categoryId: string,
    payload: { name?: string }
  ) => {
    const updated = await updateCategory(categoryId, payload);
    setNotification({
      type: "success",
      msg: `Tool category "${updated.name}" updated successfully.`,
    });
    setEditingCategory(null);
  };

  const handleSaveTool = async (toolId: string, payload: FormData) => {
    const updated = await updateTool(toolId, payload);
    setNotification({
      type: "success",
      msg: `Tool "${updated.title}" updated successfully.`,
    });
    setEditingTool(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setNotification({
        type: "info",
        msg: `Tool category "${categoryToDelete.name}" deleted successfully.`,
      });
      setCategoryToDelete(null);
    } catch (error: unknown) {
      setNotification({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Failed to delete tool category.",
      });
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteTool = async () => {
    if (!toolToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTool(toolToDelete.id);
      setNotification({
        type: "info",
        msg: `Tool "${toolToDelete.title}" deleted successfully.`,
      });
      setToolToDelete(null);
    } catch (error: unknown) {
      setNotification({
        type: "error",
        msg: error instanceof Error ? error.message : "Failed to delete tool.",
      });
      setToolToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeError =
    activeTab === "tools"
      ? toolLoadError
      : activeTab === "categories"
        ? categoryLoadError
        : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tool
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage software tools, versions, categories, and tool icons across CAIMIF infrastructure.
        </p>
      </div>

      {/* 4-Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {TOOL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          let label = tab.label;
          if (tab.id === "tools") {
            label = `${tab.label} (${toolPagination.total})`;
          } else if (tab.id === "categories") {
            label = `${tab.label} (${categoryPagination.total})`;
          }

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

      {/* Backend Connectivity Error Banner */}
      {activeError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <span>{activeError}</span>
          <button
            type="button"
            onClick={activeTab === "tools" ? refreshTools : refreshCategories}
            className="rounded-lg border border-rose-300 dark:border-rose-800 px-2.5 py-1 text-[11px] font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Active Tab Content */}
      <div>
        {activeTab === "tools" ? (
          <ToolList
            tools={tools}
            categories={allCategories}
            pagination={toolPagination}
            search={toolSearch}
            categoryFilter={toolCategoryFilter}
            isLoading={isLoadingTools}
            loadError={toolLoadError}
            onSearchChange={updateToolSearch}
            onCategoryFilterChange={updateToolCategoryFilter}
            onPageChange={goToToolPage}
            onEdit={(tool) => setEditingTool(tool)}
            onDelete={(tool) => setToolToDelete(tool)}
          />
        ) : activeTab === "categories" ? (
          <ToolCategoryList
            categories={categories}
            pagination={categoryPagination}
            search={categorySearch}
            isLoading={isLoadingCategories}
            loadError={categoryLoadError}
            onSearchChange={updateCategorySearch}
            onPageChange={goToCategoryPage}
            onEdit={(category) => setEditingCategory(category)}
            onDelete={(category) => setCategoryToDelete(category)}
          />
        ) : activeTab === "add-category" ? (
          <AddToolCategoryForm
            onSubmitCategory={createCategory}
            onSuccess={(created) => {
              setNotification({
                type: "success",
                msg: `Tool category "${created.name}" added successfully.`,
              });
              setActiveTab("categories");
            }}
          />
        ) : (
          <AddToolForm
            categories={allCategories}
            onSubmitTool={createTool}
            onRequestAddCategory={() => setActiveTab("add-category")}
            onSuccess={(created) => {
              setNotification({
                type: "success",
                msg: `Tool "${created.title}" added successfully.`,
              });
              setActiveTab("tools");
            }}
          />
        )}
      </div>

      {/* Modals */}
      <EditToolCategoryModal
        isOpen={editingCategory !== null}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveCategory}
      />

      <EditToolModal
        isOpen={editingTool !== null}
        tool={editingTool}
        categories={allCategories}
        onClose={() => setEditingTool(null)}
        onSave={handleSaveTool}
      />

      <DeleteConfirmModal
        isOpen={categoryToDelete !== null}
        title="Delete Tool Category"
        itemName={categoryToDelete?.name ?? ""}
        description="Categories that still have assigned tools cannot be deleted until those tools are reassigned or removed."
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => {
          if (!isDeleting) setCategoryToDelete(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={toolToDelete !== null}
        title="Delete Tool"
        itemName={toolToDelete?.title ?? ""}
        description="This tool record and its uploaded image asset will be permanently removed."
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteTool}
        onCancel={() => {
          if (!isDeleting) setToolToDelete(null);
        }}
      />
    </div>
  );
}
