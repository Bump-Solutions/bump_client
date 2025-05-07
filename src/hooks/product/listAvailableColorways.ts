import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listAvailableColorways } from "../../services/productService";

const MAX_COLORWAYS_PER_PAGE = 12;

export const useListAvailableColorways = (
  dependencies: any[] = [],
  params: {
    isCatalogProduct: boolean;
    brand: string;
    model: string;
    searchKey?: string;
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listAvailableColorways, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listAvailableColorways(
        signal,
        axiosPrivate,
        params.brand,
        params.model,
        MAX_COLORWAYS_PER_PAGE,
        pageParam as number,
        params.searchKey
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: params.isCatalogProduct && !!params.brand && !!params.model,
  });
};
