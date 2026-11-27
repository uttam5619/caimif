"use client";

import React, { useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import { useGallery } from "@/hooks/useGallery";
import AddAlbumForm from "./AddAlbumForm";
import AddPhotoForm from "./AddPhotoForm";
import AlbumList from "./AlbumList";
import EditAlbumModal from "./EditAlbumModal";
import EditPhotoModal from "./EditPhotoModal";
import { GALLERY_TABS } from "./gallery.data";
import PhotoList from "./PhotoList";
import type {
  GalleryAlbumRecord,
  GalleryImageRecord,
  GalleryTabId,
} from "./types";

export interface GalleryViewProps {
  userRole?: AdminRole;
}

/**
 * GalleryView Component
 *
 * Four-tab management dashboard section for CAIMIF Gallery:
 * - List of Albums
 * - List of Photo
 * - Add Album
 * - Add Photo
 */
export default function GalleryView({
  userRole = "SecurityAdmin",
}: GalleryViewProps = {}) {
  const {
    albums,
    allAlbums,
    albumPagination,
    albumSearch,
    isLoadingAlbums,
    albumLoadError,
    refreshAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    updateAlbumSearch,
    goToAlbumPage,

    photos,
    photoPagination,
    photoSearch,
    photoAlbumFilter,
    isLoadingPhotos,
    photoLoadError,
    refreshPhotos,
    createPhoto,
    updatePhoto,
    deletePhoto,
    updatePhotoSearch,
    updatePhotoAlbumFilter,
    goToPhotoPage,
  } = useGallery(userRole);

  const [activeTab, setActiveTab] = useState<GalleryTabId>("albums");
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    msg: string;
  } | null>(null);

  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbumRecord | null>(
    null
  );
  const [albumToDelete, setAlbumToDelete] =
    useState<GalleryAlbumRecord | null>(null);

  const [editingPhoto, setEditingPhoto] = useState<GalleryImageRecord | null>(
    null
  );
  const [photoToDelete, setPhotoToDelete] =
    useState<GalleryImageRecord | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveAlbum = async (
    albumId: string,
    payload: { title?: string; description?: string | null }
  ) => {
    const updated = await updateAlbum(albumId, payload);
    setNotification({
      type: "success",
      msg: `Album "${updated.title}" updated successfully.`,
    });
    setEditingAlbum(null);
  };

  const handleSavePhoto = async (photoId: string, payload: FormData) => {
    await updatePhoto(photoId, payload);
    setNotification({
      type: "success",
      msg: "Photo updated successfully.",
    });
    setEditingPhoto(null);
  };

  const handleConfirmDeleteAlbum = async () => {
    if (!albumToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAlbum(albumToDelete.id);
      setNotification({
        type: "info",
        msg: `Album "${albumToDelete.title}" and its photos were deleted.`,
      });
      setAlbumToDelete(null);
    } catch (error: unknown) {
      setNotification({
        type: "error",
        msg:
          error instanceof Error ? error.message : "Failed to delete album.",
      });
      setAlbumToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeletePhoto = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    try {
      await deletePhoto(photoToDelete.id);
      setNotification({
        type: "info",
        msg: "Photo deleted successfully.",
      });
      setPhotoToDelete(null);
    } catch (error: unknown) {
      setNotification({
        type: "error",
        msg:
          error instanceof Error ? error.message : "Failed to delete photo.",
      });
      setPhotoToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeError =
    activeTab === "albums"
      ? albumLoadError
      : activeTab === "photos"
        ? photoLoadError
        : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Gallery
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage CAIMIF photo albums and showcase photographs across laboratories, events, and instrumentation.
        </p>
      </div>

      {/* 4-Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {GALLERY_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          let label = tab.label;
          if (tab.id === "albums") {
            label = `${tab.label} (${albumPagination.total})`;
          } else if (tab.id === "photos") {
            label = `${tab.label} (${photoPagination.total})`;
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
                isActive
                  ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Transient Feedback Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : notification.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                : "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          <span>{notification.msg}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Backend Connectivity Error Banner */}
      {activeError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <span>{activeError}</span>
          <button
            type="button"
            onClick={
              activeTab === "albums" ? refreshAlbums : refreshPhotos
            }
            className="rounded-lg border border-rose-300 dark:border-rose-800 px-2.5 py-1 text-[11px] font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Active Tab Content */}
      <div>
        {activeTab === "albums" ? (
          <AlbumList
            albums={albums}
            pagination={albumPagination}
            search={albumSearch}
            isLoading={isLoadingAlbums}
            loadError={albumLoadError}
            onSearchChange={updateAlbumSearch}
            onPageChange={goToAlbumPage}
            onEdit={(album) => setEditingAlbum(album)}
            onDelete={(album) => setAlbumToDelete(album)}
          />
        ) : activeTab === "photos" ? (
          <PhotoList
            photos={photos}
            albums={allAlbums}
            pagination={photoPagination}
            search={photoSearch}
            albumFilter={photoAlbumFilter}
            isLoading={isLoadingPhotos}
            loadError={photoLoadError}
            onSearchChange={updatePhotoSearch}
            onAlbumFilterChange={updatePhotoAlbumFilter}
            onPageChange={goToPhotoPage}
            onEdit={(photo) => setEditingPhoto(photo)}
            onDelete={(photo) => setPhotoToDelete(photo)}
          />
        ) : activeTab === "add-album" ? (
          <AddAlbumForm
            onSubmitAlbum={createAlbum}
            onSuccess={(created) => {
              setNotification({
                type: "success",
                msg: `Album "${created.title}" added successfully.`,
              });
              setActiveTab("albums");
            }}
          />
        ) : (
          <AddPhotoForm
            albums={allAlbums}
            onSubmitPhoto={createPhoto}
            onRequestAddAlbum={() => setActiveTab("add-album")}
            onSuccess={() => {
              setNotification({
                type: "success",
                msg: "Photo uploaded successfully.",
              });
              setActiveTab("photos");
            }}
          />
        )}
      </div>

      {/* Modals */}
      <EditAlbumModal
        isOpen={editingAlbum !== null}
        album={editingAlbum}
        onClose={() => setEditingAlbum(null)}
        onSave={handleSaveAlbum}
      />

      <EditPhotoModal
        isOpen={editingPhoto !== null}
        photo={editingPhoto}
        albums={allAlbums}
        onClose={() => setEditingPhoto(null)}
        onSave={handleSavePhoto}
      />

      <DeleteConfirmModal
        isOpen={albumToDelete !== null}
        title="Delete Album"
        itemName={albumToDelete?.title ?? ""}
        description="This album and all photographs inside it will be permanently deleted."
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteAlbum}
        onCancel={() => {
          if (!isDeleting) setAlbumToDelete(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={photoToDelete !== null}
        title="Delete Photo"
        itemName={photoToDelete?.description || "Selected Photo"}
        description="This photograph will be permanently removed from the album."
        isLoading={isDeleting}
        onConfirm={handleConfirmDeletePhoto}
        onCancel={() => {
          if (!isDeleting) setPhotoToDelete(null);
        }}
      />
    </div>
  );
}
