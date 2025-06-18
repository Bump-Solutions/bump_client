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

export interface ProfileMetaModel {
  profilePicture: string;
  unreadNotifications: number; // unread notifications count
}
