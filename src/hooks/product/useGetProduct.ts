import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../../types/api";
import { IProduct } from "../../types/product";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { QUERY_KEY } from "../../utils/queryKeys";
import { getProduct } from "../../services/productService";

export const useGetProduct = (
  dependencies: any[] = [],
  params: { pid: IProduct["id"] }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<IProduct, ApiError>({
    queryKey: [QUERY_KEY.getProduct, ...dependencies],
    queryFn: ({ signal }) => getProduct(signal, axiosPrivate, params.pid),
    retry: 1,
  });
};
