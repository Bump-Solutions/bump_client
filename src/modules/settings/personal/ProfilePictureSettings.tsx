import { ROUTES } from "../../../routes/routes";
import { UploadedFile } from "../../../types/form";
import cuid from "cuid";
import { FormEvent, useState } from "react";
import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { useUploadProfilePicture } from "../../../hooks/profile/useUploadProfilePicture";
import { useNavigate, Link } from "react-router";
import { useMounted } from "../../../hooks/useMounted";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useToast } from "../../../hooks/useToast";
import {
  getImageDominantColor,
  getImageDominantColorAndPalette,
} from "../../../utils/functions";

import Back from "../../../components/Back";
import Dropzone from "../../../components/Dropzone";
import ToggleButton from "../../../components/ToggleButton";
import StateButton from "../../../components/StateButton";

import { Upload } from "lucide-react";

const ProfilePictureSettings = () => {
  const navigate = useNavigate();
  const { setFormData } = usePersonalSettings();

  const [images, setImages] = useState<UploadedFile[]>([]);
  const [colorPreview, setColorPreview] = useState<string | null>(null);
  const [changeBackground, setChangeBackground] = useState<boolean>(false);

  const isMounted = useMounted();
  const { auth, setAuth } = useAuth();
  const { addToast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    setImages([]);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prevState) => [
            ...prevState,
            {
              id: cuid(),
              file,
              dataUrl: e.target.result as string,
              name: file.name,
              size: file.size,
              type: file.type,
            },
          ]);
        }

        getImageDominantColor(URL.createObjectURL(file))
          .then((color) => {
            setColorPreview(color);
          })
          .catch(() => {
            addToast("error", "Hiba történt a kép feldolgozása során.");
          });
      };

      reader.readAsDataURL(file);
    });
  };

  const onDropRejected = (fileRejections: { errors: { code: string }[] }[]) => {
    const errorCode = fileRejections[0]?.errors[0]?.code;
    switch (errorCode) {
      case "file-too-large":
        addToast("error", "A fájl mérete túl nagy. A megengedett méret 1MB.");
        break;
      case "file-invalid-type":
        addToast("error", "Hibás fájl formátum.");
        break;
      default:
        addToast("error", "Hiba történt a fájl feltöltése során.");
        break;
    }
  };

  const onFileDialogCancel = () => {
    setImages([]);
  };

  const uploadProfilePictureMutation = useUploadProfilePicture((response) => {
    setFormData({
      profile_picture: response.data.message,
    });

    setAuth((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        profile_picture: response.data.message,
      },
    }));

    setTimeout(() => {
      if (isMounted) {
        navigate(ROUTES.SETTINGS.ROOT);
      }
    }, 500);
  });

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      addToast("warning", "Először tölts fel egy képet a módosításhoz.");
      return Promise.reject("No image uploaded");
    }

    try {
      const { dominantColor, palette } = await getImageDominantColorAndPalette(
        URL.createObjectURL(images[0].file),
        12
      );

      const paletteString = palette.join(";");

      const data: Record<string, any> = {
        profile_picture: images[0].file,
        profile_picture_color_palette: paletteString,
      };

      if (changeBackground) {
        data.profile_background_color = dominantColor;
      }

      await uploadProfilePictureMutation.mutateAsync(data);
    } catch {
      addToast("error", "Hiba történt a kép feldolgozása során.");
      return Promise.reject("Image error");
    }
  };

  return (
    <div className='page__wrapper'>
      <div className='form-box'>
        <Back to={ROUTES.SETTINGS.ROOT} />

        <h1 className='page__title'>Fénykép feltöltése</h1>
        <p className='page__desc mb-2'>
          Maximum 1 darab képet tölthetsz fel, amely nem lehet nagyobb mint 1MB.
        </p>

        <form>
          <Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
            multiple={false}
            maxFiles={1}
            maxSize={1048576}
            onDrop={onDrop}
            onDropRejected={onDropRejected}
            onFileDialogCancel={onFileDialogCancel}
          />
          <p className='page__desc mb-2'>
            Amikor új profilképet állítasz be, automatikusan kiválasztunk egy
            színt, amit háttérként használhatsz a profilodon. Ezt a színt
            bármikor megváltoztathatod a{" "}
            <Link to={ROUTES.PROFILE(auth.user.username).ROOT} className='link'>
              profil
            </Link>{" "}
            oldalon.
          </p>

          {images.length > 0 && (
            <div className='img-prev'>
              <img src={images[0].dataUrl} alt={images[0].name} />
              <div
                className='color-prev'
                style={{ backgroundColor: colorPreview }}
              />
            </div>
          )}

          <ToggleButton
            label='Profil háttérszín beállítása a kép alapján'
            value={changeBackground}
            onChange={setChangeBackground}
          />

          <StateButton
            className='primary'
            text='Kép módosítása'
            onClick={handleFormSubmit}>
            <Upload />
          </StateButton>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureSettings;
