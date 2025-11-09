import { formOptions } from "@tanstack/react-form";
import {
  accountSchema,
  personalSchema,
  signupSchema,
  SignupValues,
} from "../schemas/signupSchema";

const signupDefaultValues: SignupValues = {
  section: "account",
  account: {
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  },
  personal: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: null,
  },
};

export const signupFormOptions = formOptions({
  defaultValues: signupDefaultValues,
  validators: {
    onSubmit: ({ value, formApi }) => {
      switch (value.section) {
        case "account":
          return formApi.parseValuesWithSchema(
            accountSchema as typeof signupSchema
          );

        case "personal":
          return formApi.parseValuesWithSchema(
            personalSchema as typeof signupSchema
          );
      }
    },
  },
});
