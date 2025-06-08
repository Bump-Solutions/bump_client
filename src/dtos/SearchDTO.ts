export interface UserSearchDTO {
  username: string;
  email: string;
  bio: string;
  profile_picture: string | null;
  followers_count: number;
}

export interface ProductSearchDTO {
  id: number;
  title: string;
  label: string;
  description: string;
  username: string;
  created_at: string;
  image: string;
  product: {
    brand: string;
    model: string;
    color_way: string;
    colors: string;
  };
}
