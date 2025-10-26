import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";
import { useAppForm } from "../../hooks/form/hooks";
import { toast } from "sonner";
import { loginSchema, LoginValues } from "../../schemas/loginSchema";

import StateButton from "../../components/StateButton";

import { LogIn } from "lucide-react";

const defaultValues: LoginValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const loginMutation = useLogin();

  const form = useAppForm({
    defaultValues,

    // Form szintű validáció (pl. kötelező mezők)
    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value, formApi }) => {
      const loginPromise = loginMutation.mutateAsync(value);

      toast.promise(loginPromise, {
        loading: "Bejelentkezés folyamatban...",
        success: "Bejelentkeztél.",
        error: (err) => "Hiba a bejelentkezés során.",
      });

      await loginPromise;
      formApi.reset();
    },

    onSubmitInvalid: ({ value }) => {
      const { email, password } = value;

      if (!email || !password) {
        toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
      } else {
        toast.error("Kérjük javítsd a hibás mezőket!");
      }

      throw new Error("Invalid form submission");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      {/* Email mező */}
      <form.AppField
        name='email'
        validators={{ onChange: loginSchema.shape.email }}>
        {(field) => (
          <field.Input
            type='email'
            label='E-Mail'
            required
            placeholder='minta@mail.com'
            tabIndex={1}
          />
        )}
      </form.AppField>

      {/* Jelszó mező */}
      <form.AppField
        name='password'
        validators={{ onChange: loginSchema.shape.password }}>
        {(field) => (
          <field.Password
            label='Jelszó'
            required
            placeholder='Mintajelszo12345'
            tabIndex={2}
          />
        )}
      </form.AppField>

      <Link to={ROUTES.LOGIN} className='link' tabIndex={3}>
        Elfelejtetted a jelszavadat?
      </Link>

      <StateButton
        type='button'
        onClick={form.handleSubmit}
        text='Bejelentkezés'
        className='primary'
        tabIndex={4}>
        <LogIn />
      </StateButton>
    </form>
  );
};

export default LoginForm;
