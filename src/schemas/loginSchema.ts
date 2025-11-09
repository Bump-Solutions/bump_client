import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Hibás e-mail cím formátum."),
  password: z.string().min(1, "A mező kitöltése kötelező."),
});

export type LoginValues = z.infer<typeof loginSchema>;
