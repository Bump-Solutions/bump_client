import { CreateAddressDTO, FetchedAddressDTO } from "../dtos/AddressDTO";
import { AddressModel } from "../models/addressModel";

export function toCreateAddressDTO(model: AddressModel): CreateAddressDTO {
  return {
    name: model.name,
    country: model.country,
    city: model.city,
    zip: model.zip,
    street: model.street,
    default: model.default ?? false,
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
