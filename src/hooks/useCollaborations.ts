"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  CollaborationPagination,
  CollaborationPayload,
  CollaborationRecord,
} from "@/components/admin/dashboard/collaboration/types";
import {
  createCollaboration,
  deleteCollaboration,
  fetchCollaborations,
  updateCollaboration,
} from "@/lib/api/collaboration.api";

const DEFAULT_PAGINATION: CollaborationPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Collaboration retrieval, search filtering,
 * creation, updates, and deletion against `/api/collaborations`.
 */
export function useCollaborations(userRole: AdminRole = "SecurityAdmin") {
  const [items, setItems] = useState<CollaborationRecord[]>([]);
  const [pagination, setPagination] =
    useState<CollaborationPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshCollaborations = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchCollaborations({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load collaborations from the server."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchCollaborations({
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
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load collaborations from the server."
        );
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
    async (payload: CollaborationPayload): Promise<CollaborationRecord> => {
      const created = await createCollaboration(payload, userRole);
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
      payload: Partial<CollaborationPayload>
    ): Promise<CollaborationRecord> => {
      const updated = await updateCollaboration(recordId, payload, userRole);
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDelete = useCallback(
    async (recordId: string): Promise<void> => {
      await deleteCollaboration(recordId, userRole);
      setItems((prev) => prev.filter((item) => item.id !== recordId));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    },
    [userRole]
  );

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return {
    items,
    pagination,
    search,
    isLoading,
    loadError,
    refreshCollaborations,
    createCollaboration: handleCreate,
    updateCollaboration: handleUpdate,
    deleteCollaboration: handleDelete,
    updateSearch,
    goToPage: setPage,
  };
}
