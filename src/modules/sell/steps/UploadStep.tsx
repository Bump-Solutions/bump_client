import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useStore } from "@tanstack/react-form";
import { Tag } from "lucide-react";
import { MouseEvent, useEffect, useMemo } from "react";
import { withForm } from "../../../hooks/form/hooks";
import { SELL_STEPS } from "../../../schemas/sellSchema";
import { sellFormOptions } from "../../../utils/formOptions";

import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";
import SortableImage from "../components/SortableImage";
import UploadDropzone from "../components/UploadDropzone";

type UploadStepProps = {
  currentStepIndex: number;
  prev: () => void;
  handleSubmit: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
};

const UploadStep = withForm({
  ...sellFormOptions,
  props: {} as UploadStepProps,
  render: function Render({ form, currentStepIndex, prev, handleSubmit }) {
    const images = useStore(form.store, (state) => state.values.upload.images);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 6 },
      }),
    );

    const previews = useMemo(() => {
      return images.map((image: File) => ({
        file: image,
        url: URL.createObjectURL(image),
      }));
    }, [images]);

    useEffect(() => {
      return () => {
        // Revoke the object URLs to avoid memory leaks
        previews.forEach(({ url }) => URL.revokeObjectURL(url));
      };
    }, [previews]);

    const handleDragEnd = (event: any) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = images.findIndex((img: File) => img.name === active.id);
      const newIndex = images.findIndex((img: File) => img.name === over.id);

      form.setFieldValue(
        "upload.images",
        arrayMove(images, oldIndex, newIndex),
      );
    };

    const removeImage = (name: string) => {
      form.setFieldValue(
        "upload.images",
        images.filter((img: File) => img.name !== name),
      );
    };

    return (
      <>
        <div className='modal__content'>
          <div className='step step-4'>
            <div className='upload__wrapper'>
              <UploadDropzone form={form} />

              <div className='images__wrapper'>
                {images.length === 0 && (
                  <p className='p-0 no-image'>
                    A kiválasztott képek itt jelennek meg.
                  </p>
                )}

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={images.map((image) => image.name)}
                    strategy={rectSortingStrategy}>
                    <div className='images__grid'>
                      {previews.map(({ file, url }) => (
                        <SortableImage
                          key={file.name}
                          id={file.name}
                          url={url}
                          onRemove={() => removeImage(file.name)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        </div>

        <div className='modal__actions'>
          <span className='fs-16 fc-gray-600 truncate'>
            {currentStepIndex + 1} / {SELL_STEPS.length}
          </span>

          <div className='d-flex gap-2 a-center'>
            <Button
              type='button'
              text='Vissza'
              className='tertiary'
              onClick={prev}
            />

            <StateButton
              type='button'
              text='Eladás'
              className='primary mt-0 mb-0'
              onClick={handleSubmit}>
              <Tag />
            </StateButton>
          </div>
        </div>
      </>
    );
  },
});

export default UploadStep;
