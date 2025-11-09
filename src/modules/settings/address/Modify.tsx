import { addressSchema, AddressValues } from "../../../schemas/addressSchema";
import { useAppForm } from "../../../hooks/form/hooks";
import { AddressModel } from "../../../models/addressModel";

import { MouseEvent } from "react";
import { toast } from "sonner";
import { useModifyAddress } from "../../../hooks/address/useModifyAddress";
import { useMounted } from "../../../hooks/useMounted";

import FieldGroup from "../../../components/form/FieldGroup";
import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";

import { Pencil } from "lucide-react";

type ModifyProps = {
  address: AddressModel;
  addresses: AddressModel[];
  close: () => void;
};

const Modify = ({ address, addresses, close }: ModifyProps) => {
  const isMounted = useMounted();

  const defaultValues: AddressValues = {
    name: address.name,
    country: address.country,
    city: address.city,
    zip: String(address.zip),
    street: address.street || "",
    default: Boolean(address.default),
  };

  const form = useAppForm({
    defaultValues,

    validators: {
      onChange: addressSchema,

      onSubmitAsync: async ({ value }) => {
        // Név egyediség
        const taken = addresses
          .filter((a) => a.id !== address.id)
          .some(
            (a) =>
              a.name.trim().toLowerCase() === value.name.trim().toLowerCase()
          );

        if (taken) {
          return {
            fields: {
              name: "Ez a név már használatban van.",
            },
          };
        }

        return null;
      },
    },

    onSubmit: async ({ value, formApi }) => {
      const modifyPromise = modifyAddressMutation.mutateAsync({
        id: address.id!,
        ...value,
      });

      toast.promise(modifyPromise, {
        loading: "Cím módosítása folyamatban...",
        success: `A(z) "${value.name}" cím módosítva.`,
        error: (err) => "Hiba a cím módosítása során.",
      });

      await modifyPromise;

      // formApi.reset();
    },

    onSubmitInvalid: async ({ value, formApi }) => {
      throw new Error("Invalid form submission");
    },
  });

  const modifyAddressMutation = useModifyAddress(
    () => {
      setTimeout(() => {
        if (isMounted()) {
          close();
        }
      }, 500);
    }
    /*
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
    */
  );

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await form.handleSubmit();
    if (!form.store.state.isValid) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      throw new Error("Invalid form submission");
    }
  };

  return (
    <>
      <h1 className='modal__title'>
        ✏️ A(z)&nbsp;<span className='fc-blue-500'>"{address.name}"</span>
        &nbsp;cím szerkesztése
      </h1>

      <div className='modal__content'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <form.AppField
            name='name'
            validators={{
              onChange: addressSchema.shape.name,
              onBlur: ({ value }) => {
                const taken = addresses
                  .filter((a) => a.id !== address.id)
                  .some(
                    (a) =>
                      a.name.trim().toLowerCase() === value.trim().toLowerCase()
                  );

                return taken ? "Ez a név már használatban van." : undefined;
              },
            }}>
            {(field) => (
              <field.Input
                type='text'
                label='Név'
                required
                placeholder='pl. Otthoni cím'
                autoFocus
                tabIndex={1}
              />
            )}
          </form.AppField>

          <form.AppField
            name='country'
            validators={{ onChange: addressSchema.shape.country }}>
            {(field) => (
              <field.Input
                type='text'
                label='Ország'
                required
                placeholder='pl. Magyarország'
                tabIndex={2}
              />
            )}
          </form.AppField>

          <FieldGroup columns={2}>
            <form.AppField
              name='city'
              validators={{ onChange: addressSchema.shape.city }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Város'
                  required
                  placeholder='pl. Budapest'
                  tabIndex={3}
                />
              )}
            </form.AppField>

            <form.AppField
              name='zip'
              validators={{ onChange: addressSchema.shape.zip }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Irányítószám'
                  required
                  placeholder='pl. 1111'
                  tabIndex={4}
                />
              )}
            </form.AppField>
          </FieldGroup>

          <form.AppField
            name='street'
            validators={{ onChange: addressSchema.shape.street }}>
            {(field) => (
              <field.Input
                type='text'
                label='Utca, házszám'
                placeholder='pl. Kossuth Lajos utca 1.'
                tabIndex={5}
              />
            )}
          </form.AppField>

          <form.AppField
            name='default'
            validators={{ onChange: addressSchema.shape.default }}>
            {(field) => (
              <field.ToggleButton
                text='Alapértelmezett cím'
                tabIndex={6}
                className='mt-1'
              />
            )}
          </form.AppField>
        </form>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={modifyAddressMutation.isPending}
          onClick={() => close()}
          tabIndex={7}
        />
        <StateButton
          className='primary'
          text='Módosítás'
          onClick={handleSubmit}
          tabIndex={8}>
          <Pencil />
        </StateButton>
      </div>
    </>
  );
};

export default Modify;
