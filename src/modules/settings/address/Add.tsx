import { REGEX } from "../../../utils/regex";
import { FormEvent, useState } from "react";
import { Errors } from "../../../types/form";
import { useToast } from "../../../hooks/useToast";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAddAddress } from "../../../hooks/address/useAddAddress";
import { useGetCurrentLocation } from "../../../hooks/address/useGetCurrentLocation";
import { useMounted } from "../../../hooks/useMounted";
import { CreateAddressDTO } from "../../../dtos/AddressDTO";
import { AddressModel } from "../../../models/addressModel";

import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";
import Input from "../../../components/Input";
import ToggleButton from "../../../components/ToggleButton";
import Spinner from "../../../components/Spinner";

import { CirclePlus } from "lucide-react";

interface AddProps {
  addresses: AddressModel[];
  close: () => void;
}

const Add = ({ addresses, close }: AddProps) => {
  const [newAddress, setNewAddress] = useState<CreateAddressDTO>({
    name: "",
    country: "",
    city: "",
    zip: "",
    street: "",
    default: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const { addToast } = useToast();
  const isMounted = useMounted();

  const { loading } = useGetCurrentLocation((resp) => {
    setNewAddress((prev) => ({
      ...prev,
      name: resp.name,
      country: resp.address.country,
      city: resp.address.city,
      zip: resp.address.postcode,
      street: resp.address.road,
    }));
  });

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "",
      }));
    },
    250,
    [newAddress.name]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        country: "",
      }));
    },
    250,
    [newAddress.country]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        city: "",
      }));
    },
    250,
    [newAddress.city]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        street: "",
      }));
    },
    250,
    [newAddress.street]
  );

  useDebounce(
    () => {
      if (newAddress.zip && !REGEX.ZIP.test(newAddress.zip)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          zip: "Az irányítószámnak 4 számjegyből kell állnia.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          zip: "",
        }));
      }
    },
    250,
    [newAddress.zip]
  );

  const addAddressMutation = useAddAddress(
    () => {
      setTimeout(() => {
        if (isMounted()) {
          close();
        }
      }, 500);
    },
    (error) => {
      if (typeof error?.response?.data.message === "object") {
        addToast("error", "Kérjük javítsd a hibás mezőket!");
        Object.entries(
          error.response!.data.message as Record<string, string[]>
        ).forEach(([field, messages]: [string, string[]]) => {
          setErrors((prev) => ({
            ...prev,
            [field]: messages[0],
          }));
        });
      } else {
        addToast(
          error?.response?.data.type || "error",
          error?.response?.data.message
        );
      }
    }
  );

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const inputFields = {
      name: newAddress.name,
      country: newAddress.country,
      city: newAddress.city,
      zip: newAddress.zip,
    };

    const emptyInputs = (
      Object.keys(inputFields) as Array<keyof typeof inputFields>
    ).filter((key) => inputFields[key] === "");

    if (emptyInputs.length > 0) {
      emptyInputs.forEach((input) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [input]: "A mező kitöltése kötelező.",
        }));
      });
      addToast("error", "Kérjük töltsd ki a csillaggal jelölt mezőket!");
      return Promise.reject("Empty inputs");
    }

    if (newAddress.zip && !REGEX.ZIP.test(newAddress.zip)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        zip: "Az irányítószámnak 4 számjegyből kell állnia.",
      }));
      return Promise.reject("Invalid zip");
    }

    if (
      addresses.some(
        (address) =>
          address.name.toLowerCase() === newAddress.name.toLowerCase()
      )
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Ez a név már használatban van.",
      }));
      return Promise.reject("Name already in use");
    }

    if (Object.values(errors).some((x) => x !== "")) {
      addToast("error", "Kérjük javítsd a hibás mezőket!");
      return Promise.reject("Invalid fields");
    }

    return addAddressMutation.mutateAsync(newAddress);
  };

  return loading ? (
    <div className='py-5'>
      <Spinner />
    </div>
  ) : (
    <>
      <h1 className='modal__title'>🏠 Új lakcím hozzáadása</h1>
      <div className='modal__content'>
        <form>
          <Input
            type='text'
            name='add_name'
            value={newAddress.name}
            label='Név'
            placeholder='pl. Otthoni cím'
            required
            onChange={(value) => {
              setNewAddress((prev) => ({ ...prev, name: value }));
            }}
            autoFocus
            error={errors.name}
            success={!!newAddress.name && !errors.name}
          />
          <Input
            type='text'
            name='add_country'
            value={newAddress.country}
            label='Ország'
            placeholder='pl. Magyarország'
            required
            onChange={(value) => {
              setNewAddress((prev) => ({ ...prev, country: value }));
            }}
            error={errors.country}
            success={!!newAddress.country && !errors.country}
          />
          <div className='field__wrapper'>
            <Input
              type='text'
              name='add_city'
              value={newAddress.city}
              label='Város'
              placeholder='pl. Budapest'
              required
              onChange={(value) => {
                setNewAddress((prev) => ({ ...prev, city: value }));
              }}
              error={errors.city}
              success={!!newAddress.city && !errors.city}
            />
            <Input
              type='text'
              name='add_zip'
              value={newAddress.zip}
              label='Irányítószám'
              placeholder='pl. 1111'
              required
              onChange={(value) => {
                setNewAddress((prev) => ({ ...prev, zip: value }));
              }}
              error={errors.zip}
              success={!!newAddress.zip && !errors.zip}
            />
          </div>
          <Input
            type='text'
            name='add_street'
            value={newAddress.street}
            label='Utca, házszám'
            placeholder='pl. Kossuth Lajos utca 1.'
            onChange={(value) => {
              setNewAddress((prev) => ({ ...prev, street: value }));
            }}
            error={errors.street}
            success={!!newAddress.street && !errors.street}
          />
          <ToggleButton
            className='mt-1'
            label='Alapértelmezett cím'
            value={newAddress.default}
            onChange={(value) => {
              setNewAddress((prevState) => ({ ...prevState, default: value }));
            }}
            error={errors.default}
          />
        </form>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={addAddressMutation.isPending}
          onClick={() => close()}
        />
        <StateButton
          className='primary'
          text='Hozzáadás'
          onClick={handleFormSubmit}>
          <CirclePlus />
        </StateButton>
      </div>
    </>
  );
};

export default Add;
