import { REGEX } from "../../../utils/regex";
import { AddressModel } from "../../../models/addressModel";
import { Errors } from "../../../types/form";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "../../../hooks/useDebounce";
import { useModifyAddress } from "../../../hooks/address/useModifyAddress";
import { useMounted } from "../../../hooks/useMounted";

import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";
import Input from "../../../components/Input";
import ToggleButton from "../../../components/ToggleButton";

import { Pencil } from "lucide-react";

interface ModifyProps {
  address: AddressModel;
  addresses: AddressModel[];
  close: () => void;
}

const Modify = ({ address, addresses, close }: ModifyProps) => {
  const isMounted = useMounted();

  const [newAddress, setNewAddress] = useState<AddressModel>({ ...address });

  const [errors, setErrors] = useState<Errors>({});

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
      // Validate zip
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
    0,
    [newAddress.zip]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        default: "",
      }));
    },
    0,
    [newAddress.default]
  );

  const modifyAddressMutation = useModifyAddress(
    () => {
      setTimeout(() => {
        if (isMounted()) {
          close();
        }
      }, 500);
    },
    (error) => {
      if (typeof error?.response?.data.message === "object") {
        Object.entries(
          error.response!.data.message as Record<string, string[]>
        ).forEach(([field, messages]: [string, string[]]) => {
          setErrors((prev) => ({
            ...prev,
            [field]: messages[0],
          }));
        });
      }
    }
  );

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!address) return;

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

      toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
      return Promise.reject("Empty inputs");
    }

    if (newAddress.zip && !REGEX.ZIP.test(newAddress.zip)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        zip: "Az irányítószámnak 4 számjegyből kell állnia.",
      }));
      return Promise.reject("Invalid zip");
    }

    // If the name is already in use and it's not the same address
    if (
      addresses.some(
        (adr) =>
          adr.name.toLowerCase() === newAddress.name.toLowerCase() &&
          adr.id !== newAddress.id
      )
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Ez a név már használatban van.",
      }));
      return Promise.reject("Name already in use");
    }

    if (Object.values(errors).some((x) => x !== "")) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      return Promise.reject("Invalid fields");
    }

    const modifyPromise = modifyAddressMutation.mutateAsync(newAddress);

    toast.promise(modifyPromise, {
      loading: "Cím módosítása folyamatban...",
      success: `A(z) "${newAddress.name}" cím módosítva.`,
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba a cím módosítása során.",
    });

    return modifyPromise;
  };

  return (
    <>
      <h1 className='modal__title'>
        ✏️ A(z)&nbsp;<span className='fc-blue-500'>"{address.name}"</span>
        &nbsp;cím szerkesztése
      </h1>
      <div className='modal__content'>
        <form>
          <Input
            type='text'
            name='mod_name'
            value={newAddress.name}
            label='Név'
            placeholder={address.name}
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
            name='mod_country'
            value={newAddress.country}
            label='Ország'
            placeholder={address.country}
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
              name='mod_city'
              value={newAddress.city}
              label='Város'
              placeholder={address.city}
              required
              onChange={(value) => {
                setNewAddress((prev) => ({ ...prev, city: value }));
              }}
              error={errors.city}
              success={!!newAddress.city && !errors.city}
            />
            <Input
              type='text'
              name='mod_zip'
              value={newAddress.zip}
              label='Irányítószám'
              placeholder={address.zip}
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
            name='mod_street'
            value={newAddress.street}
            label='Utca, házszám'
            placeholder={address.street || "pl. Kossuth Lajos utca 1."}
            onChange={(value) => {
              setNewAddress((prev) => ({ ...prev, street: value }));
            }}
            error={errors.street}
            success={!!newAddress.street && !errors.street}
          />
          <ToggleButton
            label='Alapértelmezett cím'
            className='mt-1'
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
          disabled={modifyAddressMutation.isPending}
          onClick={() => close()}
        />
        <StateButton
          className='primary'
          text='Módosítás'
          onClick={handleFormSubmit}>
          <Pencil />
        </StateButton>
      </div>
    </>
  );
};

export default Modify;
