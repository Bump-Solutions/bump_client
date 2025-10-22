import { Option } from "../types/form";

export interface JwtPayload {
  user_id: string;
  username: string;
  roles: Role[];
  email?: string;
}

/**
 * A React‐alkalmazásban a hitelesítési állapotot tároló modell.
 * Minden mező camelCase, a komponenseknek megfelel.
 */
export interface AuthModel {
  accessToken: string;
  roles: Role[];

  user: {
    id: number;
    username: string;
  };
}

export type Role = 4001 | 5002 | 6003 | 7004;

// Signup form adatai
export interface SignupModel {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Option<number> | null;
}
