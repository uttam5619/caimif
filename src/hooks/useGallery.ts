"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  GalleryAlbumRecord,
  GalleryImageRecord,
  GalleryPagination,
} from "@/components/admin/dashboard/gallery/types";
import {
  createGalleryAlbum,
  createGalleryPhoto,
  deleteGalleryAlbum,
  deleteGalleryPhoto,
  fetchGalleries,
  fetchGalleryImages,
  updateGalleryAlbum,
  updateGalleryPhoto,
} from "@/lib/api/gallery.api";

const DEFAULT_PAGINATION: GalleryPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

/**
 * Custom hook managing paginated Gallery albums and photos along with
 * full CRUD actions synchronized against `/api/galleries` and `/api/gallery-images`.
 */
export function useGallery(userRole: AdminRole = "SecurityAdmin") {
  const [albums, setAlbums] = useState<GalleryAlbumRecord[]>([]);
  const [allAlbums, setAllAlbums] = useState<GalleryAlbumRecord[]>([]);
  const [albumPagination, setAlbumPagination] =
    useState<GalleryPagination>(DEFAULT_PAGINATION);
  const [albumPage, setAlbumPage] = useState<number>(1);
  const [albumSearch, setAlbumSearch] = useState<string>("");
  const [isLoadingAlbums, setIsLoadingAlbums] = useState<boolean>(true);
  const [albumLoadError, setAlbumLoadError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<GalleryImageRecord[]>([]);
  const [photoPagination, setPhotoPagination] =
    useState<GalleryPagination>(DEFAULT_PAGINATION);
  const [photoPage, setPhotoPage] = useState<number>(1);
  const [photoSearch, setPhotoSearch] = useState<string>("");
  const [photoAlbumFilter, setPhotoAlbumFilter] = useState<string>("");
  const [isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(true);
  const [photoLoadError, setPhotoLoadError] = useState<string | null>(null);

  const refreshAllAlbumOptions = useCallback(async () => {
    try {
      const result = await fetchGalleries({ page: 1, limit: 100 });
      setAllAlbums(result.items);
    } catch {
      // Non-blocking fallback for dropdown selectors
    }
  }, []);

  const refreshAlbums = useCallback(async () => {
    setIsLoadingAlbums(true);
    setAlbumLoadError(null);
    try {
      const result = await fetchGalleries({
        page: albumPage,
        limit: DEFAULT_PAGINATION.limit,
        search: albumSearch.trim() || undefined,
      });
      setAlbums(result.items);
      setAlbumPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load gallery albums from the server.";
      setAlbumLoadError(message);
    } finally {
      setIsLoadingAlbums(false);
    }
  }, [albumPage, albumSearch]);

  const refreshPhotos = useCallback(async () => {
    setIsLoadingPhotos(true);
    setPhotoLoadError(null);
    try {
      const result = await fetchGalleryImages({
        galleryId: photoAlbumFilter || undefined,
        search: photoSearch.trim() || undefined,
        page: photoPage,
        limit: DEFAULT_PAGINATION.limit,
      });
      setPhotos(result.items);
      setPhotoPagination(result.pagination);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load gallery photos from the server.";
      setPhotoLoadError(message);
    } finally {
      setIsLoadingPhotos(false);
    }
  }, [photoAlbumFilter, photoPage, photoSearch]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAllAlbums() {
      try {
        const result = await fetchGalleries({ page: 1, limit: 100 });
        if (!isCancelled) {
          setAllAlbums(result.items);
        }
      } catch {
        // Non-blocking fallback for dropdown selectors
      }
    }

    void loadAllAlbums();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadAlbums() {
      try {
        const result = await fetchGalleries({
          page: albumPage,
          limit: DEFAULT_PAGINATION.limit,
          search: albumSearch.trim() || undefined,
        });
        if (isCancelled) return;

        setAlbums(result.items);
        setAlbumPagination(result.pagination);
        setAlbumLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setAlbumLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load gallery albums from the server."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingAlbums(false);
        }
      }
    }

    void loadAlbums();
    return () => {
      isCancelled = true;
    };
  }, [albumPage, albumSearch]);

  useEffect(() => {
    let isCancelled = false;

    async function loadPhotos() {
      try {
        const result = await fetchGalleryImages({
          galleryId: photoAlbumFilter || undefined,
          search: photoSearch.trim() || undefined,
          page: photoPage,
          limit: DEFAULT_PAGINATION.limit,
        });
        if (isCancelled) return;

        setPhotos(result.items);
        setPhotoPagination(result.pagination);
        setPhotoLoadError(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setPhotoLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load gallery photos from the server."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingPhotos(false);
        }
      }
    }

    void loadPhotos();
    return () => {
      isCancelled = true;
    };
  }, [photoAlbumFilter, photoPage, photoSearch]);

  const handleCreateAlbum = useCallback(
    async (payload: {
      title: string;
      description: string | null;
    }): Promise<GalleryAlbumRecord> => {
      const created = await createGalleryAlbum(payload, userRole);
      setAlbums((prev) => [created, ...prev]);
      setAllAlbums((prev) => [created, ...prev]);
      setAlbumPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      return created;
    },
    [userRole]
  );

  const handleUpdateAlbum = useCallback(
    async (
      albumId: string,
      payload: { title?: string; description?: string | null }
    ): Promise<GalleryAlbumRecord> => {
      const updated = await updateGalleryAlbum(albumId, payload, userRole);
      setAlbums((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setAllAlbums((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteAlbum = useCallback(
    async (albumId: string): Promise<void> => {
      await deleteGalleryAlbum(albumId, userRole);
      setAlbums((prev) => prev.filter((item) => item.id !== albumId));
      setAllAlbums((prev) => prev.filter((item) => item.id !== albumId));
      setAlbumPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      if (photoAlbumFilter === albumId) {
        setPhotoAlbumFilter("");
      }
      // Refresh photos because deleting an album cascades to its child images
      void refreshPhotos();
    },
    [photoAlbumFilter, refreshPhotos, userRole]
  );

  const handleCreatePhoto = useCallback(
    async (formData: FormData): Promise<GalleryImageRecord> => {
      const created = await createGalleryPhoto(formData, userRole);
      setPhotos((prev) => [created, ...prev]);
      setPhotoPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      void refreshAlbums();
      void refreshAllAlbumOptions();
      return created;
    },
    [refreshAlbums, refreshAllAlbumOptions, userRole]
  );

  const handleUpdatePhoto = useCallback(
    async (photoId: string, formData: FormData): Promise<GalleryImageRecord> => {
      const updated = await updateGalleryPhoto(photoId, formData, userRole);
      setPhotos((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      void refreshAlbums();
      void refreshAllAlbumOptions();
      return updated;
    },
    [refreshAlbums, refreshAllAlbumOptions, userRole]
  );

  const handleDeletePhoto = useCallback(
    async (photoId: string): Promise<void> => {
      await deleteGalleryPhoto(photoId, userRole);
      setPhotos((prev) => prev.filter((item) => item.id !== photoId));
      setPhotoPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      void refreshAlbums();
      void refreshAllAlbumOptions();
    },
    [refreshAlbums, refreshAllAlbumOptions, userRole]
  );

  const updateAlbumSearch = useCallback((value: string) => {
    setAlbumSearch(value);
    setAlbumPage(1);
  }, []);

  const updatePhotoSearch = useCallback((value: string) => {
    setPhotoSearch(value);
    setPhotoPage(1);
  }, []);

  const updatePhotoAlbumFilter = useCallback((galleryId: string) => {
    setPhotoAlbumFilter(galleryId);
    setPhotoPage(1);
  }, []);

  return {
    albums,
    allAlbums,
    albumPagination,
    albumSearch,
    isLoadingAlbums,
    albumLoadError,
    refreshAlbums,
    createAlbum: handleCreateAlbum,
    updateAlbum: handleUpdateAlbum,
    deleteAlbum: handleDeleteAlbum,
    updateAlbumSearch,
    goToAlbumPage: setAlbumPage,

    photos,
    photoPagination,
    photoSearch,
    photoAlbumFilter,
    isLoadingPhotos,
    photoLoadError,
    refreshPhotos,
    createPhoto: handleCreatePhoto,
    updatePhoto: handleUpdatePhoto,
    deletePhoto: handleDeletePhoto,
    updatePhotoSearch,
    updatePhotoAlbumFilter,
    goToPhotoPage: setPhotoPage,
  };
}
