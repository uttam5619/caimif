import type { GalleryTabItem } from "./types";

/**
 * Four-tab definitions for the Gallery dashboard section.
 * Decoupled from GalleryView to separate presentation config from UI JSX.
 */
export const GALLERY_TABS: GalleryTabItem[] = [
  {
    id: "albums",
    label: "List of Albums",
  },
  {
    id: "photos",
    label: "List of Photo",
  },
  {
    id: "add-album",
    label: "Add Album",
  },
  {
    id: "add-photo",
    label: "Add Photo",
  },
];
