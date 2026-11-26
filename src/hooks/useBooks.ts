"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  BookPagination,
  BookRecord,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/components/admin/dashboard/book/types";
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
} from "@/lib/api/book.api";

const DEFAULT_PAGINATION: BookPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Book retrieval, search filtering,
 * creation, updates, and deletion against `/api/books`.
 */
export function useBooks(userRole: AdminRole = "SecurityAdmin") {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [pagination, setPagination] =
    useState<BookPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of books (used by Retry).
   */
  const refreshBooks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchBooks({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setBooks(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load books from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch books whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchBooks({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setBooks(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load books from the server.";
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

  const handleCreateBook = useCallback(
    async (payload: CreateBookPayload): Promise<BookRecord> => {
      const created = await createBook(payload, userRole);
      setBooks((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateBook = useCallback(
    async (bookId: string, payload: UpdateBookPayload): Promise<BookRecord> => {
      const updated = await updateBook(bookId, payload, userRole);
      setBooks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteBook = useCallback(
    async (bookId: string): Promise<void> => {
      await deleteBook(bookId, userRole);
      setBooks((prev) => prev.filter((item) => item.id !== bookId));
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
    books,
    pagination,
    search,
    isLoading,
    loadError,
    refreshBooks,
    createBook: handleCreateBook,
    updateBook: handleUpdateBook,
    deleteBook: handleDeleteBook,
    updateSearch,
    goToPage,
  };
}
