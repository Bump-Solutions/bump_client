import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import Button from "../../components/Button";

import { FcGoogle } from "react-icons/fc";
import { ImFacebook } from "react-icons/im";

const SocialSignup = () => {
  const handleGoogleLogin = useGoogleLogin({
    /*
    onSuccess: ({ code }) => {
      const loginPromise = googleLoginMutation.mutateAsync({ code });

      toast.promise(loginPromise, {
        loading: "Bejelentkezés folyamatban...",
        success: () => "Bejelentkeztél.",
        error: (err) =>
          (err?.response?.data?.message as string) ||
          "Hiba történt a Google-lal való bejelentkezés során.",
      });

      return loginPromise;
    },
    */
    flow: "auth-code",
    ux_mode: "redirect", // popup / redirect
    redirect_uri: "https://bumpmarket.hu/auth/google/callback", //`https://bumpmarket.hu/auth/google/callback`, // http://localhost:3000/auth/google/callback
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
          handleGoogleLogin();
        }}
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
