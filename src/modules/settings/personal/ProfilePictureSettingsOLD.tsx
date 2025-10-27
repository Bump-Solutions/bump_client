import cuid from "cuid";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useUploadProfilePicture } from "../../../hooks/profile/useUploadProfilePicture";
import { usePersonalSettings } from "../../../hooks/settings/usePersonalSettings";
import { useMounted } from "../../../hooks/useMounted";
import { ROUTES } from "../../../routes/routes";
import { FileUpload } from "../../../types/form";
import { API } from "../../../utils/api";
import {
  getImageDominantColor,
  getImageDominantColorAndPalette,
} from "../../../utils/functions";

import Back from "../../../components/Back";
import Dropzone from "../../../components/Dropzone";
import StateButton from "../../../components/StateButton";
import ToggleButton from "../../../components/ToggleButton";

import { Upload } from "lucide-react";

const ProfilePictureSettings = () => {
  const { auth, setAuth } = useAuth();
  const { setData } = usePersonalSettings();

  const [images, setImages] = useState<FileUpload[]>([]);
  const [colorPreview, setColorPreview] = useState<string | null>(null);
  const [changeBackground, setChangeBackground] = useState<boolean>(false);

  const navigate = useNavigate();
  const isMounted = useMounted();

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
              dataUrl: e?.target?.result as string,
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
          .catch((error) => {
            toast.error("Hiba történt a kép feldolgozása során.");
          });
      };

      reader.readAsDataURL(file);
    });
  };

  const onDropRejected = (fileRejections: { errors: { code: string }[] }[]) => {
    const errorCode = fileRejections[0]?.errors[0]?.code;
    switch (errorCode) {
      case "file-too-large":
        toast.error("A fájl mérete túl nagy. A megengedett méret 1MB.");
        break;
      case "file-invalid-type":
        toast.error("Hibás fájl formátum.");
        break;
      default:
        toast.error("Hiba történt a fájl feltöltése során.");
        break;
    }
  };

  const onFileDialogCancel = () => {
    setImages([]);
  };

  const uploadProfilePictureMutation = useUploadProfilePicture((response) => {
    setData({
      profilePicture: response.data.message,
    });

    setAuth((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        profilePicture: response.data.message,
      },
    }));

    setTimeout(() => {
      if (isMounted()) {
        navigate(ROUTES.SETTINGS.ROOT, { replace: true });
      }
    }, 500);
  });

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.warning("Először tölts fel egy képet a módosításhoz.");
      return Promise.reject("No image uploaded");
    }

    const uploadPromise = (async () => {
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
    })();

    toast.promise(uploadPromise, {
      loading: "Kép feltöltése folyamatban...",
      success: "Profilképed frissült.",
      error: "Hiba történt a kép feldolgozása közben.",
    });

    return uploadPromise;
  };

  return (
    <div className='page__wrapper'>
      <div className='form-box'>
        <Back to={ROUTES.SETTINGS.ROOT} className='link hide-mobile' />

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
            <Link
              to={ROUTES.PROFILE(auth?.user?.username!).ROOT}
              className='link'>
              profil
            </Link>{" "}
            oldalon.
          </p>

          {images.length > 0 && (
            <div className='img-prev'>
              <img
                src={API.MEDIA_URL + images[0].dataUrl}
                alt={images[0].name}
              />
              <div
                className='color-prev'
                style={{ backgroundColor: colorPreview! }}
              />
            </div>
          )}

          <div className='field'>
            <ToggleButton
              name='changeBackground'
              label='Profil háttérszín beállítása a kép alapján'
              value={changeBackground}
              onChange={setChangeBackground}
            />
          </div>

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
