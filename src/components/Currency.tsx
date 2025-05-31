import { ChangeEvent, InputHTMLAttributes } from "react";
import { useToggle } from "../hooks/useToggle";

interface CurrencyProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  value: number | null;
  name?: string;
  currency?: string;
  onChange: (value: number) => void;
  onCurrencyChange?: (currency: string) => void;
  currencies?: string[];
  allowNegative?: boolean;
  suffix?: string;
  decimalSeparator?: "." | ",";
  thousandSeparator?: "." | "," | " ";
  decimalScale?: number;
  maxValue?: number;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  description?: string;
}

const Currency = ({
  label,
  value,
  name,
  currency,
  onChange,
  onCurrencyChange,
  currencies,
  allowNegative = false,
  suffix = "",
  decimalSeparator = ".",
  thousandSeparator = " ",
  decimalScale = 0,
  maxValue,
  error,
  required = false,
  disabled = false,
  placeholder,
  className = "",
  autoFocus = false,
  description,
  ...props
}: CurrencyProps) => {
  const [isFocused, toggleFocus] = useToggle(false);

  const inputClassName =
    (className ? className : "") +
    (error ? " error" : "") +
    (disabled ? " disabled" : "");

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
  return (
    <div className='input'>
      {description && <p className='input__desc'>{description}</p>}
      <label
        htmlFor={name}
        className={`${isFocused ? "focused" : ""} ${
          value !== null ? "filled" : ""
        } ${error ? "error" : ""}`}>
        {label}
        {required && <span className='required'> *</span>}
      </label>
      <div className='currency__wrapper'>
        <input
          type='text'
          value={formatNumber(value)}
          id={name}
          name={name}
          onChange={handleInputChange}
          className={`input__field ${inputClassName}`}
          placeholder={placeholder || " "}
          autoFocus={autoFocus}
          onFocus={() => toggleFocus(true)}
          onBlur={() => toggleFocus(false)}
          {...props}
        />
        {suffix && <span className='suffix'>{suffix}</span>}
      </div>
      {error && <p className='error-msg'>{error}</p>}
    </div>
  );
};

export default Currency;
