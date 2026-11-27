"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  ToolCategoryRecord,
  ToolPagination,
  ToolRecord,
} from "@/components/admin/dashboard/tool/types";
import {
  createTool,
  createToolCategory,
  deleteTool,
  deleteToolCategory,
  fetchToolCategories,
  fetchTools,
  updateTool,
  updateToolCategory,
} from "@/lib/api/tool.api";

const DEFAULT_PAGINATION: ToolPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated `Tool` and `ToolType` records along with
 * synchronized CRUD actions against `/api/tools` and `/api/tool-types`.
 */
export function useTool(userRole: AdminRole = "SecurityAdmin") {
  const [categories, setCategories] = useState<ToolCategoryRecord[]>([]);
  const [allCategories, setAllCategories] = useState<ToolCategoryRecord[]>([]);
  const [categoryPagination, setCategoryPagination] =
    useState<ToolPagination>(DEFAULT_PAGINATION);
  const [categoryPage, setCategoryPage] = useState<number>(1);
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(
    null
  );

  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [toolPagination, setToolPagination] =
    useState<ToolPagination>(DEFAULT_PAGINATION);
  const [toolPage, setToolPage] = useState<number>(1);
  const [toolSearch, setToolSearch] = useState<string>("");
  const [toolCategoryFilter, setToolCategoryFilter] = useState<string>("");
  const [isLoadingTools, setIsLoadingTools] = useState<boolean>(true);
  const [toolLoadError, setToolLoadError] = useState<string | null>(null);

  const refreshAllCategoryOptions = useCallback(async () => {
    try {
      const result = await fetchToolCategories({ page: 1, limit: 100 });
      setAllCategories(result.items);
    } catch {
      // Non-blocking fallback for dropdown selectors
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setCategoryLoadError(null);
    try {
      const result = await fetchToolCategories({
        page: categoryPage,
        limit: DEFAULT_PAGINATION.limit,
        search: categorySearch.trim() || undefined,
      });
      setCategories(result.items);
      setCategoryPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load tool categories from the server.";
      setCategoryLoadError(message);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [categoryPage, categorySearch]);

  const refreshTools = useCallback(async () => {
    setIsLoadingTools(true);
    setToolLoadError(null);
    try {
      const result = await fetchTools({
        toolTypeId: toolCategoryFilter || undefined,
        search: toolSearch.trim() || undefined,
        page: toolPage,
        limit: DEFAULT_PAGINATION.limit,
      });
      setTools(result.items);
      setToolPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load tools from the server.";
      setToolLoadError(message);
    } finally {
      setIsLoadingTools(false);
    }
  }, [toolCategoryFilter, toolPage, toolSearch]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAllCategoryOptions() {
      try {
        const result = await fetchToolCategories({ page: 1, limit: 100 });
        if (!isCancelled) {
          setAllCategories(result.items);
        }
      } catch {
        // Non-blocking fallback for dropdown selectors
      }
    }

    void loadAllCategoryOptions();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadCategories() {
      try {
        const result = await fetchToolCategories({
          page: categoryPage,
          limit: DEFAULT_PAGINATION.limit,
          search: categorySearch.trim() || undefined,
        });
        if (isCancelled) return;

        setCategories(result.items);
        setCategoryPagination(result.pagination);
        setCategoryLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setCategoryLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load tool categories from the server."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingCategories(false);
        }
      }
    }

    void loadCategories();
    return () => {
      isCancelled = true;
    };
  }, [categoryPage, categorySearch]);

  useEffect(() => {
    let isCancelled = false;

    async function loadTools() {
      try {
        const result = await fetchTools({
          toolTypeId: toolCategoryFilter || undefined,
          search: toolSearch.trim() || undefined,
          page: toolPage,
          limit: DEFAULT_PAGINATION.limit,
        });
        if (isCancelled) return;

        setTools(result.items);
        setToolPagination(result.pagination);
        setToolLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setToolLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load tools from the server."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingTools(false);
        }
      }
    }

    void loadTools();
    return () => {
      isCancelled = true;
    };
  }, [toolCategoryFilter, toolPage, toolSearch]);

  const handleCreateCategory = useCallback(
    async (payload: { name: string }): Promise<ToolCategoryRecord> => {
      const created = await createToolCategory(payload, userRole);
      setCategories((prev) => [created, ...prev]);
      setAllCategories((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setCategoryPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      return created;
    },
    [userRole]
  );

  const handleUpdateCategory = useCallback(
    async (
      categoryId: string,
      payload: { name?: string }
    ): Promise<ToolCategoryRecord> => {
      const updated = await updateToolCategory(categoryId, payload, userRole);
      setCategories((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setAllCategories((prev) =>
        prev
          .map((item) => (item.id === updated.id ? updated : item))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      // Reflect updated category name in any currently loaded tools
      void refreshTools();
      return updated;
    },
    [refreshTools, userRole]
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string): Promise<void> => {
      await deleteToolCategory(categoryId, userRole);
      setCategories((prev) => prev.filter((item) => item.id !== categoryId));
      setAllCategories((prev) => prev.filter((item) => item.id !== categoryId));
      setCategoryPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      if (toolCategoryFilter === categoryId) {
        setToolCategoryFilter("");
      }
    },
    [toolCategoryFilter, userRole]
  );

  const handleCreateTool = useCallback(
    async (formData: FormData): Promise<ToolRecord> => {
      const created = await createTool(formData, userRole);
      setTools((prev) => [created, ...prev]);
      setToolPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      void refreshCategories();
      void refreshAllCategoryOptions();
      return created;
    },
    [refreshAllCategoryOptions, refreshCategories, userRole]
  );

  const handleUpdateTool = useCallback(
    async (toolId: string, formData: FormData): Promise<ToolRecord> => {
      const updated = await updateTool(toolId, formData, userRole);
      setTools((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      void refreshCategories();
      void refreshAllCategoryOptions();
      return updated;
    },
    [refreshAllCategoryOptions, refreshCategories, userRole]
  );

  const handleDeleteTool = useCallback(
    async (toolId: string): Promise<void> => {
      await deleteTool(toolId, userRole);
      setTools((prev) => prev.filter((item) => item.id !== toolId));
      setToolPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      void refreshCategories();
      void refreshAllCategoryOptions();
    },
    [refreshAllCategoryOptions, refreshCategories, userRole]
  );

  const updateCategorySearch = useCallback((value: string) => {
    setCategorySearch(value);
    setCategoryPage(1);
  }, []);

  const updateToolSearch = useCallback((value: string) => {
    setToolSearch(value);
    setToolPage(1);
  }, []);

  const updateToolCategoryFilter = useCallback((toolTypeId: string) => {
    setToolCategoryFilter(toolTypeId);
    setToolPage(1);
  }, []);

  return {
    categories,
    allCategories,
    categoryPagination,
    categorySearch,
    isLoadingCategories,
    categoryLoadError,
    refreshCategories,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    updateCategorySearch,
    goToCategoryPage: setCategoryPage,

    tools,
    toolPagination,
    toolSearch,
    toolCategoryFilter,
    isLoadingTools,
    toolLoadError,
    refreshTools,
    createTool: handleCreateTool,
    updateTool: handleUpdateTool,
    deleteTool: handleDeleteTool,
    updateToolSearch,
    updateToolCategoryFilter,
    goToToolPage: setToolPage,
  };
}
