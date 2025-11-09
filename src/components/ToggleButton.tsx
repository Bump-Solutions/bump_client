import { HTMLAttributes } from "react";

interface ToggleButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> {
  name: string;
  label?: string;
  value: boolean | undefined;

  className?: string;
  color?: string;

  onChange: (value: boolean) => void;

  isInvalid?: boolean;
  required?: boolean;
}

const ToggleButton = ({
  name,
  label,
  color,
  value,
  onChange,
  required,

  isInvalid = false,

  className,
  tabIndex,
  ...props
}: ToggleButtonProps) => {
  const handleOnChange = () => {
    onChange(!value);
  };

  const inputClassName =
    "toggle" +
    (className ? ` ${className}` : "") +
    (value ? " toggled" : "") +
    (isInvalid ? " error" : "");

  return (
    <div className='field__input'>
      <button
        type='button'
        name={name}
        className={inputClassName}
        onClick={handleOnChange}
        tabIndex={tabIndex}
        {...props}>
        <label>
          {label}
          {required && <span className='required'> *</span>}
        </label>
        <span className={`toggle-indicator ${color || ""}`}>
          <span className='toggle-indicator--inner'></span>
        </span>
      </button>
    </div>
  );
};

export default ToggleButton;
