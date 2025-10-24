import {
  AccountCapabilitesDTO,
  FetchedProfileDTO,
  FetchedProfileMetaDTO,
  UpdateProfileDTO,
} from "../dtos/ProfileDTO";
import {
  AccountCapabilities,
  ProfileMetaModel,
  ProfileModel,
} from "../models/profileModel";
import { fromFetchedAddressDTO } from "./addressMapper";

/**
 * DTO → ProfileModelInterface átalakító függvény.
 * Snake_case → camelCase, illetve default értékek biztosítása.
 */
export function fromFetchedProfileDTO(dto: FetchedProfileDTO): ProfileModel {
  return {
    username: dto.username,
    firstName: dto.first_name ?? null,
    lastName: dto.last_name ?? null,
    phoneNumber: dto.phone_number ?? null,
    bio: dto.bio ?? null,
    address: {
      name: dto.address.name,
      country: dto.address.country,
      city: dto.address.city,
      zip: dto.address.zip,
      street: dto.address.street,
    },
    profilePicture: dto.profile_picture,
    profilePictureHash: dto.profile_picture_hash,
  };
}

/**
 * ProfileModelInterface (részben vagy teljesen) → UpdateProfileDTO konverzió,
 * amelyet a backend /profile PUT végpontja fogad el.
 */
export function toUpdateProfileDTO(
  model: Partial<ProfileModel>
): UpdateProfileDTO {
  const dto: UpdateProfileDTO = {};

  if (model.username !== undefined) {
    dto.username = model.username;
  }

  if (model.firstName !== undefined) {
    dto.first_name = model.firstName;
  }

  if (model.lastName !== undefined) {
    dto.last_name = model.lastName;
  }

  if (model.phoneNumber !== undefined) {
    dto.phone_number = model.phoneNumber;
  }

  if (model.bio !== undefined) {
    dto.bio = model.bio;
  }

  if (model.address) {
    dto.address = {
      name: model.address.name,
      country: model.address.country,
      city: model.address.city,
      zip: model.address.zip,
      street: model.address.street,
    };
  }

  return dto;
}

export function fromAccountCapabilitiesDTO(
  dto: AccountCapabilitesDTO
): AccountCapabilities {
  return {
    stripe: {
      connected: dto.stripe.connected,
    },

    profile: {
      emailVerified: dto.profile.email_verified,
      phoneNumberVerified: dto.profile.phone_number_verified,
      accountComplete: dto.profile.account_complete,
    },
  };
}

export function fromFetchedProfileMetaDTO(
  dto: FetchedProfileMetaDTO
): ProfileMetaModel {
  return {
    email: dto.email,
    phoneNumber: dto.phone_number,
    profilePicture: dto.profile_picture,
    unreadNotifications: dto.unread_notifications,

    address: dto.address ? fromFetchedAddressDTO(dto.address) : null,

    accountCapabilities: fromAccountCapabilitiesDTO(dto.account_capabilities),
  };
}
