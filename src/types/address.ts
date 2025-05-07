export interface Address {
  id?: number;
  name: string;
  country: string;
  city: string;
  zip: string;
  street: string;
  default?: boolean;
}
