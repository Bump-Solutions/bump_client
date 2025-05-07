import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import axios from "../setup/Axios";

// ======================================== LOGIN ========================================

interface LoginResponse {
  email: string;
  access_token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    API.AUTH.LOGIN,
    JSON.stringify({ email, password }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return {
    ...response.data,
    email,
  };
};

// ======================================== SIGNUP ========================================

interface SignupData {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string | number | null;
}

export const signup = async (data: SignupData): Promise<ApiResponse> => {
  const response = await axios.post(
    API.AUTH.REGISTER,
    JSON.stringify({
      username: data.username,
      password: data.password,
      last_name: data.lastName,
      first_name: data.firstName,
      email: data.email,
      phone_number: data.phoneNumber,
      gender: data.gender,
    }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response.data;
};

// ======================================== GOOGLE LOGIN ========================================

export const googleLogin = async (code: string): Promise<string> => {
  const response = await axios.post(
    API.AUTH.GOOGLE_AUTH,
    { code: code },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response.data.access_token;
};

// ======================================== LOGOUT ========================================

export const logout = async (): Promise<void> => {
  await axios.get(API.AUTH.LOGOUT, { withCredentials: true });
};
