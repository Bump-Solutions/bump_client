import { QUERY_KEY } from "../../utils/queryKeys";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { ApiError } from "../../types/api";
import { useDebounce } from "../useDebounce";

import { searchProducts, searchUsers } from "../../services/searchService";

const MAX_SEARCH_RESULTS = 25;

type SearchMode = "users" | "products";

export const useSearch = (
  dependencies: any[] = [],
  params: {
    searchKey: string;
    delay?: number;
  }
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [isDebouncing, setIsDebouncing] = useState(false);

  const [debounced, setDebounced] = useState<{
    key: string;
    mode: SearchMode;
  }>({ key: "", mode: "products" });

  useEffect(() => {
    if (params.searchKey) {
      setIsDebouncing(true);
    }
  }, [params.searchKey]);

  useDebounce(
    () => {
      const isUserSearch = params.searchKey.startsWith("@");
      const cleanedSearchKey = isUserSearch
        ? params.searchKey.slice(1)
        : params.searchKey;

      setDebounced({
        key: cleanedSearchKey,
        mode: isUserSearch ? "users" : "products",
      });

      setIsDebouncing(false);
    },
    params.delay ?? 0,
    [params.searchKey]
  );

  const queryKey = [
    debounced.mode === "users"
      ? QUERY_KEY.searchUsers
      : QUERY_KEY.searchProducts,
    ...dependencies,
    debounced.key,
  ];

  const query = useInfiniteQuery<any, ApiError>({
    queryKey,
    queryFn: ({ signal, pageParam }) =>
      debounced.mode === "users"
        ? searchUsers(
            signal,
            axiosPrivate,
            MAX_SEARCH_RESULTS,
            pageParam as number,
            debounced.key
          )
        : searchProducts(
            signal,
            axiosPrivate,
            MAX_SEARCH_RESULTS,
            pageParam as number,
            debounced.key
          ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: !!debounced.key && debounced.key.length > 0,
    retry: 1,
  });

  // Invalidate listHistory query when search is successful
  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listSearchHistory],
      });
    }
  }, [query.isSuccess, queryClient]);

  return {
    ...query,
    isDebouncing,
  };
};
