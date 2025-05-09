import { ImageWithId } from "../../types/chat";
import { Dispatch, SetStateAction } from "react";

import Image from "../../components/Image";

import { X } from "lucide-react";

interface MessagesFooterImagesProps {
  images: ImageWithId[];
  setImages: Dispatch<SetStateAction<ImageWithId[]>>;
}

const MessagesFooterImages = ({
  images,
  setImages,
}: MessagesFooterImagesProps) => {
  const onRemove = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview); // Clean up the object URL
      }

      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className='chat__message__images'>
      {images.map((image, index) => (
        <div key={index} className='image-preview'>
          <Image
            src={image.preview}
            alt={`${image.file.name} előnézete`}
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
