import { UploadedFile } from "../../types/form";
import { useToast } from "../../hooks/useToast";
import { Dispatch, SetStateAction, useRef } from "react";

import Uploader, { UploaderHandle } from "../../components/Uploader";
import Tooltip from "../../components/Tooltip";
import Button from "../../components/Button";

import { ImageUp } from "lucide-react";

interface ImageUploadProps {
  setImages: Dispatch<SetStateAction<UploadedFile[]>>;
}

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload = ({ setImages }: ImageUploadProps) => {
  const uploaderRef = useRef<UploaderHandle>(null);

  const { addToast } = useToast();

  const handleFiles = (files: UploadedFile[]) => {
    setImages((prev) => {
      const newFiles = files.filter((file) => {
        return !prev.some((prevFile) => prevFile.id === file.id);
      });

      if (prev.length + newFiles.length > MAX_FILES) {
        addToast(
          "error",
          `Maximum ${MAX_FILES} fájl tölthető fel. (Aktuális: ${
            prev.length + newFiles.length
          })`
        );
        return [...prev, ...newFiles.slice(0, MAX_FILES - prev.length)];
      }

      return [...prev, ...newFiles];
    });
  };

  return (
    <>
      <Uploader
        ref={uploaderRef}
        accept='image/*'
        multiple
        maxFiles={MAX_FILES}
        maxSize={MAX_SIZE}
        onInputChange={(files) => handleFiles(files)}
      />
      <div className='btn__upload-images'>
        <Tooltip content='Képek feltöltése' placement='top' showDelay={750}>
          <Button
            className='secondary'
            onClick={() => uploaderRef.current?.open()}>
            <ImageUp className='svg-24' />
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default ImageUpload;
