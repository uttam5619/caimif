"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  CreateJournalPaperPayload,
  JournalPaper,
  JournalPaperPagination,
  UpdateJournalPaperPayload,
} from "@/components/admin/dashboard/journalPaper/types";
import {
  createJournal,
  deleteJournal,
  fetchJournals,
  updateJournal,
} from "@/lib/api/journal.api";

const DEFAULT_PAGINATION: JournalPaperPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Journal Paper retrieval, filtering, and creation.
 */
export function useJournals(userRole: AdminRole = "SecurityAdmin") {
  const [journals, setJournals] = useState<JournalPaper[]>([]);
  const [pagination, setPagination] =
    useState<JournalPaperPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of journal papers (used by Retry).
   */
  const refreshJournals = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchJournals({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setJournals(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load journal papers from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch journal papers whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchJournals({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setJournals(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load journal papers from the server.";
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

  const handleCreateJournal = useCallback(
    async (payload: CreateJournalPaperPayload): Promise<JournalPaper> => {
      const created = await createJournal(payload, userRole);
      setJournals((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateJournal = useCallback(
    async (
      journalId: string,
      payload: UpdateJournalPaperPayload
    ): Promise<JournalPaper> => {
      const updated = await updateJournal(journalId, payload, userRole);
      setJournals((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteJournal = useCallback(
    async (journalId: string): Promise<void> => {
      await deleteJournal(journalId, userRole);
      setJournals((prev) => prev.filter((item) => item.id !== journalId));
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
    journals,
    pagination,
    search,
    isLoading,
    loadError,
    refreshJournals,
    createJournal: handleCreateJournal,
    updateJournal: handleUpdateJournal,
    deleteJournal: handleDeleteJournal,
    updateSearch,
    goToPage,
  };
}
