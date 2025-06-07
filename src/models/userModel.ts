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

  profilePicture: string;
  profilePictureHash: string;
  profileBackgroundColor: string;
  profilePictureColorPalette: string;

  chatName: string;

  following: boolean; // If the session user follows this user
  followersCount: number;
  followingsCount: number;
}
