import { AddressModel } from "./addressModel";

/**
 * A kliensoldali domain modell a profil személyes adataihoz.
 * A mezők camelCase formában vannak, és a dátumokat, palettákat is
 * olyan formába alakítjuk, hogy könnyen használhatók legyenek.
 */
export interface ProfileModel {
  username: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  bio: string | null;
  address: AddressModel | null;
  profilePicture: string;
  profilePictureHash: string;
}

export interface AccountCapabilities {
  /** Stripe Connect állapotok (a backend számolja Stripe account alapján) */
  stripe: {
    connected: boolean; // van connected account ID
  };

  /** Saját platform-alkalmasságok */
  profile: {
    emailVerified: boolean;
    phoneNumberVerified: boolean;
    accountComplete: boolean;
  };
}

export interface ProfileMetaModel {
  email: string;
  phoneNumber: string | null;
  profilePicture: string;
  unreadNotifications: number; // unread notifications count

  address?: AddressModel; // Default address, if exists

  accountCapabilities?: AccountCapabilities;
}
