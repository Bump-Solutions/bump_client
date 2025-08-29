import { REGEX } from "../../../utils/regex";
import { ROUTES } from "../../../routes/routes";

import { Errors } from "../../../types/form";
import { ProfileModel } from "../../../models/profileModel";
import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { useNavigate } from "react-router";

import { useState, useEffect, FormEvent } from "react";
import { useMounted } from "../../../hooks/useMounted";
import { useLogout } from "../../../hooks/auth/useLogout";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useDebounce } from "../../../hooks/useDebounce";
import { useUpdateProfile } from "../../../hooks/profile/useUpdateProfile";

import Spinner from "../../../components/Spinner";
import Input from "../../../components/Input";
import Phone from "../../../components/Phone";
import TextArea from "../../../components/TextArea";
import StateButton from "../../../components/StateButton";
import Back from "../../../components/Back";

import { Download } from "lucide-react";
import { toast } from "sonner";

const INITAL_DATA: Omit<ProfileModel, "profilePicture" | "profilePictureHash"> =
  {
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    address: {
      name: "",
      country: "",
      city: "",
      zip: "",
      street: "",
    },
  };

const ProfileInfoSettings = () => {
  const navigate = useNavigate();
  const { data, setData, isLoading } = usePersonalSettings();

  const [newData, setNewData] =
    useState<Omit<ProfileModel, "profilePicture" | "profilePictureHash">>(
      INITAL_DATA
    );

  const [errors, setErrors] = useState<Errors>({});

  const isMounted = useMounted();
  const logout = useLogout();
  const { auth } = useAuth();

  useEffect(() => {
    if (data) {
      setNewData({
        username: data.username || "",
        lastName: data.lastName || "",
        firstName: data.firstName || "",
        phoneNumber: data.phoneNumber || "",
        bio: data.bio || "",
        address: data.address || {
          name: "",
          country: "",
          city: "",
          zip: "",
          street: "",
        },
      });
    }
  }, [data]);

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
      if (newData.firstName && !REGEX.NAME.test(newData.firstName)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstName: "Hibás keresztnév formátum.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstName: "",
        }));
      }

      if (newData.lastName && !REGEX.NAME.test(newData.lastName)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastName: "Hibás vezetéknév formátum.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastName: "",
        }));
      }
    },
    250,
    [newData.firstName, newData.lastName]
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
    setData({
      username: newData.username,
      lastName: newData.lastName,
      firstName: newData.firstName,
      phoneNumber: newData.phoneNumber,
      bio: newData.bio,
      address: newData.address,
    });

    // logout user if username changed
    setTimeout(() => {
      if (isMounted()) {
        if (newData.username !== auth?.user?.username) {
          logout();
          toast.info("Kijelentkezés: a felhasználónév megváltozott.");
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
      firstname: newData.firstName,
      lastname: newData.lastName,
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

      toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
      return Promise.reject("Empty inputs");
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      return Promise.reject("Invalid fields");
    }

    const updatePromise = updateProfileMutation.mutateAsync(newData);

    toast.promise(updatePromise, {
      loading: "Adatok mentése folyamatban...",
      success: "Adatok mentve.",
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba az adatok mentése közben.",
    });

    return updatePromise;
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
              placeholder={data?.username}
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
                value={newData.lastName || ""}
                placeholder={data?.lastName || "pl. Minta"}
                label='Vezetéknév'
                required
                onChange={(value) => {
                  setNewData((prevData) => ({
                    ...prevData,
                    lastName: value,
                  }));
                }}
                error={errors.lastName}
                success={!!newData.lastName && !errors.lastName}
              />
              <Input
                type='text'
                name='st_firstname'
                value={newData.firstName || ""}
                label='Keresztnév'
                placeholder={data?.firstName || "pl. Minta"}
                required
                onChange={(value) => {
                  setNewData((prevData) => ({
                    ...prevData,
                    firstName: value,
                  }));
                }}
                error={errors.firstName}
                success={!!newData.firstName && !errors.firstName}
              />
            </div>
            <Phone
              name='st_phone'
              value={newData.phoneNumber || ""}
              label='Mobil telefonszám'
              placeholder={data?.phoneNumber || "+3630-123-4567"}
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
              value={newData.bio || ""}
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
