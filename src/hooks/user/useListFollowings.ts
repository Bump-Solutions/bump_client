import { QUERY_KEY } from "../../utils/queryKeys";
import { UserModel } from "../../models/userModel";
import { ApiError } from "../../types/api";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

import { listFollowings } from "../../services/userService";
import { ENUM } from "../../utils/enum";

const MAX_FOLLOWINGS_PER_PAGE = 10;

export const useListFollowings = (
  dependencies: any[] = [],
  params: {
    uid: UserModel["id"];
    searchKey: string;
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listFollowings, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listFollowings(
        signal,
        axiosPrivate,
        params.uid,
        MAX_FOLLOWINGS_PER_PAGE,
        pageParam as number,
        params.searchKey
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: Boolean(params.uid),
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
