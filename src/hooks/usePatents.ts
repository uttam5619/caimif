"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  CreatePatentPayload,
  PatentPagination,
  PatentRecord,
  UpdatePatentPayload,
} from "@/components/admin/dashboard/patent/types";
import {
  createPatent,
  deletePatent,
  fetchPatents,
  updatePatent,
} from "@/lib/api/patent.api";

const DEFAULT_PAGINATION: PatentPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Patent retrieval, search filtering,
 * creation, updates, and deletion against `/api/patents`.
 */
export function usePatents(userRole: AdminRole = "SecurityAdmin") {
  const [patents, setPatents] = useState<PatentRecord[]>([]);
  const [pagination, setPagination] =
    useState<PatentPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of patents (used by Retry).
   */
  const refreshPatents = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchPatents({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setPatents(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load patents from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch patents whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchPatents({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setPatents(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load patents from the server.";
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

  const handleCreatePatent = useCallback(
    async (payload: CreatePatentPayload): Promise<PatentRecord> => {
      const created = await createPatent(payload, userRole);
      setPatents((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdatePatent = useCallback(
    async (
      patentId: string,
      payload: UpdatePatentPayload
    ): Promise<PatentRecord> => {
      const updated = await updatePatent(patentId, payload, userRole);
      setPatents((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeletePatent = useCallback(
    async (patentId: string): Promise<void> => {
      await deletePatent(patentId, userRole);
      setPatents((prev) => prev.filter((item) => item.id !== patentId));
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
    patents,
    pagination,
    search,
    isLoading,
    loadError,
    refreshPatents,
    createPatent: handleCreatePatent,
    updatePatent: handleUpdatePatent,
    deletePatent: handleDeletePatent,
    updateSearch,
    goToPage,
  };
}
