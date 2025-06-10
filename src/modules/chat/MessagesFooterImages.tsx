import { FileUpload } from "../../types/form";
import { Dispatch, SetStateAction } from "react";

import Image from "../../components/Image";

import { X } from "lucide-react";

interface MessagesFooterImagesProps {
  images: FileUpload[];
  setImages: Dispatch<SetStateAction<FileUpload[]>>;
}

const MessagesFooterImages = ({
  images,
  setImages,
}: MessagesFooterImagesProps) => {
  const onRemove = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.dataUrl);
      }

      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className='chat__message__images'>
      {images.map((image, index) => (
        <div key={index} className='image-preview'>
          <Image
            src={image.dataUrl}
            alt={`${image.name} előnézete`}
            placeholderColor='#212529'
          />
          <button
            type='button'
            title='Kép eltávolítása'
            onClick={() => onRemove(image.id)}>
            <X />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessagesFooterImages;
