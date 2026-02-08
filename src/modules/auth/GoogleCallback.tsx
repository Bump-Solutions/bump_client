import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { ROUTES } from "../../routes/routes";

import { useLoginWithGoogle } from "../../hooks/auth/useLoginWithGoogle";

import Spinner from "../../components/Spinner";

const GoogleCallback = () => {
  const [params] = useSearchParams();
  const code = params.get("code");

  const navigate = useNavigate();
  const googleLoginMutation = useLoginWithGoogle();

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!code) {
      toast.error("Hiányzó Google authorization code.");
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    const p = googleLoginMutation.mutateAsync({ code });

    toast.promise(p, {
      loading: "Bejelentkezés folyamatban...",
      success: "Bejelentkeztél.",
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba történt a Google-lal való bejelentkezés során.",
    });

    // Only handle failure navigation here (success navigation is in mutation onSuccess)
    p.catch(() => navigate(ROUTES.LOGIN, { replace: true }));
  }, [code, navigate, googleLoginMutation]);

  return <Spinner />;
};

export default GoogleCallback;
