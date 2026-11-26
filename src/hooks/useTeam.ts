"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  TeamCategory,
  TeamMemberRecord,
  TeamPagination,
} from "@/components/admin/dashboard/team/types";
import {
  createTeamMember,
  deleteTeamMember,
  fetchTeamMembers,
  updateTeamMember,
} from "@/lib/api/team.api";

const DEFAULT_PAGINATION: TeamPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Team member retrieval, category/search filtering,
 * creation, updates, and deletion against `/api/team`.
 */
export function useTeam(userRole: AdminRole = "SecurityAdmin") {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [pagination, setPagination] =
    useState<TeamPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<TeamCategory | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of team members (used by Retry).
   */
  const refreshMembers = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchTeamMembers({
        page,
        limit: DEFAULT_PAGINATION.limit,
        category: categoryFilter || undefined,
        search: search.trim() || undefined,
      });
      setMembers(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load team members from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, categoryFilter, search]);

  // Fetch team members whenever page, category filter, or search changes
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchTeamMembers({
          page,
          limit: DEFAULT_PAGINATION.limit,
          category: categoryFilter || undefined,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setMembers(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load team members from the server.";
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
  }, [page, categoryFilter, search]);

  const handleCreateMember = useCallback(
    async (formData: FormData): Promise<TeamMemberRecord> => {
      const created = await createTeamMember(formData, userRole);
      setMembers((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateMember = useCallback(
    async (memberId: string, formData: FormData): Promise<TeamMemberRecord> => {
      const updated = await updateTeamMember(memberId, formData, userRole);
      setMembers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteMember = useCallback(
    async (memberId: string): Promise<void> => {
      await deleteTeamMember(memberId, userRole);
      setMembers((prev) => prev.filter((item) => item.id !== memberId));
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

  const updateCategoryFilter = useCallback((nextCategory: TeamCategory | "") => {
    setIsLoading(true);
    setPage(1);
    setCategoryFilter(nextCategory);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setIsLoading(true);
    setPage(nextPage);
  }, []);

  return {
    members,
    pagination,
    search,
    categoryFilter,
    isLoading,
    loadError,
    refreshMembers,
    createMember: handleCreateMember,
    updateMember: handleUpdateMember,
    deleteMember: handleDeleteMember,
    updateSearch,
    updateCategoryFilter,
    goToPage,
  };
}
