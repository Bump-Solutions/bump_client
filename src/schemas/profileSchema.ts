import { z } from "zod";
import { REGEX } from "../utils/regex";
import { addressSchema } from "./addressSchema";

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .min(4, "A felhasználónévnek legalább 4 karakter hosszúnak kell lennie.")
    .max(16, "A felhasználónév legfeljebb 16 karakter hosszú lehet.")
    .regex(REGEX.USERNAME, "Hibás felhasználónév formátum."),
  firstName: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .refine((s) => REGEX.NAME.test(s), {
      message: "Hibás keresztnév formátum.",
    }),
  lastName: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .refine((s) => REGEX.NAME.test(s), {
      message: "Hibás vezetéknév formátum.",
    }),
  phoneNumber: z
    .string()
    .min(1, "A mező kitöltése kötelező.")
    .refine((s) => REGEX.PHONE.test(s), {
      message: "Hibás telefonszám. Formátum: +36xx-xxx-xxxx",
    }),
  bio: z
    .string()
    .max(500, "A bemutatkozó legfeljebb 500 karakter hosszú lehet.")
    .optional()
    .or(z.literal("")),
  address: addressSchema.optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const profileInfoSchema = profileSchema.omit({ address: true });
export type ProfileInfoValues = z.infer<typeof profileInfoSchema>;
