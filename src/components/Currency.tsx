import { ChangeEvent, InputHTMLAttributes } from "react";
import { useToggle } from "../hooks/useToggle";

interface CurrencyProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number | null;
  name: string;

  onChange: (value: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  currency?: string;
  currencies?: string[];
  onCurrencyChange?: (currency: string) => void;

  allowNegative?: boolean;
  maxValue?: number;

  suffix?: string;
  decimalSeparator?: "." | ",";
  thousandSeparator?: "." | "," | " ";
  decimalScale?: number;

  required?: boolean;
  placeholder?: string;

  success?: boolean;
  isInvalid?: boolean;
  disabled?: boolean;

  className?: string;
  autoFocus?: boolean;
}

const Currency = ({
  value,
  name,

  onChange,
  onBlur,
  onFocus,

  currency,
  currencies,
  onCurrencyChange,

  allowNegative = false,
  maxValue,

  suffix = "",
  decimalSeparator = ".",
  thousandSeparator = " ",
  decimalScale = 0,

  required = false,
  placeholder,

  success = false,
  isInvalid = false,
  disabled = false,

  className = "",
  autoFocus = false,
  ...props
}: CurrencyProps) => {
  const [isFocused, toggleFocus] = useToggle(false);

  const formatNumber = (num: number | null) => {
    if (num === null || num === 0) return "";

    return new Intl.NumberFormat("hu-HU", {
      minimumFractionDigits: decimalScale,
      maximumFractionDigits: decimalScale,
    }).format(num / Math.pow(10, decimalScale));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let rawValue = event.target.value.replace(/[^0-9,-]/g, ""); // Csak számokat és mínuszt engedünk
    if (!allowNegative) rawValue = rawValue.replace("-", ""); // Negatív számok tiltása

    const parsedNumber = parseFloat(rawValue.replace(",", ".")); // `,` helyett `.` a parseFloat miatt

    if (isNaN(parsedNumber)) return onChange(0);

    // **Ha decimalScale > 0, akkor szorozzuk meg, különben ne**
    const scaledValue =
      decimalScale > 0
        ? Math.round(parsedNumber * Math.pow(10, decimalScale))
        : Math.round(parsedNumber);

    if (
      maxValue !== undefined &&
      scaledValue > maxValue * Math.pow(10, decimalScale)
    )
      return;

    onChange(scaledValue);
  };

  const handleOnBlur = () => {
    toggleFocus(false);
    onBlur?.();
  };

  const handleOnFocus = () => {
    toggleFocus(true);
    onFocus?.();
  };

  const inputClassName =
    (className ? className : "") +
    (isFocused ? " focused" : "") +
    (isInvalid ? " error" : "") +
    (success ? " success" : "") +
    (disabled ? " disabled" : "");

  return (
    <div className='field__input'>
      <div className='currency__wrapper'>
        <input
          type='text'
          value={formatNumber(value)}
          id={name}
          name={name}
          onChange={handleInputChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          className={`input__field ${inputClassName}`}
          placeholder={placeholder || " "}
          autoFocus={autoFocus}
          data-invalid={isInvalid}
          aria-invalid={isInvalid}
          {...props}
        />
        {suffix && <span className='suffix'>{suffix}</span>}
      </div>
    </div>
  );
};

export default Currency;
