import { REGEX } from "../../../utils/regex";
import { Errors } from "../../../types/form";
import { FormEvent, useState } from "react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useDebounce } from "../../../hooks/useDebounce";
import { useToast } from "../../../hooks/useToast";

import Input from "../../../components/Input";
import StateButton from "../../../components/StateButton";

import { LockKeyhole, Send } from "lucide-react";
import OtpInput from "../../../components/OtpInput";

const ChangePassword = () => {
  const { auth } = useAuth();
  const [email, setEmail] = useState(auth?.user?.email || "");

  const [errors, setErrors] = useState<Errors>({});

  const { addToast } = useToast();

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
    0,
    [email]
  );

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const inputFields = { email };

    const emptyInputs = (
      Object.keys(inputFields) as Array<keyof typeof inputFields>
    ).filter((key) => inputFields[key] === "");

    if (emptyInputs.length > 0) {
      emptyInputs.forEach((input) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [input]: "A mező kitöltése kötelező.",
        }));
      });

      addToast("error", "Kérjük töltsd ki a csillaggal jelölt mezőket!");
      return Promise.reject("Empty inputs");
    }

    if (Object.values(errors).some((error) => error)) {
      addToast("error", "Kérjük javítsd a hibás mezőket!");
      return Promise.reject("Invalid fields");
    }

    return Promise.resolve();
  };

  return (
    <div className='page__wrapper'>
      <div className='form-box'>
        <h1 className='page__title'>
          <LockKeyhole /> Jelszó csere
        </h1>
        <p className='page__desc mb-2'>
          Küldünk egy levelet az e-mail címedre, majd a benne található 6
          számjegyű kód megadásával beállíthatod az új jelszavadat.
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            type='email'
            name='cp_email'
            value={email}
            label='E-Mail'
            placeholder='pl. minta@gmail.com'
            required
            autoFocus
            onChange={(value) => {
              setEmail(value);
            }}
            error={errors.email}
            success={!!email && !errors.email}
          />

          <StateButton
            type='button'
            text='Kód küldése'
            className='primary'
            onClick={handleFormSubmit}>
            <Send />
          </StateButton>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
