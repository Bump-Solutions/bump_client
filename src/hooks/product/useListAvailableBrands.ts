import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listAvailableBrands } from "../../services/productService";

const MAX_BRANDS_PER_PAGE = 12;

export const useListAvailableBrands = (
  dependencies: any[] = [],
  params: {
    isCatalogProduct: boolean;
    searchKey: string;
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listAvailableBrands, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listAvailableBrands(
        signal,
        axiosPrivate,
        MAX_BRANDS_PER_PAGE,
        pageParam as number,
        params.searchKey
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: params.isCatalogProduct,
    staleTime: Infinity, // Static list from server
  });
};
