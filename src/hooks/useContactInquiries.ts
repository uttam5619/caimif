"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  ContactInquiryRecord,
  ContactPagination,
} from "@/components/admin/dashboard/contact/types";
import {
  deleteContactInquiry,
  fetchContactInquiries,
} from "@/lib/api/contact.api";

const DEFAULT_PAGINATION: ContactPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated `ContactInquiry` retrieval, search filtering,
 * and deletion against `/api/contact-inquiries`.
 */
export function useContactInquiries(userRole: AdminRole = "SecurityAdmin") {
  const [items, setItems] = useState<ContactInquiryRecord[]>([]);
  const [pagination, setPagination] =
    useState<ContactPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshInquiries = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchContactInquiries(
        {
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        },
        userRole
      );
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load contact messages from the server."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, userRole]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchContactInquiries(
          {
            page,
            limit: DEFAULT_PAGINATION.limit,
            search: search.trim() || undefined,
          },
          userRole
        );
        if (isCancelled) return;

        setItems(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load contact messages from the server."
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
  }, [page, search, userRole]);

  const handleDelete = useCallback(
    async (inquiryId: string): Promise<void> => {
      await deleteContactInquiry(inquiryId, userRole);
      setItems((prev) => prev.filter((item) => item.id !== inquiryId));
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
    refreshInquiries,
    deleteInquiry: handleDelete,
    updateSearch,
    goToPage: setPage,
  };
}
