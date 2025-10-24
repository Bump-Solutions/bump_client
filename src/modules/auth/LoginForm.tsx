import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { REGEX } from "../../utils/regex";

import Input from "../../components/Input";
import Password from "../../components/Password";
import StateButton from "../../components/StateButton";

import { LogIn } from "lucide-react";

const LoginForm = () => {
  const loginMutation = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    // Form szintű validáció (pl. kötelező mezők)
    validators: {
      onSubmit: ({ value }) => {
        const fields: Record<string, string | undefined> = {};

        if (!value.email) fields.email = "A mező kitöltése kötelező.";
        if (!value.password) fields.password = "A mező kitöltése kötelező.";

        return { fields };
      },
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
      <form.Field
        name='email'
        asyncDebounceMs={500}
        validators={{
          onChangeAsync: async ({ value }) => {
            if (!REGEX.EMAIL.test(value)) return "Hibás e-mail cím formátum.";
            return undefined;
          },
        }}>
        {(field) => (
          <Input
            type='email'
            name='lg_email'
            label='E-Mail'
            required
            placeholder='minta@mail.com'
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]}
            success={Boolean(field.state.value) && field.state.meta.isValid}
            autoFocus
            tabIndex={1}
          />
        )}
      </form.Field>

      {/* Jelszó mező */}
      <form.Field
        name='password'
        validators={{
          onChange: ({ value }) =>
            !value ? "Kérjük javítsd a hibás mezőket!" : undefined,
        }}>
        {(field) => (
          <Password
            name='lg_password'
            label='Jelszó'
            required
            placeholder='Mintajelszo12345'
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]}
            tabIndex={2}
          />
        )}
      </form.Field>

      <Link to={ROUTES.LOGIN} className='link' tabIndex={3}>
        Elfelejtetted a jelszavadat?
      </Link>

      <StateButton
        type='submit'
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
