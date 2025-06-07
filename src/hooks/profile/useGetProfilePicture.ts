import { useQuery } from "@tanstack/react-query";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";

import { getProfilePicture } from "../../services/profileService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { ApiError } from "../../types/api";

export const useGetProfilePicture = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<any, ApiError>({
    queryKey: [QUERY_KEY.getProfilePicture, ...dependencies],
    queryFn: ({ signal }) => getProfilePicture(signal, axiosPrivate),
    refetchOnWindowFocus: false,
  });
};
