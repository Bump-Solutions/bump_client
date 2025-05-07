import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listAvailableModels } from "../../services/productService";

const MAX_MODELS_PER_PAGE = 12;

export const useListAvailableModels = (
  dependencies: any[] = [],
  params: {
    isCatalogProduct: boolean;
    brand: string;
    searchKey?: string;
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listAvailableModels, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listAvailableModels(
        signal,
        axiosPrivate,
        params.brand,
        MAX_MODELS_PER_PAGE,
        pageParam as number,
        params.searchKey
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: params.isCatalogProduct && !!params.brand,
  });
};
