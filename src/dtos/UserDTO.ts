/**
 * A backend “GET /user/get_user_data válaszában érkező felhasználói adatok.
 * Pontosan tükrözi a szerver által visszaadott nyers JSON‐mezőket.
 */
export interface FetchedUserDTO {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  joined: string;

  profile_picture: string | null;
  profile_picture_hash: string | null;
  profile_background_color: string | null;
  profile_picture_color_palette: string | null;

  chat_name: string | null; // A session user es a felhasznalo kozotti chat azonositoja
  chat_created_at: string | null;

  followers_count: number; // A felhasznalot koveto felhasznalok szama
  following: boolean; // A session user koveti-e a felhasznalot
  followings_count: number; // A felhasznalo altal kovetett felhasznalok szama
}
