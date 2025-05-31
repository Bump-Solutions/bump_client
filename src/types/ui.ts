export interface PaginatedListProps<T> {
  pages: T[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}
