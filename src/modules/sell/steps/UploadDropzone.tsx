import { UploadedImage } from "../../../types/product";
import { useToast } from "../../../hooks/useToast";
import { useSell } from "../../../hooks/product/useSell";

import cuid from "cuid";

import Dropzone from "../../../components/Dropzone";

const MAX_FILES = 10;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const UploadDropzone = () => {
  const { addToast } = useToast();

  const { data, updateData, errors, setErrors } = useSell();

  const onDrop = (acceptedFiles: File[]) => {
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    if (acceptedFiles.length + data.images.length > 10) {
      addToast("error", `Maximum ${MAX_FILES} fájl tölthető fel.`);
      return;
    }

    // Create a promise for each file to be read
    const fileReadPromises: Promise<UploadedImage>[] = acceptedFiles.map(
      (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            resolve({
              id: cuid(),
              file: file,
              dataUrl: e.target?.result as string,
              name: file.name,
              size: file.size,
              type: file.type,
            });
          };

          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsDataURL(file);
        });
      }
    );

    // Wait for all files to be read, then update the state once
    Promise.all(fileReadPromises).then((newImages) => {
      updateData({
        images: [...data.images, ...newImages],
      });
    });
  };

  const onDropRejected = (filesRejections: any[]) => {
    switch (filesRejections[0].errors[0].code) {
      case "file-too-large":
        addToast(
          "error",
          `A fájl mérete nem haladhatja meg a ${MAX_SIZE / 1024 / 1024} MB-ot.`
        );
        break;
      case "file-invalid-type":
        addToast("error", "Hibás fájl formátum.");
        break;
      case "too-many-files":
        addToast("error", `Maximum ${MAX_FILES} kép tölthető fel.`);
        break;
      default:
        addToast("error", "Hiba történt a fájl feltöltése során.");
        break;
    }
  };

  const onFileDialogCancel = () => {
    return;
  };

  return (
    <article className='dropzone__wrapper'>
      <Dropzone
        accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
        multiple
        maxFiles={MAX_FILES}
        maxSize={MAX_SIZE}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        onFileDialogCancel={onFileDialogCancel}
        error={errors.images}
      />
    </article>
  );
};

export default UploadDropzone;
