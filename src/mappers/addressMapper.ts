import { CreateAddressDTO, FetchedAddressDTO } from "../dtos/AddressDTO";
import { AddressModel } from "../models/addressModel";

export function toCreateAddressDTO(
  input: Omit<AddressModel, "id">
): CreateAddressDTO {
  return {
    name: input.name,
    country: input.country,
    city: input.city,
    zip: input.zip,
    street: input.street,
    default: input.default ?? false,
  };
}

export function fromFetchedAddressDTO(dto: FetchedAddressDTO): AddressModel {
  return {
    id: dto.id,
    name: dto.name,
    country: dto.country,
    city: dto.city,
    zip: dto.zip,
    street: dto.street,
    default: dto.default ?? false,
  };
}
