import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { CartModel } from "../../models/cartModel";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { getCart } from "../../services/cartService";
import { ENUM } from "../../utils/enum";
import { useAuth } from "../auth/useAuth";

export const useGetCart = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  return useQuery<CartModel, ApiError>({
    queryKey: [QUERY_KEY.getCart, ...dependencies],
    queryFn: ({ signal }) => getCart(signal, axiosPrivate),
    enabled: Boolean(auth?.accessToken),
    retry: 1,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
