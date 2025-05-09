import { Minus, Plus } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes } from "react";
import { useToggle } from "../hooks/useToggle";

interface StepperProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  description?: string;
}

const Stepper = ({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  className = "",
  error,
  required = false,
  placeholder,
  autoFocus = false,
  description,
  ...props
}: StepperProps) => {
  const [isFocused, toggleFocus] = useToggle(false);

  const inputClassName =
    (className ? className : "") +
    (error ? " error" : "") +
    (disabled ? " disabled" : "");

  const decrement = () => {
    if (value > min) {
      onChange(value - step);
      toggleFocus(true);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + step);
      toggleFocus(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue === "") {
      onChange(min);
      return;
    }

    const parsedValue = Number(newValue);

    if (isNaN(parsedValue)) {
      return;
    }

    if (parsedValue < min) {
      onChange(min);
    } else if (parsedValue > max) {
      onChange(max);
    } else {
      onChange(parsedValue);
    }
  };

  const handleFocus = () => toggleFocus(true);

  const handleBlur = () => {
    if (value === min) {
      toggleFocus(false);
    }
  };

  return (
    <div className='input flex-none'>
      {description && <p className='input__desc'>{description}</p>}
      <div className={`stepper__wrapper ${isFocused ? "focused" : ""}`}>
        <button
          type='button'
          title='Csökkentés'
          className='stepper__btn'
          onClick={decrement}
          disabled={disabled || value === min}>
          <Minus />
        </button>
        <input
          type='number'
          className={inputClassName}
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          placeholder={placeholder || ""}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <button
          type='button'
          title='Növelés'
          className='stepper__btn'
          onClick={increment}
          disabled={disabled || value === max}>
          <Plus />
        </button>
      </div>
    </div>
  );
};

export default Stepper;
