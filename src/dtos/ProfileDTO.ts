import { FetchedAddressDTO } from "./AddressDTO";

/**
 * A backend /profile GET végpontja által visszaadott DTO.
 * A mezők camelCase helyett snake_case formában jönnek vissza,
 * ezeket nekünk DTO-ként kell leírni.
 */
export interface FetchedProfileDTO {
  username: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  bio: string | null;
  address: {
    name: string;
    country: string;
    city: string;
    zip: string;
    street: string;
  };
  profile_picture: string;
  profile_picture_hash: string;
}

/**
 * A backend /profile PUT végpontja által elfogadott DTO.
 * Ezzel a JSON-nal módosíthatjuk a profil személyes adatait.
 */
export interface UpdateProfileDTO {
  username?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  bio?: string | null;
  address?: {
    name?: string;
    country?: string;
    city?: string;
    zip?: string;
    street?: string;
  };
}

export interface AccountCapabilitesDTO {
  /** Stripe Connect állapotok (a backend számolja Stripe account alapján) */
  stripe: {
    connected: boolean; // van connected account ID
  };

  profile: {
    email_verified: boolean;
    phone_number_verified: boolean;
    account_complete: boolean;
  };
}

/**
 * A backend /profile/meta GET végpontja által visszaadott DTO.
 */
export interface FetchedProfileMetaDTO {
  email: string;
  phone_number: string | null;
  profile_picture: string;
  unread_notifications: number; // unread notifications count

  address: FetchedAddressDTO | null; // Default address, if exists

  account_capabilities: AccountCapabilitesDTO;
}
