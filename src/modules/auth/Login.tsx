import { ENUM } from "../../utils/enum";
import { ROUTES } from "../../routes/routes";
import { REGEX } from "../../utils/regex";
import { Errors } from "../../types/form";

import { useTitle } from "react-use";
import { FormEvent, useState, useEffect } from "react";
import { Link } from "react-router";
import { BooleanParam, useQueryParam } from "use-query-params";

import { useToast } from "../../hooks/useToast";
import { useLogin } from "../../hooks/auth/useLogin";
import { useDebounce } from "../../hooks/useDebounce";

import { motion } from "framer-motion";

import SocialSignup from "./SocialSignup";
import ForgotPassword from "./ForgotPassword";

import Input from "../../components/Input";
import StateButton from "../../components/StateButton";

import { LogIn } from "lucide-react";

const Login = () => {
  useTitle(`Bejelentkezés - ${ENUM.BRAND.NAME}`);

  const [showForgotPassword, setShowForgotPassword] = useQueryParam(
    "forgotPassword",
    BooleanParam
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});

  const { addToast } = useToast();

  const loginMutation = useLogin();

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  useDebounce(
    () => {
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
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    },
    0,
    [password]
  );

  const handleLogin = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const inputFields = {
      email,
      password,
    };

    const emptyInputs = Object.keys(inputFields).filter(
      (key) => inputFields[key] === ""
    );

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

    return loginMutation.mutateAsync({ email, password });
  };

  return (
    <>
      {!showForgotPassword ? (
        <motion.div
          initial={
            initialLoad ? false : { x: showForgotPassword ? "100%" : "-100%" }
          }
          animate={{ x: "0" }}
          exit={{ x: showForgotPassword ? "-100%" : "100%" }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className='login'>
          <h1>Jó, hogy újra látunk!</h1>
          <SocialSignup />

          <div className='bg-line'>
            <h4>vagy</h4>
          </div>

          <form>
            <Input
              type='email'
              name='lg_email'
              value={email}
              label='E-Mail'
              required
              placeholder='minta@email.com'
              autoFocus={true}
              onChange={(value) => {
                setEmail(value);
              }}
              error={errors.email}
              success={email && !errors.email}
              tabIndex={0}
            />
            <Input
              type='password'
              name='lg_password'
              value={password}
              label='Jelszó'
              required
              placeholder='Mintajelszo12345'
              onChange={(value) => {
                setPassword(value);
              }}
              error={errors.password}
              tabIndex={1}
            />

            <p onClick={() => setShowForgotPassword(true)} className='link'>
              Elfelejtetted a jelszavadat?
            </p>

            <StateButton
              text='Bejelentkezés'
              className='primary'
              onClick={handleLogin}
              tabIndex={2}>
              <LogIn />
            </StateButton>
          </form>

          <p className='mt-2 ta-center fs-18'>
            Még nincs fiókod?{" "}
            <Link to={ROUTES.SIGNUP} className='link'>
              Regisztrálj ingyen.
            </Link>
          </p>
        </motion.div>
      ) : (
        <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
      )}
    </>
  );
};

export default Login;
