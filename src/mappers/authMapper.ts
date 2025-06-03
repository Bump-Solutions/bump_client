import { jwtDecode } from "jwt-decode";
import { LoginResponseDTO, SignupRequestDTO } from "../dtos/AuthDTO";
import { AuthModel, JwtPayload, SignupModel } from "../models/authModel";

export function fromLoginResponseDTO(dto: LoginResponseDTO): AuthModel {
  const decoded = jwtDecode<JwtPayload>(dto.access_token);

  return {
    accessToken: dto.access_token,
    roles: decoded.roles,
    user: {
      id: Number(decoded.user_id),
      username: decoded.username,
      email: dto.email,
    },
  };
}

export function fromGoogleResponseDTO(accessToken: string): AuthModel {
  const decoded = jwtDecode<JwtPayload>(accessToken);

  return {
    accessToken,
    roles: decoded.roles,
    user: {
      id: Number(decoded.user_id),
      username: decoded.username,
      email: "", // Google login typically does not return email
    },
  };
}

export function fromRefreshResponseDTO(accessToken: string): AuthModel {
  const decoded = jwtDecode<JwtPayload>(accessToken);

  return {
    accessToken,
    roles: decoded.roles,
    user: {
      id: Number(decoded.user_id),
      username: decoded.username,
      email: decoded.email || "", // Email may not be present
    },
  };
}

export function toSignupRequestDTO(input: SignupModel): SignupRequestDTO {
  return {
    email: input.email,
    username: input.username,
    password: input.password,
    passwordConfirmation: input.passwordConfirmation,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneNumber: input.phoneNumber,
    gender: input.gender ? input.gender.value : null,
  };
}
