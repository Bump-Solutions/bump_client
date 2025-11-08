// src/schemas/reportSchema.ts
import { z } from "zod";

export const reportSchema = z.object({
  reason: z
    .number()
    .int()
    .nullable()
    .refine((val) => val !== null, {
      message: "Kérjük válaszd ki a jelentés okát.",
    }),
  description: z
    .string()
    .max(500, { message: "Legfeljebb 500 karakter írható." })
    .optional()
    .or(z.literal("")),
});

export type ReportValues = z.infer<typeof reportSchema>;
