import { ENUM } from "../../utils/enum";
import { ROUTES } from "../../routes/routes";

import { useTitle } from "react-use";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { BooleanParam, useQueryParam } from "use-query-params";

import { motion } from "framer-motion";

import SocialSignup from "./SocialSignup";
import ForgotPassword from "./ForgotPassword";
import LoginForm from "./LoginForm";

const Login = () => {
  useTitle(`Bejelentkezés - ${ENUM.BRAND.NAME}`);

  const [showForgotPassword, setShowForgotPassword] = useQueryParam(
    "forgotPassword",
    BooleanParam
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

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

          <LoginForm />

          <p className='mt-2 ta-center fs-18'>
            Még nincs fiókod?{" "}
            <Link to={ROUTES.SIGNUP} className='link' tabIndex={5}>
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
