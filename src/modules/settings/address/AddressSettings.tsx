import { ROUTES } from "../../../routes/routes";
import { useEffect, useReducer } from "react";
import { AddressModel } from "../../../models/addressModel";

import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { useListAddresses } from "../../../hooks/address/useListAddresses";
import { useToast } from "../../../hooks/useToast";

import Spinner from "../../../components/Spinner";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Add from "./Add";
import Modify from "./Modify";
import Delete from "./Delete";
import Back from "../../../components/Back";

import { Check, Pencil, Trash, CirclePlus } from "lucide-react";

enum ACTIONS {
  OPEN = "open",
  CLOSE = "close",
}

enum CONTENTS {
  ADD = "add",
  MODIFY = "modify",
  DELETE = "delete",
}

interface AddressFormState {
  isOpen: boolean;
  content: CONTENTS | null;
  address: AddressModel | null;
}

type AddressFormAction =
  | { type: ACTIONS.OPEN; content: CONTENTS; address?: AddressModel }
  | { type: ACTIONS.CLOSE };

const reducer = (
  state: AddressFormState,
  action: AddressFormAction
): AddressFormState => {
  switch (action.type) {
    case ACTIONS.OPEN:
      return {
        ...state,
        isOpen: true,
        content: action.content,
        address: action.address || null,
      };
    case ACTIONS.CLOSE:
      return {
        ...state,
        isOpen: false,
        content: null,
        address: null,
      };
    default:
      return state;
  }
};

const AddressSettings = () => {
  const INITIAL_STATE: AddressFormState = {
    isOpen: false,
    content: null,
    address: null,
  };

  const { setData } = usePersonalSettings();

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const { addToast } = useToast();

  const {
    data: addresses = [],
    isLoading,
    isError,
    error,
  } = useListAddresses();

  useEffect(() => {
    if (isError) {
      addToast(
        error?.response?.data.type || "error",
        error?.response?.data.message
      );
    }
  }, [isError]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((address) => address.default);
      if (defaultAddress) {
        setData({
          address: {
            id: defaultAddress.id,
            name: defaultAddress.name,
            country: defaultAddress.country,
            city: defaultAddress.city,
            zip: defaultAddress.zip,
            street: defaultAddress.street,
            default: defaultAddress.default,
          },
        });
      }
    }
  }, [addresses, setData]);

  const openForm = (content: CONTENTS, address?: AddressModel) => {
    dispatch({ type: ACTIONS.OPEN, content, address });
  };

  const closeForm = () => {
    dispatch({ type: ACTIONS.CLOSE });
  };

  return (
    <>
      <Modal isOpen={state.isOpen} close={closeForm}>
        {state.content === CONTENTS.ADD && (
          <Add addresses={addresses} close={closeForm} />
        )}
        {state.content === CONTENTS.MODIFY && state.address && (
          <Modify
            address={state.address}
            addresses={addresses}
            close={closeForm}
          />
        )}
        {state.content === CONTENTS.DELETE && state.address && (
          <Delete address={state.address} close={closeForm} />
        )}
      </Modal>

      <div className='page__wrapper'>
        <div className='form-box'>
          <Back to={ROUTES.SETTINGS.ROOT} className='link hide-mobile' />

          <h1 className='page__title'>Címek kezelése</h1>
          <p className='page__desc mb-2'>
            Itt kezelheted a címeidet és adhatsz hozzá újakat.
          </p>

          {isLoading ? (
            <div className='relative py-3 w-full'>
              <Spinner />
            </div>
          ) : (
            <div className='address__wrapper'>
              <div className='address-box'>
                <article className='add' onClick={() => openForm(CONTENTS.ADD)}>
                  <CirclePlus />
                  <h4>Új cím hozzáadása</h4>
                </article>
              </div>

              {addresses
                .sort((_, b) => (b.default ? 1 : -1))
                .map((address: AddressModel, index: number) => {
                  return (
                    <article key={index} className='address'>
                      <Button
                        className='secondary delete'
                        onClick={() => openForm(CONTENTS.DELETE, address)}>
                        <Trash />
                      </Button>

                      <h5>Lakcím</h5>
                      <h4 className='truncate'>{address.name}</h4>
                      <div>
                        <p className='truncate'>{address.street}</p>
                        <p className='truncate'>{address.zip}</p>
                        <p className='truncate'>{address.city}</p>
                        <p className='truncate'>{address.country}</p>
                      </div>

                      {address.default && (
                        <span className='address--default'>
                          <Check strokeWidth={3} className='svg-18' />
                          Alapértelmezett cím
                        </span>
                      )}

                      <Button
                        className='primary'
                        text='Szerkesztés'
                        onClick={() => openForm(CONTENTS.MODIFY, address)}>
                        <Pencil />
                      </Button>
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressSettings;
