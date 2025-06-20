import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiError } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listProducts } from "../../services/productService";
import { UserModel } from "../../models/userModel";

const MAX_PRODUCTS_PER_PAGE = 20;

export const useListProducts = (
  dependencies: any[] = [],
  params: {
    uid: UserModel["id"];
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listProducts, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listProducts(
        signal,
        axiosPrivate,
        params.uid,
        MAX_PRODUCTS_PER_PAGE,
        pageParam as number
      ),
    enabled: Boolean(params.uid),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
};
