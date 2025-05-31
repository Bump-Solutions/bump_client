import { User } from "../../types/user";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/userService";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";

export const useGetUser = (
  dependencies: any[] = [],
  params: { username: User["username"] }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<User, ApiError>({
    queryKey: [QUERY_KEY.getUser, ...dependencies],
    queryFn: ({ signal }) => getUser(signal, axiosPrivate, params.username),
    retry: 1,
  });
};
