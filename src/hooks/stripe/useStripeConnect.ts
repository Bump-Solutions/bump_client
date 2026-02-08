import { useQuery } from "@tanstack/react-query";
import { stripeConnect } from "../../services/stripeService";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

export const useStripeConnect = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<string, ApiError>({
    queryKey: [QUERY_KEY.stripeConnect, ...dependencies],
    queryFn: ({ signal }) => stripeConnect(signal, axiosPrivate),
    enabled: false, // Disable automatic fetching; call refetch() on button click
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
