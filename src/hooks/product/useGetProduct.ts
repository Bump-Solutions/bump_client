import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { QUERY_KEY } from "../../utils/queryKeys";
import { getProduct } from "../../services/productService";
import { ProductModel } from "../../models/productModel";
import { ENUM } from "../../utils/enum";

export const useGetProduct = (
  dependencies: any[] = [],
  params: { pid: number }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<ProductModel, ApiError>({
    queryKey: [QUERY_KEY.getProduct, ...dependencies],
    queryFn: ({ signal }) => getProduct(signal, axiosPrivate, params.pid),
    retry: 1,
    staleTime: ENUM.GLOBALS.staleTime,
  });
};
