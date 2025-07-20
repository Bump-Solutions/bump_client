import { REGEX } from "../../utils/regex";
import { Errors } from "../../types/form";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
} from "react";
import { SignupModel } from "../../models/authModel";

import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "sonner";

import Input from "../../components/Input";

interface AccountFormProps {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  updateData: (fields: Partial<SignupModel>) => void;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

interface AccountFormRef {
  isValid: () => boolean;
}

const AccountForm = forwardRef<AccountFormRef, AccountFormProps>(
  (
    {
      email,
      username,
      password,
      passwordConfirmation,
      updateData,
      errors,
      setErrors,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({ isValid }));

    const isValid = () => {
      const inputFields = { email, username, password, passwordConfirmation };

      const emptyInputs = (
        Object.keys(inputFields) as Array<keyof typeof inputFields>
      ).filter((key) => inputFields[key] === "");

      if (emptyInputs.length > 0) {
        emptyInputs.forEach((key) => {
          setErrors((prev) => ({
            ...prev,
            [key]: "A mező kitöltése kötelező.",
          }));
        });

        toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");

        return false;
      }

      if (Object.values(errors).some((x) => x !== "")) {
        toast.error("Kérjük javítsd a hibás mezőket!");
        return false;
      }

      return true;
    };

    useDebounce(
      () => {
        // Validate email
        if (email && !REGEX.EMAIL.test(email)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Hibás e-mail cím formátum.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "",
          }));
        }
      },
      250,
      [email]
    );

    useDebounce(
      () => {
        // Validate username
        if (username && !REGEX.USERNAME.test(username)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "Hibás felhasználónév formátum.",
          }));
        } else if (username && username.length < 4) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username:
              "A felhasználónévnek legalább 4 karakter hosszúnak kell lennie.",
          }));
        } else if (username && username.length > 16) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "A felhasználónév legfeljebb 16 karakter hosszú lehet.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "",
          }));
        }
      },
      250,
      [username]
    );

    useDebounce(
      () => {
        // Validate password
        if (password && password.length < 8) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "A jelszónak legalább 8 karakter hosszúnak kell lennie.",
          }));
        } else if (password && password.length > 20) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "A jelszó legfeljebb 20 karakter hosszú lehet.",
          }));
        } else if (password && !REGEX.PASSWORD.DIGIT.test(password)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "A jelszónak tartalmaznia kell legalább egy számot.",
          }));
        } else if (password && !REGEX.PASSWORD.LOWERCASE.test(password)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "A jelszónak tartalmaznia kell legalább egy kisbetűt.",
          }));
        } else if (password && !REGEX.PASSWORD.UPPERCASE.test(password)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "A jelszónak tartalmaznia kell legalább egy nagybetűt.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "",
          }));
        }
      },
      250,
      [password]
    );

    useDebounce(
      () => {
        // Validate password confirmation
        if (passwordConfirmation && password !== passwordConfirmation) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            passwordConfirmation: "A jelszavak nem egyeznek.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            passwordConfirmation: "",
          }));
        }
      },
      0,
      [password, passwordConfirmation]
    );

    return (
      <div className='form__inputs'>
        <Input
          type='email'
          name='sn_email'
          value={email}
          placeholder='minta@email.com'
          label='E-Mail'
          required
          onChange={(value) => {
            updateData({ email: value });
          }}
          error={errors.email}
          success={!!email && !errors.email}
          tabIndex={1}
          autoFocus
        />
        <Input
          type='text'
          name='sn_username'
          value={username}
          label='Felhasználónév'
          required
          placeholder='minta2025'
          onChange={(value) => {
            updateData({ username: value });
          }}
          error={errors.username}
          success={!!username && !errors.username}
          tabIndex={2}
        />
        <div className='field__wrapper'>
          <Input
            type='password'
            name='sn_password'
            value={password}
            label='Jelszó'
            required
            placeholder='Mintaelszo12345'
            onChange={(value) => {
              updateData({ password: value });
            }}
            error={errors.password}
            tabIndex={3}
          />
          <Input
            type='password'
            name='sn_password_confirmation'
            value={passwordConfirmation}
            label='Jelszó újra'
            required
            placeholder='Mintajelszo12345'
            onChange={(value) => {
              updateData({ passwordConfirmation: value });
            }}
            error={errors.passwordConfirmation}
            tabIndex={4}
          />
        </div>
      </div>
    );
  }
);

export default AccountForm;
