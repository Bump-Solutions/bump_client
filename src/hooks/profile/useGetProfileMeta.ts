import { ENUM } from "../../utils/enum";
import { useQuery } from "@tanstack/react-query";
import { ProfileMetaModel } from "../../models/profileModel";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

import { getProfileMeta } from "../../services/profileService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { ApiError } from "../../types/api";

export const useGetProfileMeta = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<ProfileMetaModel, ApiError>({
    queryKey: [QUERY_KEY.getProfileMeta, ...dependencies],
    queryFn: ({ signal }) => getProfileMeta(signal, axiosPrivate),
    refetchOnWindowFocus: false,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
