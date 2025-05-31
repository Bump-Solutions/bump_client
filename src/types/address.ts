export interface NewAddress {
  name: string;
  country: string;
  city: string;
  zip: string;
  street: string;
  default?: boolean;
}

export interface Address extends NewAddress {
  id: number;
}
