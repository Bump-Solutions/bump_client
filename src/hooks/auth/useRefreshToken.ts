import { API } from "../../utils/api";

import { AuthModel } from "../../models/authModel";
import { useAuth } from "./useAuth";
import { fromRefreshResponseDTO } from "../../mappers/authMapper";

import axios from "axios";

export const useRefreshToken = (): (() => Promise<string>) => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const response = await axios.get(API.AUTH.REFRESH, {
      withCredentials: true,
    });

    const authModel = fromRefreshResponseDTO(response.data.access_token);
    setAuth((prev: AuthModel | null) => prev ? { ...prev, ...authModel } : authModel);

    return response.data.access_token;
  };

  return refresh;
};
