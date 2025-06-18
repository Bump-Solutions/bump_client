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

/**
 * A backend /profile/meta GET végpontja által visszaadott DTO.
 */
export interface FetchedProfileMetaDTO {
  profile_picture: string;
  unread_notifications: number; // unread notifications count
}
