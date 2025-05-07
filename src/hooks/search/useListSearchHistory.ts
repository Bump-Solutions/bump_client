import { QUERY_KEY } from "../../utils/queryKeys";
import { SearchHistoryItem } from "../../types/search";
import { ApiError } from "../../types/api";

import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

import { listSearchHistory } from "../../services/searchService";

export const useListSearchHistory = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<SearchHistoryItem[], ApiError>({
    queryKey: [QUERY_KEY.listSearchHistory, ...dependencies],
    queryFn: ({ signal }) => listSearchHistory(signal, axiosPrivate),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
