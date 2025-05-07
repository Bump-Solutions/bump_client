import { QUERY_KEY } from "../../utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../../types/api";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { getProfile } from "../../services/profileService";

export const useGetProfile = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<any, ApiError>({
    queryKey: [QUERY_KEY.getProfile, ...dependencies],
    queryFn: ({ signal }) => getProfile(signal, axiosPrivate),
  });
};
