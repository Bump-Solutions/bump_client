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
    },
  };
}

export function toSignupRequestDTO(model: SignupModel): SignupRequestDTO {
  return {
    email: model.email,
    username: model.username,
    password: model.password,
    password_confirmation: model.passwordConfirmation,
    first_name: model.firstName,
    last_name: model.lastName,
    phone_number: model.phoneNumber,
    gender: model.gender ? model.gender : null,
  };
}
