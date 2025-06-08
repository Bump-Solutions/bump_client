import { useEffect } from "react";
import { useSetProfileBackgroundColor } from "../../hooks/profile/useSetProfileBackgroundColor";
import { ChromePicker, ColorResult } from "react-color";

import { useProfile } from "../../hooks/profile/useProfile";

import Modal from "../../components/Modal";
import Button from "../../components/Button";
import StateButton from "../../components/StateButton";

import { Check, Pencil } from "lucide-react";

interface ColorProps {
  color: string;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

const Color = ({ color, selectedColor, setSelectedColor }: ColorProps) => {
  const isSelected = color === selectedColor;

  const handleColorClick = () => {
    setSelectedColor(isSelected ? null : color);
  };

  return (
    <div
      className={`color-box ${isSelected ? "selected" : ""}`}
      style={{ backgroundColor: color }}
      onClick={handleColorClick}>
      {isSelected && (
        <span>
          <Check strokeWidth={3} className='svg-18' />
        </span>
      )}
    </div>
  );
};

interface BgColorPickerProps {
  isOpen: boolean;
  close: () => void;
  dominantColor: string | null;
  palette: string[] | null;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

const BgColorPicker = ({
  isOpen,
  close,
  dominantColor,
  palette,
  selectedColor,
  setSelectedColor,
}: BgColorPickerProps) => {
  const { setUser } = useProfile();

  useEffect(() => {
    setSelectedColor(dominantColor);
  }, [dominantColor]);

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };

  const setProfileBackgroundColorMutation = useSetProfileBackgroundColor(() => {
    setUser({ profileBackgroundColor: selectedColor });
    close();
  });

  const handleSaveColor = async () => {
    if (!selectedColor) return;

    return setProfileBackgroundColorMutation.mutateAsync(selectedColor);
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <h1 className='modal__title'>🎨 Háttérszín beállítása</h1>

      <div className='modal__content'>
        <p>
          Alakítsd kedvedre a profilod megjelenését egy új háttérszínnel.
          Válassz a <i>profilképedről</i>
        </p>
        <div className='color-box__wrapper'>
          {palette &&
            palette.map((color) => (
              <Color
                key={color}
                color={color}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            ))}
        </div>
        <p className='ta-center'>vagy</p>
        <div className='color-picker__wrapper'>
          <ChromePicker
            color={selectedColor ?? dominantColor ?? undefined}
            onChange={handleColorChange}
            disableAlpha
          />
        </div>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={setProfileBackgroundColorMutation.isPending}
          onClick={close}
        />
        <StateButton
          className='primary'
          text='Mentés'
          onClick={handleSaveColor}>
          <Pencil />
        </StateButton>
      </div>
    </Modal>
  );
};

export default BgColorPicker;
