"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  TrainingPagination,
  TrainingRecord,
} from "@/components/admin/dashboard/training/types";
import {
  createTraining,
  deleteTraining,
  fetchTrainings,
  updateTraining,
} from "@/lib/api/training.api";

const DEFAULT_PAGINATION: TrainingPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Training retrieval, search filtering,
 * creation, updates, and deletion against `/api/trainings`.
 */
export function useTrainings(userRole: AdminRole = "SecurityAdmin") {
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [pagination, setPagination] =
    useState<TrainingPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of trainings (used by Retry).
   */
  const refreshTrainings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchTrainings({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setTrainings(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load trainings from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch trainings whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchTrainings({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setTrainings(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load trainings from the server.";
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

  const handleCreateTraining = useCallback(
    async (formData: FormData): Promise<TrainingRecord> => {
      const created = await createTraining(formData, userRole);
      setTrainings((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateTraining = useCallback(
    async (trainingId: number, formData: FormData): Promise<TrainingRecord> => {
      const updated = await updateTraining(trainingId, formData, userRole);
      setTrainings((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteTraining = useCallback(
    async (trainingId: number): Promise<void> => {
      await deleteTraining(trainingId, userRole);
      setTrainings((prev) => prev.filter((item) => item.id !== trainingId));
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
    trainings,
    pagination,
    search,
    isLoading,
    loadError,
    refreshTrainings,
    createTraining: handleCreateTraining,
    updateTraining: handleUpdateTraining,
    deleteTraining: handleDeleteTraining,
    updateSearch,
    goToPage,
  };
}
