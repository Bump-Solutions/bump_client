/**
 * A React‐alkalmazásban a felhasználót ábrázoló modell.
 * CamelCase mezőnevekkel, csak azokkal a mezőkkel, amire a UI‐nak szüksége van.
 */
export interface UserModel {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  joined: string;

  profilePicture: string | null;
  profilePictureHash: string | null;
  profileBackgroundColor: string | null;
  profilePictureColorPalette: string | null;

  chatName: string | null;

  following: boolean; // If the session user follows this user
  followersCount: number;
  followingsCount: number;
}

export interface FollowerModel {
  userId: number;
  username: string;
  profilePicture: string | null;
  myFollowing: boolean; // If the session user follows this user
  role: string;
}

export interface FollowersPageModel {
  followers: FollowerModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number;
}

export interface FollowingModel {
  userId: number;
  username: string;
  profilePicture: string | null;
  myFollowing: boolean; // If the session user follows this user
  role: string;
}

export interface FollowingsPageModel {
  followings: FollowingModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number;
}
