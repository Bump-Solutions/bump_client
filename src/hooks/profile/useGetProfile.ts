import { QUERY_KEY } from "../../utils/queryKeys";
import { useQuery } from "@tanstack/react-query";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { getProfile } from "../../services/profileService";

export const useGetProfile = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<any, string>({
    queryKey: [QUERY_KEY.getProfile, ...dependencies],
    queryFn: ({ signal }) => getProfile(signal, axiosPrivate),
  });
};
