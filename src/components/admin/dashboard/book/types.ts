/**
 * Identifiers for tabs inside the Book dashboard view.
 */
export type BookTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Book switcher.
 */
export interface BookTabItem {
  id: BookTabId;
  label: string;
}

/**
 * Serialized Book entity matching `/api/books` responses.
 */
export interface BookRecord {
  id: string;
  year: number | null;
  domain: string | null;
  title: string;
  bookAuthor: string;
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
 * Exact payload synchronized with `prisma/models/book.prisma` for creating a Book record.
 * Only `title` (Book Title) and `bookAuthor` (Book Author) are required; `id` is generated server-side.
 */
export interface CreateBookPayload {
  year: number | null;
  domain: string | null;
  title: string;
  bookAuthor: string;
  authorFromCaimif: string | null;
  otherAuthors: string | null;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
}

/**
 * Payload for updating an existing Book record.
 */
export type UpdateBookPayload = Partial<CreateBookPayload>;

/**
 * Pagination metadata returned by `/api/books`.
 */
export interface BookPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the BookList component.
 */
export interface BookListProps {
  books: BookRecord[];
  pagination: BookPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (book: BookRecord) => void;
  onDelete: (book: BookRecord) => void;
}

/**
 * Props for the EditBookModal component.
 */
export interface EditBookModalProps {
  isOpen: boolean;
  book: BookRecord | null;
  onClose: () => void;
  onSave: (
    bookId: string,
    payload: UpdateBookPayload
  ) => Promise<void> | void;
}

/**
 * Props for the AddBookForm component.
 */
export interface AddBookFormProps {
  onSubmitBook?: (payload: CreateBookPayload) => Promise<BookRecord>;
  onSuccess?: (createdBook: BookRecord) => void;
}
