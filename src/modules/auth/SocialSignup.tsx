import { ROUTES } from "../../routes/routes";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import { useToast } from "../../hooks/useToast";

import { useGoogleLogin } from "@react-oauth/google";

import { ImFacebook } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";

import Button from "../../components/Button";
import { useLoginWithGoogle } from "../../hooks/auth/useLoginWithGoogle";
const SocialSignup = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();
  const { addToast } = useToast();

  const googleLoginMutation = useLoginWithGoogle((authModel, variables) => {
    setAuth(authModel);
    navigate(ROUTES.HOME, { replace: true });
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: ({ code }) => {
      googleLoginMutation.mutateAsync(code);
    },
    flow: "auth-code",
    ux_mode: "popup", // TODO: redirect
    // redirect_uri: `localhost:3000`,
    onError: (error) => {
      // console.log(error);
      addToast("error", "Hiba történt a Google-lal való bejelentkezés során.");
    },
  });

  return (
    <div className='social-signup'>
      <h3 className='mb-2'>
        Az oldal eléréséhez jelentkezz be már meglévő fiókoddal
      </h3>

      <Button
        text='folytatás Google-lal'
        className='secondary'
        onClick={() => {
          if (googleLoginMutation.isPending) return;
          handleGoogleLogin();
        }}
        loading={googleLoginMutation.isPending}>
        <FcGoogle style={{ color: "#db4437" }} />
      </Button>

      <Button text='folytatás Facebook-kal' className='secondary'>
        <ImFacebook style={{ color: "#1877f2" }} />
      </Button>
    </div>
  );
};

export default SocialSignup;
