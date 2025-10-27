import { REGEX } from "../../utils/regex";
import { Errors } from "../../types/form";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

import { motion } from "framer-motion";

import { useDebounce } from "../../hooks/useDebounce";

import Input from "../../components/Input";
import Back from "../../components/Back";
import StateButton from "../../components/StateButton";

import { Send, MoveLeft } from "lucide-react";

interface ForgotPasswordProps {
  setShowForgotPassword: any;
}

const ForgotPassword = ({ setShowForgotPassword }: ForgotPasswordProps) => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

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

  const handleForgotPassword = async (e: FormEvent<HTMLButtonElement>) => {};

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className='forgot-password'>
      <Back onClick={() => setShowForgotPassword(false)} className='link' />
      <div className='forgot-password__wrapper'>
        <h1>Elfelejtett jelszó</h1>
        <p>
          Küldünk egy levelet az e-mail címedre, majd a benne található 6
          számjegyű kód megadásával beállíthatod az új jelszavadat.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          {/*}
          <Input
            type='email'
            value={email}
            label='E-Mail'
            name='frgpw_email'
            required
            placeholder='minta@email.com'
            autoFocus
            onChange={(value) => {
              setEmail(value);
            }}
            error={errors.email}
            success={!!email && !errors.email}
          />
          <StateButton
            text='Kód küldése'
            className='primary'
            onClick={handleForgotPassword}>
            <Send />
          </StateButton>
          */}
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
