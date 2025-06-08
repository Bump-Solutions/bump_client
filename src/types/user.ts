export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  bio?: string;
  address?: string;
  joined?: string;
  profile_picture?: string;
  profile_picture_hash?: string;
  profile_picture_color_palette?: string; // a string of colors separated by semicolons
  profile_background_color?: string;
  followers_count?: number;
  followings_count?: number;
  following?: boolean; // if the authenticated user is following this user
  chat_name?: string; // the name of the chat group for this user
}
