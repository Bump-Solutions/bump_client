import { ROUTES } from "../../routes/routes";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginWithGoogle } from "../../hooks/auth/useLoginWithGoogle";
import { toast } from "sonner";

import Button from "../../components/Button";

import { ImFacebook } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";

const SocialSignup = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const googleLoginMutation = useLoginWithGoogle((authModel, variables) => {
    setAuth(authModel);
    navigate(ROUTES.HOME, { replace: true });
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: ({ code }) => {
      const loginPromise = googleLoginMutation.mutateAsync(code);

      toast.promise(loginPromise, {
        loading: "Bejelentkezés folyamatban…",
        success: () => "Bejelentkeztél.",
        error: (err) =>
          (err?.response?.data?.message as string) ||
          "Hiba történt a Google-lal való bejelentkezés során.",
      });

      return loginPromise;
    },
    flow: "auth-code",
    ux_mode: "popup", // TODO: redirect
    // redirect_uri: `localhost:3000`,
    onError: (error) => {
      // console.log(error);
      toast.error("Hiba történt a Google-lal való bejelentkezés során.");
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
        loading={googleLoginMutation.isPending}
        tabIndex={0}>
        <FcGoogle style={{ color: "#db4437" }} />
      </Button>

      <Button text='folytatás Facebook-kal' className='secondary' tabIndex={0}>
        <ImFacebook style={{ color: "#1877f2" }} />
      </Button>
    </div>
  );
};

export default SocialSignup;
