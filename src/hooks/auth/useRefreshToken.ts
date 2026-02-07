import { API } from "../../utils/api";

import { fromRefreshResponseDTO } from "../../mappers/authMapper";
import { AuthModel } from "../../models/authModel";
import { useAuth } from "./useAuth";

import axios from "axios";

export const useRefreshToken = (): (() => Promise<string>) => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const response = await axios.get(API.AUTH.REFRESH, {
      withCredentials: true,
      baseURL: API.BASE_URL,
    });

    const authModel = fromRefreshResponseDTO(response.data.access_token);
    setAuth((prev: AuthModel | null) =>
      prev ? { ...prev, ...authModel } : authModel,
    );

    return response.data.access_token;
  };

  return refresh;
};
