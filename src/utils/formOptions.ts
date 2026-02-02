import { formOptions } from "@tanstack/react-form";
import { itemDraftSchema, sellSchema, SellValues } from "../schemas/sellSchema";
import { signupSchema, SignupValues } from "../schemas/signupSchema";

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
      return formApi.parseValuesWithSchema(signupSchema);
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
    draft: itemDraftSchema.parse({
      gender: null,
      size: null,
      condition: null,
      price: null,
      count: 1,
    }),
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
      return formApi.parseValuesWithSchema(sellSchema);
    },
  },
});
