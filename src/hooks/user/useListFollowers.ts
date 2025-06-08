import { QUERY_KEY } from "../../utils/queryKeys";
import { ApiError } from "../../types/api";
import { UserModel } from "../../models/userModel";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

import { listFollowers } from "../../services/userService";

const MAX_FOLLOWERS_PER_PAGE = 10;

export const useListFollowers = (
  dependencies: any[] = [],
  params: {
    uid: UserModel["id"];
    searchKey: string;
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listFollowers, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listFollowers(
        signal,
        axiosPrivate,
        params.uid,
        MAX_FOLLOWERS_PER_PAGE,
        pageParam as number,
        params.searchKey
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: !!params.uid,
  });
};
