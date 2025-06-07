export interface CreateAddressDTO {
  name: string;
  country: string;
  city: string;
  zip: string;
  street: string;
  default: boolean;
}

export interface FetchedAddressDTO {
  id: number;
  name: string;
  country: string;
  city: string;
  zip: string;
  street: string;
  default: boolean;
}
