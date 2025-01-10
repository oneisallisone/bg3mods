// Content types for the blog system

export type Author = {
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
};

export type PostStatus = "draft" | "published" | "archived";

export type PostMetadata = {
  title: string;
  slug: string;
  excerpt?: string;
  author: Author;
  date: string;
  updateDate?: string;
  status: PostStatus;
  tags?: string[];
  categories?: string[];
  coverImage?: string;
  draft?: boolean;
};

export type Post = PostMetadata & {
  content: string;
  readingTime?: number;
};

export type Page = {
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  template?: string;
};

export type ContentType = "post" | "page";

export type ContentFilter = {
  type?: ContentType;
  status?: PostStatus;
  tag?: string;
  category?: string;
  author?: string;
  search?: string;
};

export type ContentSorting = {
  field: keyof PostMetadata;
  order: "asc" | "desc";
};

export type PaginationOptions = {
  page: number;
  limit: number;
};

export type ContentQuery = {
  filter?: ContentFilter;
  sort?: ContentSorting;
  pagination?: PaginationOptions;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};
