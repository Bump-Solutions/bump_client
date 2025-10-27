import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppForm } from "../../../hooks/form/hooks";
import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { ROUTES } from "../../../routes/routes";
import {
  profileInfoSchema,
  ProfileInfoValues,
} from "../../../schemas/profileSchema";

import { useAuth } from "../../../hooks/auth/useAuth";
import { useLogout } from "../../../hooks/auth/useLogout";
import { useUpdateProfile } from "../../../hooks/profile/useUpdateProfile";
import { useMounted } from "../../../hooks/useMounted";

import Back from "../../../components/Back";
import FieldGroup from "../../../components/form/FieldGroup";
import Spinner from "../../../components/Spinner";
import StateButton from "../../../components/StateButton";

import { Download } from "lucide-react";

const defaultValues: ProfileInfoValues = {
  username: "",
  lastName: "",
  firstName: "",
  phoneNumber: "",
  bio: "",
};

const ProfileInfoSettings = () => {
  const { auth } = useAuth();
  const { data, setData, isLoading } = usePersonalSettings();

  const navigate = useNavigate();
  const isMounted = useMounted();

  const logout = useLogout();

  const form = useAppForm({
    defaultValues: data
      ? {
          username: data.username || "",
          lastName: data.lastName || "",
          firstName: data.firstName || "",
          phoneNumber: data.phoneNumber || "",
          bio: data.bio || "",
        }
      : defaultValues,

    validators: {
      onSubmit: profileInfoSchema,
    },

    onSubmit: async ({ value, formApi }) => {
      const updatePromise = updateProfileMutation.mutateAsync(value);

      toast.promise(updatePromise, {
        loading: "Adatok mentése folyamatban...",
        success: "Adatok mentve.",
        error: (err) =>
          "Hiba az adatok mentése közben. Kérjük, próbáld újra később.",
      });

      await updatePromise;

      formApi.reset();
    },

    onSubmitInvalid: ({ value, formApi }) => {
      const requiredFields = [
        value.username,
        value.lastName,
        value.firstName,
        value.phoneNumber,
      ];

      if (requiredFields.some((field) => !field || field.trim() === "")) {
        toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
      } else {
        toast.error("Kérjük javítsd a hibás mezőket!");
      }

      throw new Error("Invalid form submission");
    },
  });

  const updateProfileMutation = useUpdateProfile((response) => {
    const values = form.store.state.values;
    if (!values) return;

    // React Query cache merge (optimistic UX)
    setData({
      username: values.username,
      lastName: values.lastName,
      firstName: values.firstName,
      phoneNumber: values.phoneNumber,
      bio: values.bio,
    });

    // Username változás esetén: logout + info, különben vissza a Settings-re
    setTimeout(() => {
      if (isMounted()) {
        if (values.username !== auth?.user?.username) {
          logout();
          toast.info("Kijelentkezés: a felhasználónév megváltozott.");
        } else {
          navigate(ROUTES.SETTINGS.ROOT, { replace: true });
        }
      }
    }, 500);
  });

  if (isLoading) {
    return (
      <div className='page__wrapper'>
        <div className='relative py-3'>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className='page__wrapper'>
      <div className='form-box'>
        <Back to={ROUTES.SETTINGS.ROOT} className='link hide-mobile' />

        <h1 className='page__title'>Adatok frissítése</h1>
        <p className='page__desc mb-2'>
          <strong>Figyelem!</strong> A <i>felhasználónév</i> megváltoztatása
          esetén a rendszer automatikusan kijelentkeztet minden eszközről, ahol
          be vagy jelentkezve.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          {/* Felhasználónév */}
          <form.AppField
            name='username'
            validators={{
              onChange: profileInfoSchema.shape.username,
            }}>
            {(field) => (
              <field.Input
                type='text'
                label='Felhasználónév'
                required
                placeholder={data?.username}
                autoFocus
                tabIndex={1}
              />
            )}
          </form.AppField>

          {/* Vezetéknév + Keresztnév */}
          <FieldGroup columns={2}>
            <form.AppField
              name='lastName'
              validators={{
                onChange: profileInfoSchema.shape.lastName,
              }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Vezetéknév'
                  required
                  placeholder={data?.lastName || "pl. Minta"}
                  tabIndex={2}
                />
              )}
            </form.AppField>

            <form.AppField
              name='firstName'
              validators={{
                onChange: profileInfoSchema.shape.firstName,
              }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Keresztnév'
                  required
                  placeholder={data?.firstName || "pl. Minta"}
                  tabIndex={3}
                />
              )}
            </form.AppField>
          </FieldGroup>

          {/* Telefonszám */}
          <form.AppField
            name='phoneNumber'
            validators={{
              onChange: profileInfoSchema.shape.phoneNumber,
            }}>
            {(field) => (
              <field.Phone
                label='Mobil telefonszám'
                required
                placeholder={data?.phoneNumber || "+3630-123-4567"}
                tabIndex={4}
              />
            )}
          </form.AppField>

          {/* Bemutatkozás */}
          <form.AppField
            name='bio'
            validators={{ onChange: profileInfoSchema.shape.bio }}>
            {(field) => (
              <field.TextArea
                label='Bemutatkozás'
                placeholder='Mondj valamit magadról'
                tabIndex={5}
                maxLength={500}
                rows={7}
              />
            )}
          </form.AppField>

          <StateButton
            type='submit'
            text='Változtatások mentése'
            className='primary'
            onClick={form.handleSubmit}
            tabIndex={6}>
            <Download />
          </StateButton>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfoSettings;
