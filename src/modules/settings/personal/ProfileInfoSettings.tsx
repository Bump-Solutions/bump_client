import { REGEX } from "../../../utils/regex";
import { ROUTES } from "../../../routes/routes";
import { Address, NewAddress } from "../../../types/address";

import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { useNavigate } from "react-router";

import { useState, useEffect, FormEvent } from "react";
import { useMounted } from "../../../hooks/useMounted";
import { useLogout } from "../../../hooks/auth/useLogout";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useToast } from "../../../hooks/useToast";
import { useDebounce } from "../../../hooks/useDebounce";
import { useUpdateProfile } from "../../../hooks/profile/useUpdateProfile";

import Spinner from "../../../components/Spinner";
import Input from "../../../components/Input";
import Phone from "../../../components/Phone";
import TextArea from "../../../components/TextArea";
import StateButton from "../../../components/StateButton";
import Back from "../../../components/Back";

import { Download } from "lucide-react";

interface PersonalInfoSchema {
  username: string;
  lastname: string;
  firstname: string;
  phoneNumber: string;
  bio: string;
  address: NewAddress;
}

interface PersonalInfoFormErrors {
  username?: string;
  lastname?: string;
  firstname?: string;
  phoneNumber?: string;
}

const ProfileInfoSettings = () => {
  const navigate = useNavigate();
  const { formData, setFormData, isLoading } = usePersonalSettings();

  const [newData, setNewData] = useState<PersonalInfoSchema>({
    username: "",
    lastname: "",
    firstname: "",
    phoneNumber: "",
    bio: "",
    address: {
      name: "",
      country: "",
      city: "",
      zip: "",
      street: "",
    },
  });

  const [errors, setErrors] = useState<PersonalInfoFormErrors>({});

  const isMounted = useMounted();
  const logout = useLogout();
  const { auth } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (formData) {
      setNewData({
        username: formData.username || "",
        lastname: formData.last_name || "",
        firstname: formData.first_name || "",
        phoneNumber: formData.phone_number || "",
        bio: formData.bio || "",
        address: formData.address || {
          name: "",
          country: "",
          city: "",
          zip: "",
          street: "",
        },
      });
    }
  }, [formData]);

  useDebounce(
    () => {
      if (newData.username && !REGEX.USERNAME.test(newData.username)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Hibás felhasználónév formátum.",
        }));
      } else if (newData.username.length < 4) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username:
            "A felhasználónévnek legalább 4 karakter hosszúnak kell lennie.",
        }));
      } else if (newData.username.length > 16) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "A felhasználónév legfeljebb 16 karakter hosszú lehet.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "",
        }));
      }
    },
    250,
    [newData.username]
  );

  useDebounce(
    () => {
      if (newData.firstname && !REGEX.NAME.test(newData.firstname)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstname: "Hibás keresztnév formátum.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstname: "",
        }));
      }

      if (newData.lastname && !REGEX.NAME.test(newData.lastname)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastname: "Hibás vezetéknév formátum.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastname: "",
        }));
      }
    },
    250,
    [newData.firstname, newData.lastname]
  );

  useDebounce(
    () => {
      if (newData.phoneNumber && !REGEX.PHONE.test(newData.phoneNumber)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Hibás telefonszám. Formátum: +3630-123-4567",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "",
        }));
      }
    },
    500,
    [newData.phoneNumber]
  );

  const updateProfileMutation = useUpdateProfile((response) => {
    setFormData({
      username: newData.username,
      last_name: newData.lastname,
      first_name: newData.firstname,
      phone_number: newData.phoneNumber,
      bio: newData.bio,
      address: newData.address,
    });

    // logout user if username changed

    setTimeout(() => {
      if (isMounted()) {
        if (newData.username !== auth?.user?.username) {
          addToast("info", "Kijelentkezés: a felhasználónév megváltozott.");
          logout();
        } else {
          navigate(ROUTES.SETTINGS.ROOT);
        }
      }
    }, 500);
  });

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const inputFields = {
      username: newData.username,
      firstname: newData.firstname,
      lastname: newData.lastname,
      phoneNumber: newData.phoneNumber,
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

    if (Object.values(errors).some((error) => error)) {
      addToast("error", "Kérjük javítsd a hibás mezőket!");
      return Promise.reject("Invalid fields");
    }

    return updateProfileMutation.mutateAsync({
      username: newData.username,
      last_name: newData.lastname,
      first_name: newData.firstname,
      phone_number: newData.phoneNumber,
      bio: newData.bio,
      address: newData.address,
    });
  };

  return (
    <div className='page__wrapper'>
      {isLoading ? (
        <div className='relative py-3'>
          <Spinner />
        </div>
      ) : (
        <div className='form-box'>
          <Back to={ROUTES.SETTINGS.ROOT} className='link hide-mobile' />

          <h1 className='page__title'>Adatok frissítése</h1>
          <p className='page__desc mb-2'>
            <b>Figyelem!</b> A <i>felhasználónév</i> megváltoztatása esetén a
            rendszer automatikusan kijelentkeztet minden eszközről, ahol be vagy
            jelentkezve.
          </p>

          <form>
            <Input
              type='text'
              name='st_username'
              value={newData.username}
              label='Felhasználónév'
              placeholder={formData.username}
              required
              autoFocus
              onChange={(value) => {
                setNewData((prevData) => ({
                  ...prevData,
                  username: value,
                }));
              }}
              error={errors.username}
              success={!!newData.username && !errors.username}
            />
            <div className='field__wrapper'>
              <Input
                type='text'
                name='st_lastname'
                value={newData.lastname}
                placeholder={formData.last_name || "pl. Minta"}
                label='Vezetéknév'
                required
                onChange={(value) => {
                  setNewData((prevData) => ({
                    ...prevData,
                    lastname: value,
                  }));
                }}
                error={errors.lastname}
                success={!!newData.lastname && !errors.lastname}
              />
              <Input
                type='text'
                name='st_firstname'
                value={newData.firstname}
                label='Keresztnév'
                placeholder={formData.first_name || "pl. Minta"}
                required
                onChange={(value) => {
                  setNewData((prevData) => ({
                    ...prevData,
                    firstname: value,
                  }));
                }}
                error={errors.firstname}
                success={!!newData.firstname && !errors.firstname}
              />
            </div>
            <Phone
              name='st_phone'
              value={newData.phoneNumber}
              label='Mobil telefonszám'
              placeholder={formData.phone_number || "+3630-123-4567"}
              required
              onChange={(value) => {
                setNewData((prevData) => ({
                  ...prevData,
                  phoneNumber: value,
                }));
              }}
              error={errors.phoneNumber}
              success={!!newData.phoneNumber && !errors.phoneNumber}
            />
            <TextArea
              name='bio'
              value={newData.bio}
              label='Bemutatkozás'
              placeholder='Mondj valamit magadról'
              onChange={(value) => {
                setNewData((prevData) => ({
                  ...prevData,
                  bio: value,
                }));
              }}
              maxLength={1000}
              rows={7}
            />

            <StateButton
              text='Változtatások mentése'
              className='primary'
              onClick={handleFormSubmit}>
              <Download />
            </StateButton>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoSettings;
