"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  FeaturedResearchPagination,
  FeaturedResearchRecord,
} from "@/components/admin/dashboard/featuredResearch/types";
import {
  createFeaturedResearch,
  deleteFeaturedResearch,
  fetchFeaturedResearch,
  updateFeaturedResearch,
} from "@/lib/api/featuredResearch.api";

const DEFAULT_PAGINATION: FeaturedResearchPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated FeaturedResearch retrieval, search filtering,
 * creation, updates, and deletion against `/api/featured-research`.
 */
export function useFeaturedResearch(userRole: AdminRole = "SecurityAdmin") {
  const [items, setItems] = useState<FeaturedResearchRecord[]>([]);
  const [pagination, setPagination] =
    useState<FeaturedResearchPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of featured research records (used by Retry).
   */
  const refreshFeaturedResearch = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchFeaturedResearch({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load featured research from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch featured research records whenever page or search changes
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchFeaturedResearch({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setItems(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load featured research from the server.";
        setLoadError(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isCancelled = true;
    };
  }, [page, search]);

  const handleCreate = useCallback(
    async (formData: FormData): Promise<FeaturedResearchRecord> => {
      const created = await createFeaturedResearch(formData, userRole);
      setItems((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdate = useCallback(
    async (
      recordId: string,
      formData: FormData
    ): Promise<FeaturedResearchRecord> => {
      const updated = await updateFeaturedResearch(recordId, formData, userRole);
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDelete = useCallback(
    async (recordId: string): Promise<void> => {
      await deleteFeaturedResearch(recordId, userRole);
      setItems((prev) => prev.filter((item) => item.id !== recordId));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    },
    [userRole]
  );

  const updateSearch = useCallback((nextSearch: string) => {
    setIsLoading(true);
    setPage(1);
    setSearch(nextSearch);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setIsLoading(true);
    setPage(nextPage);
  }, []);

  return {
    items,
    pagination,
    search,
    isLoading,
    loadError,
    refreshFeaturedResearch,
    createFeaturedResearch: handleCreate,
    updateFeaturedResearch: handleUpdate,
    deleteFeaturedResearch: handleDelete,
    updateSearch,
    goToPage,
  };
}
