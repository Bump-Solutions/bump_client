import { HTMLAttributes } from "react";

interface ToggleButtonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  className?: string;
  label?: string;
  color?: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  error?: string;
  required?: boolean;
}

const ToggleButton = ({
  className,
  label,
  color,
  value,
  onChange,
  error,
  required,
  ...props
}: ToggleButtonProps) => {
  const inputClassName = `${className} ${value ? "toggled" : ""} ${
    error ? "error" : ""
  }`;

  const handleOnChange = () => {
    onChange(!value);
  };

  return (
    <div className='input'>
      <div className='input__wrapper'>
        <div
          className={`toggle ${inputClassName}`}
          onClick={handleOnChange}
          {...props}>
          <label>
            {label}
            {required && <span className='required'> *</span>}
          </label>
          <span className={`toggle-indicator ${color || ""}`}>
            <span className='toggle-indicator--inner'></span>
          </span>
        </div>
      </div>
      {error && <p className='error-msg'>{error}</p>}
    </div>
  );
};

export default ToggleButton;
