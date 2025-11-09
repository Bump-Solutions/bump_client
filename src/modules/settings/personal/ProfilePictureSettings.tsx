import { useStore } from "@tanstack/react-form";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useAppForm } from "../../../hooks/form/hooks";
import { useUploadProfilePicture } from "../../../hooks/profile/useUploadProfilePicture";
import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { useMounted } from "../../../hooks/useMounted";
import { ROUTES } from "../../../routes/routes";
import {
  profilePictureSchema,
  ProfilePictureValues,
} from "../../../schemas/profileSchema";
import {
  getImageDominantColor,
  getImageDominantColorAndPalette,
} from "../../../utils/colors";

import Back from "../../../components/Back";
import StateButton from "../../../components/StateButton";

import { Upload } from "lucide-react";

const defaultValues: ProfilePictureValues = {
  image: undefined as unknown as File,
  changeBackground: false,
};

const ProfilePictureSettings = () => {
  const { auth } = useAuth();
  const { setData } = usePersonalSettings();

  const [colorPreview, setColorPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const isMounted = useMounted();

  const uploadMutation = useUploadProfilePicture((response) => {
    // Kontextus
    setData({ profilePicture: response.data.message });

    setTimeout(() => {
      if (isMounted()) {
        navigate(ROUTES.SETTINGS.ROOT, { replace: true });
      }
    }, 500);
  });

  const form = useAppForm({
    defaultValues,

    validators: { onSubmit: profilePictureSchema },

    onSubmit: async ({ value, formApi }) => {
      const file = value.image;
      const url = URL.createObjectURL(file);

      try {
        // Előfeldolgozás: domináns szín + paletta
        const { dominantColor, palette } =
          await getImageDominantColorAndPalette(url, 12);
        const paletteString = palette.join(";");

        const data: Record<string, any> = {
          profile_picture: file,
          profile_picture_color_palette: paletteString,
        };

        if (value.changeBackground) {
          data.profile_background_color = dominantColor;
        }

        const uploadPromise = uploadMutation.mutateAsync(data);

        toast.promise(uploadPromise, {
          loading: "Kép feltöltése folyamatban...",
          success: "Profilképed frissült.",
          error: "Hiba történt a kép feldolgozása közben.",
        });

        await uploadPromise;
      } finally {
        URL.revokeObjectURL(url);
      }

      formApi.reset();
    },

    onSubmitInvalid: async ({ value, formApi }) => {
      toast.warning("Először tölts fel egy képet a módosításhoz.");
      throw new Error("Invalid form submission");
    },
  });

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await form.handleSubmit();
    if (!form.store.state.isValid) {
      throw new Error("Invalid form submission");
    }
  };

  // Egyszerű preview a mezőértékből (a FormDropzone beállítja a File-t)
  const file = useStore(form.store, (state) => state.values.image);
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  // Domináns szín számítás *előnézetkor* is (nem csak submitkor)
  useEffect(() => {
    if (!previewUrl) {
      setColorPreview(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const dominantColor = await getImageDominantColor(previewUrl);
        if (!cancelled) {
          setColorPreview(dominantColor);
        }
      } catch (error) {}
    })();

    return () => {
      cancelled = true;
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className='page__wrapper'>
      <div className='form-box'>
        <Back to={ROUTES.SETTINGS.ROOT} className='link hide-mobile' />

        <h1 className='page__title'>Fénykép feltöltése</h1>
        <p className='page__desc mb-2'>
          Maximum 1 darab képet tölthetsz fel, amely nem lehet nagyobb mint 1MB.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          {/* Fájlmező */}
          <form.AppField
            name='image'
            validators={{
              onChange: profilePictureSchema.shape.image,
            }}>
            {(field) => (
              <field.Dropzone
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                multiple={false}
                maxFiles={1}
                maxSize={1 * 1024 * 1024}
                required
              />
            )}
          </form.AppField>
          <p className='page__desc mb-2'>
            Amikor új profilképet állítasz be, automatikusan kiválasztunk egy
            színt, amit háttérként használhatsz a profilodon. Ezt a színt
            bármikor megváltoztathatod a{" "}
            <Link
              to={ROUTES.PROFILE(auth?.user?.username!).ROOT}
              className='link'>
              profil
            </Link>{" "}
            oldalon.
          </p>

          {/* Előnézet + domináns szín jelző */}
          {previewUrl && (
            <div className='img-prev'>
              <img src={previewUrl} alt={file.name} />
              <div
                className='color-prev'
                style={{ backgroundColor: colorPreview ?? "transparent" }}
                aria-label={colorPreview ?? "no-color"}
                title={colorPreview ?? ""}
              />
            </div>
          )}

          {/* Háttérszín beállítás flag */}
          <form.AppField
            name='changeBackground'
            validators={{
              onChange: profilePictureSchema.shape.changeBackground,
            }}>
            {(field) => (
              <field.ToggleButton text='Profil háttérszín beállítása a kép alapján' />
            )}
          </form.AppField>

          <StateButton
            type='submit'
            className='primary'
            text='Kép módosítása'
            onClick={handleSubmit}>
            <Upload />
          </StateButton>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureSettings;
