export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  USERNAME: /^(?!.*\s{2})[a-z0-9_. ]+(?<!\s)$/i,
  NAME: /^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+([ -][A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)*$/,
  PASSWORD: {
    DIGIT: /\d/,
    LOWERCASE: /[a-z]/,
    UPPERCASE: /[A-Z]/,
    SPECIAL: /[!@#$%^&*]/,
  },
  PHONE: /^\+36\d{2}-\d{3}-\d{4}$/,
  ZIP: /^[0-9]{4}$/,
  PRICE: {
    LENGTH: /^.{1,9}$/,
    CHARACTER: /^[0-9]*$/,
    ZERO: /^(?!0)/, // Not starting with 0
  },
  OTP: /^\d{6}$/,
};
