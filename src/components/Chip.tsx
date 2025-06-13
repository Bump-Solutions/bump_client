import { JSX, MouseEvent } from "react";

import { X } from "lucide-react";

interface ChipProps {
  label?: string;
  svg?: JSX.Element;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

const Chip = ({
  label,
  svg,
  selected,
  className,
  onClick,
  onDelete,
}: ChipProps) => {
  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick event of the chip
    if (onDelete) onDelete();
  };

  return (
    <div
      className={`chip ${selected ? "selected" : ""} ${className || ""}`}
      onClick={onClick}>
      {label && <span>{label}</span>}
      {svg && svg}
      {onDelete && (
        <span
          role='button'
          title='Törlés'
          className='delete'
          onClick={handleDelete}>
          <X />
        </span>
      )}
    </div>
  );
};

export default Chip;
