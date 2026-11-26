"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  BookChapterPagination,
  BookChapterRecord,
  CreateBookChapterPayload,
  UpdateBookChapterPayload,
} from "@/components/admin/dashboard/bookChapter/types";
import {
  createBookChapter,
  deleteBookChapter,
  fetchBookChapters,
  updateBookChapter,
} from "@/lib/api/bookChapter.api";

const DEFAULT_PAGINATION: BookChapterPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Book Chapter retrieval, search filtering,
 * creation, updates, and deletion against `/api/book-chapters`.
 */
export function useBookChapters(userRole: AdminRole = "SecurityAdmin") {
  const [bookChapters, setBookChapters] = useState<BookChapterRecord[]>([]);
  const [pagination, setPagination] =
    useState<BookChapterPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of book chapters (used by Retry).
   */
  const refreshBookChapters = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchBookChapters({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setBookChapters(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load book chapters from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch book chapters whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchBookChapters({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setBookChapters(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load book chapters from the server.";
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

  const handleCreateBookChapter = useCallback(
    async (payload: CreateBookChapterPayload): Promise<BookChapterRecord> => {
      const created = await createBookChapter(payload, userRole);
      setBookChapters((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateBookChapter = useCallback(
    async (
      chapterId: string,
      payload: UpdateBookChapterPayload
    ): Promise<BookChapterRecord> => {
      const updated = await updateBookChapter(chapterId, payload, userRole);
      setBookChapters((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteBookChapter = useCallback(
    async (chapterId: string): Promise<void> => {
      await deleteBookChapter(chapterId, userRole);
      setBookChapters((prev) => prev.filter((item) => item.id !== chapterId));
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
    bookChapters,
    pagination,
    search,
    isLoading,
    loadError,
    refreshBookChapters,
    createBookChapter: handleCreateBookChapter,
    updateBookChapter: handleUpdateBookChapter,
    deleteBookChapter: handleDeleteBookChapter,
    updateSearch,
    goToPage,
  };
}
