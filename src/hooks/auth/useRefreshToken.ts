import { API } from "../../utils/api";

import axios from "axios";

import { useAuth } from "./useAuth";
import { fromRefreshResponseDTO } from "../../mappers/authMapper";

export const useRefreshToken = (): (() => Promise<string>) => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const response = await axios.get(API.AUTH.REFRESH, {
      withCredentials: true,
    });

    const authModel = fromRefreshResponseDTO(response.data.access_token);
    setAuth(authModel);

    return response.data.access_token;
  };

  return refresh;
};
