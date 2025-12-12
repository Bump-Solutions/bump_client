import { formOptions } from "@tanstack/react-form";
import {
  sellDetailsSchema,
  sellItemsSchema,
  sellSchema,
  sellSelectSchema,
  sellUploadSchema,
  SellValues,
} from "../schemas/sellSchema";
import {
  accountSchema,
  personalSchema,
  signupSchema,
  SignupValues,
} from "../schemas/signupSchema";

// SIGNHUP
const signupDefaultValues: SignupValues = {
  step: "account",
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
      switch (value.step) {
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

// SELL
const sellDefaultValues: SellValues = {
  step: "select",
  select: {
    isCatalog: true,
  },
  details: {
    title: "",
    description: "",
    product: {
      id: null,
      brand: "",
      model: "",
      colorWay: "",
    },
  },
  items: {
    items: [],
  },
  upload: {
    images: [],
  },
};

export const sellFormOptions = formOptions({
  defaultValues: sellDefaultValues,
  validators: {
    onSubmit: ({ value, formApi }) => {
      switch (value.step) {
        case "select":
          return formApi.parseValuesWithSchema(
            sellSelectSchema as typeof sellSchema
          );
        case "details":
          return formApi.parseValuesWithSchema(
            sellDetailsSchema as typeof sellSchema
          );
        case "items":
          return formApi.parseValuesWithSchema(
            sellItemsSchema as typeof sellSchema
          );
        case "upload":
          return formApi.parseValuesWithSchema(
            sellUploadSchema as typeof sellSchema
          );
      }
    },
  },
});
