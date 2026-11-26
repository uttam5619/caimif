"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  ConferencePaper,
  ConferencePaperPagination,
  CreateConferencePaperPayload,
  UpdateConferencePaperPayload,
} from "@/components/admin/dashboard/conferencePaper/types";
import {
  createConference,
  deleteConference,
  fetchConferences,
  updateConference,
} from "@/lib/api/conference.api";

const DEFAULT_PAGINATION: ConferencePaperPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Conference Paper retrieval, search filtering,
 * creation, updates, and deletion against `/api/conferences`.
 */
export function useConferences(userRole: AdminRole = "SecurityAdmin") {
  const [conferences, setConferences] = useState<ConferencePaper[]>([]);
  const [pagination, setPagination] =
    useState<ConferencePaperPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of conference papers (used by Retry).
   */
  const refreshConferences = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchConferences({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setConferences(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load conference papers from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch conference papers whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchConferences({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setConferences(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load conference papers from the server.";
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

  const handleCreateConference = useCallback(
    async (payload: CreateConferencePaperPayload): Promise<ConferencePaper> => {
      const created = await createConference(payload, userRole);
      setConferences((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateConference = useCallback(
    async (
      conferenceId: string,
      payload: UpdateConferencePaperPayload
    ): Promise<ConferencePaper> => {
      const updated = await updateConference(conferenceId, payload, userRole);
      setConferences((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteConference = useCallback(
    async (conferenceId: string): Promise<void> => {
      await deleteConference(conferenceId, userRole);
      setConferences((prev) => prev.filter((item) => item.id !== conferenceId));
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
    conferences,
    pagination,
    search,
    isLoading,
    loadError,
    refreshConferences,
    createConference: handleCreateConference,
    updateConference: handleUpdateConference,
    deleteConference: handleDeleteConference,
    updateSearch,
    goToPage,
  };
}
