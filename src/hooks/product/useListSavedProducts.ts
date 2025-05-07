import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiError } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listSavedProducts } from "../../services/productService";

const MAX_PRODUCTS_PER_PAGE = 20;

export const useListSavedProducts = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listSavedProducts, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listSavedProducts(
        signal,
        axiosPrivate,
        MAX_PRODUCTS_PER_PAGE,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
};
