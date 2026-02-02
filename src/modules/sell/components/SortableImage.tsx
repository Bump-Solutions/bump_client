import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Button from "../../../components/Button";

import { Trash } from "lucide-react";

type SortableImageProps = {
  id: string;
  url: string;
  onRemove: () => void;
};

const SortableImage = ({ id, url, onRemove }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='image'>
      <Button className='secondary delete' onClick={onRemove}>
        <Trash />
      </Button>

      <img src={url} draggable={false} alt={id} />
    </div>
  );
};

export default SortableImage;
