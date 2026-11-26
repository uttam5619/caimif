/**
 * Identifiers for tabs inside the Book Chapter dashboard view.
 */
export type BookChapterTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Book Chapter switcher.
 */
export interface BookChapterTabItem {
  id: BookChapterTabId;
  label: string;
}

/**
 * Serialized Book Chapter entity matching `/api/book-chapters` responses.
 */
export interface BookChapterRecord {
  id: string;
  year: number | null;
  domain: string | null;
  chapterTitle: string;
  bookName: string;
  authorFromCaimif: string | null;
  otherAuthors: string | null;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exact payload synchronized with `prisma/models/bookChapter.prisma` for creating a BookChapter record.
 * Only `chapterTitle` (Chapter Title) and `bookName` (Book Name) are required; `id` is generated server-side.
 */
export interface CreateBookChapterPayload {
  year: number | null;
  domain: string | null;
  chapterTitle: string;
  bookName: string;
  authorFromCaimif: string | null;
  otherAuthors: string | null;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
}

/**
 * Payload for updating an existing BookChapter record.
 */
export type UpdateBookChapterPayload = Partial<CreateBookChapterPayload>;

/**
 * Pagination metadata returned by `/api/book-chapters`.
 */
export interface BookChapterPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the BookChapterList component.
 */
export interface BookChapterListProps {
  bookChapters: BookChapterRecord[];
  pagination: BookChapterPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (chapter: BookChapterRecord) => void;
  onDelete: (chapter: BookChapterRecord) => void;
}

/**
 * Props for the EditBookChapterModal component.
 */
export interface EditBookChapterModalProps {
  isOpen: boolean;
  bookChapter: BookChapterRecord | null;
  onClose: () => void;
  onSave: (
    chapterId: string,
    payload: UpdateBookChapterPayload
  ) => Promise<void> | void;
}

/**
 * Props for the AddBookChapterForm component.
 */
export interface AddBookChapterFormProps {
  onSubmitChapter?: (
    payload: CreateBookChapterPayload
  ) => Promise<BookChapterRecord>;
  onSuccess?: (createdChapter: BookChapterRecord) => void;
}
