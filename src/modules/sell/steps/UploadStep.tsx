import { forwardRef, useImperativeHandle } from "react";
import { useToast } from "../../../hooks/useToast";
import { useSell } from "../../../hooks/product/useSell";
import { Reorder } from "framer-motion";

import UploadDropzone from "./UploadDropzone";
import Button from "../../../components/Button";

import { Trash } from "lucide-react";

interface UploadStepRef {
  isValid: () => boolean;
}

const UploadStep = forwardRef<UploadStepRef>(({}, ref) => {
  const { addToast } = useToast();

  const { data, updateData, setErrors } = useSell();

  useImperativeHandle(ref, () => ({ isValid }));

  const isValid = () => {
    if (data.images.length < 3) {
      setErrors((prev) => ({
        ...prev,
        images: "Legalább 3 képet fel kell töltened.",
      }));

      addToast("error", "Kérjük javítsd a hibás mezőket!");
      return false;
    }

    return true;
  };

  const removeImage = (id: string) => {
    updateData({
      images: data.images.filter((image) => image.id !== id),
    });
  };

  const onReorder = (newOrder: any) => {
    updateData({ images: newOrder });
  };

  return (
    <div className='upload__wrapper'>
      <UploadDropzone />
      <article className='images__wrapper'>
        {data.images.length === 0 && (
          <p className='p-0 no-image'>A kiválasztott képek itt jelennek meg.</p>
        )}

        <Reorder.Group
          values={data.images}
          onReorder={onReorder}
          layoutScroll
          className='images__grid'>
          {data.images.map((image) => (
            <Reorder.Item key={image.id} value={image} drag className='image'>
              <Button
                className='secondary delete'
                onClick={() => removeImage(image.id)}>
                <Trash />
              </Button>
              <img src={image.dataUrl} alt={image.name} draggable={false} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </article>
    </div>
  );
});

export default UploadStep;
