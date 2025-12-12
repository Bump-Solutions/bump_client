import { useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import "../../assets/css/multistepform.css";
import { useLogin } from "../../hooks/auth/useLogin";
import { useSignup } from "../../hooks/auth/useSignup";
import { useAppForm } from "../../hooks/form/hooks";
import { SignupModel } from "../../models/authModel";
import { signupFormOptions } from "../../utils/formOptions";

import AccountStep from "./AccountStep";
import PersonalStep from "./PersonalStep";
import SignupFormHeader from "./SignupFormHeader";

export const SIGNUP_FIELDS = {
  account: [
    "account.email",
    "account.username",
    "account.password",
    "account.passwordConfirmation",
  ],
  personal: [
    "personal.firstName",
    "personal.lastName",
    "personal.phoneNumber",
    "personal.gender",
  ],
};

// https://stackblitz.com/edit/tanstack-form-yjtaf2ug?file=src%2Ffeatures%2Ftree-house%2Fpage.tsx&preset=node
const SignupForm = () => {
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const form = useAppForm({
    ...signupFormOptions,
    onSubmit: async ({ value, formApi }) => {
      const data: SignupModel = {
        email: value.account.email,
        username: value.account.username,
        password: value.account.password,
        passwordConfirmation: value.account.passwordConfirmation,
        firstName: value.personal.firstName,
        lastName: value.personal.lastName,
        phoneNumber: value.personal.phoneNumber,
        gender: value.personal.gender ?? null,
      };

      const signupPromise = signupMutation.mutateAsync(data);

      toast.promise(signupPromise, {
        loading: "Regisztráció folyamatban...",
        success: "Sikeres regisztráció. Bejelentkezés...",
        error: (err) => "Hiba a regisztráció során.",
      });

      await signupPromise.then(() => {
        loginMutation.mutateAsync({
          email: data.email,
          password: data.password,
        });
      });

      formApi.reset();
    },

    onSubmitInvalid: async ({ value, formApi }) => {
      throw new Error("Invalid form submission");
    },
  });

  const step = useStore(form.store, (state) => state.values.step);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className='multi-step-form'>
      <SignupFormHeader form={form} />

      <div className='form__body'>
        {step === "account" && <AccountStep form={form} />}
        {step === "personal" && <PersonalStep form={form} />}
      </div>
    </form>
  );
};

export default SignupForm;
