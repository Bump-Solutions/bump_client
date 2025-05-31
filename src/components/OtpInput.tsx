import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface OtpInputProps {
  numberOfDigits: number;
  validOtp: string;
  className?: string;
  size?: string;
}

const OtpInput = ({
  numberOfDigits,
  validOtp,
  className,
  size,
}: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
  const [error, setError] = useState<string | null>(null);

  const otpBoxRef = useRef<(HTMLInputElement | null)[]>([]);

  const inputClassName = `${className} ${error ? "error" : ""}`;

  useEffect(() => {
    if (otpBoxRef.current && otpBoxRef.current[0]) {
      otpBoxRef.current[0].focus();
    }
  }, []);

  useDebounce(
    () => {
      if (otp.join("") !== "" && otp.join("") !== validOtp) {
        setError("Hibás kód!");
      } else {
        setError(null);
      }
    },
    250,
    [otp]
  );

  const handleChange = (value: string, index: number) => {
    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxRef.current[index + 1]?.focus();
    }
  };

  const handleBackspaceAndEnter = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      otpBoxRef.current[index - 1]?.focus();
    }
    if (
      e.key === "Enter" &&
      e.currentTarget.value &&
      index < numberOfDigits - 1
    ) {
      otpBoxRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className='input'>
      <div className={`otp__wrapper ${size || ""}`}>
        {otp.map((digit, index) => (
          <input
            title='OTP'
            key={index}
            value={digit}
            maxLength={1}
            placeholder=''
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(ref) => {
              otpBoxRef.current[index] = ref;
            }}
            className={`input__field ${inputClassName}`}
          />
        ))}
      </div>
      {error && <p className='error-msg'>{error}</p>}
    </div>
  );
};

export default OtpInput;
