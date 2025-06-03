import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import axios from "../setup/Axios";
import { AuthModel, SignupModel } from "../models/authModel";
import {
  GoogleResponseDTO,
  LoginResponseDTO,
  SignupRequestDTO,
} from "../dtos/AuthDTO";
import {
  fromGoogleResponseDTO,
  fromLoginResponseDTO,
  toSignupRequestDTO,
} from "../mappers/authMapper";

// ======================================== LOGIN ========================================

export const login = async (
  email: string,
  password: string
): Promise<AuthModel> => {
  const response = await axios.post<LoginResponseDTO>(
    API.AUTH.LOGIN,
    JSON.stringify({ email, password }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return fromLoginResponseDTO({
    ...response.data,
    email,
  });
};

// ======================================== SIGNUP ========================================

export const signup = async (data: SignupModel): Promise<ApiResponse> => {
  const payload: SignupRequestDTO = toSignupRequestDTO(data);
  const response = await axios.post(
    API.AUTH.REGISTER,
    JSON.stringify(payload),

    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response.data;
};

// ======================================== GOOGLE LOGIN ========================================

export const googleLogin = async (code: string): Promise<AuthModel> => {
  const response = await axios.post<GoogleResponseDTO>(
    API.AUTH.GOOGLE_AUTH,
    { code: code },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return fromGoogleResponseDTO(response.data.access_token);
};

// ======================================== LOGOUT ========================================

export const logout = async (): Promise<void> => {
  await axios.get(API.AUTH.LOGOUT, { withCredentials: true });
};
