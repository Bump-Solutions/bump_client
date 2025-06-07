import { QUERY_KEY } from "../../utils/queryKeys";
import { ApiError } from "../../types/api";
import { AddressModel } from "../../models/addressModel";

import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

import { listAddresses } from "../../services/addressService";

export const useListAddresses = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<AddressModel[], ApiError>({
    queryKey: [QUERY_KEY.listAddresses, ...dependencies],
    queryFn: ({ signal }) => listAddresses(signal, axiosPrivate),
  });
};
