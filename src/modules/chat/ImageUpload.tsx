import cuid from "cuid";
import { ImageWithId } from "../../types/chat";
import { Dispatch, SetStateAction, useRef } from "react";

import Uploader, { UploaderHandle } from "../../components/Uploader";
import Tooltip from "../../components/Tooltip";
import Button from "../../components/Button";

import { ImageUp } from "lucide-react";

interface ImageUploadProps {
  setImages: Dispatch<SetStateAction<ImageWithId[]>>;
}

const MAX_FILES = 20;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload = ({ setImages }: ImageUploadProps) => {
  const uploaderRef = useRef<UploaderHandle>(null);

  const handleFiles = (files: File[]) => {
    const newFiles = files.map((file) => ({
      id: cuid(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newFiles]);
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
