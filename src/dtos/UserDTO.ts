/**
 * A backend “GET /user/get_user_data válaszában érkező felhasználói adatok.
 * Pontosan tükrözi a szerver által visszaadott nyers JSON‐mezőket.
 */
export interface FetchedUserDTO {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  joined: string;

  profile_picture: string | null;
  profile_picture_hash: string | null;
  profile_background_color: string | null;
  profile_picture_color_palette: string | null;

  chat_name: string | null; // A session user es a felhasznalo kozotti chat azonositoja
  chat_created_at: string | null;

  following: boolean; // A session user koveti-e a felhasznalot
  followers_count: number; // A felhasznalot koveto felhasznalok szama
  followings_count: number; // A felhasznalo altal kovetett felhasznalok szama
}

export interface FollowerDTO {
  user_id: number;
  username: string;
  profile_picture: string | null;
  my_following: boolean;
  role: string;
}

export interface FollowersPageDTO {
  followers: FollowerDTO[];
  next: number | null;
  previous: string | null;
  count: number;
}

export interface FollowingDTO {
  following_user_id: number;
  username: string;
  profile_picture: string | null;
  my_following: boolean;
  role: string;
}

export interface FollowingsPageDTO {
  followings: FollowingDTO[];
  next: number | null;
  previous: string | null;
  count: number;
}
