"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  EventPagination,
  EventRecord,
} from "@/components/admin/dashboard/events/types";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "@/lib/api/event.api";

const DEFAULT_PAGINATION: EventPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Event retrieval, search filtering,
 * creation, updates, and deletion against `/api/events`.
 */
export function useEvents(userRole: AdminRole = "SecurityAdmin") {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [pagination, setPagination] =
    useState<EventPagination>(DEFAULT_PAGINATION);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes the current page of events (used by Retry).
   */
  const refreshEvents = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchEvents({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: search.trim() || undefined,
      });
      setEvents(result.items);
      setPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load events from the server.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Fetch events whenever page or search changes; state updates occur asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const result = await fetchEvents({
          page,
          limit: DEFAULT_PAGINATION.limit,
          search: search.trim() || undefined,
        });
        if (isCancelled) return;

        setEvents(result.items);
        setPagination(result.pagination);
        setLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load events from the server.";
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

  const handleCreateEvent = useCallback(
    async (formData: FormData): Promise<EventRecord> => {
      const created = await createEvent(formData, userRole);
      setEvents((prev) => [created, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return created;
    },
    [userRole]
  );

  const handleUpdateEvent = useCallback(
    async (eventId: number, formData: FormData): Promise<EventRecord> => {
      const updated = await updateEvent(eventId, formData, userRole);
      setEvents((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteEvent = useCallback(
    async (eventId: number): Promise<void> => {
      await deleteEvent(eventId, userRole);
      setEvents((prev) => prev.filter((item) => item.id !== eventId));
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
    events,
    pagination,
    search,
    isLoading,
    loadError,
    refreshEvents,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    updateSearch,
    goToPage,
  };
}
