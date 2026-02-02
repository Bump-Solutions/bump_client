import { z } from "zod";
import { ENUM } from "../utils/enum";

const GENDER_VALUES = ENUM.PRODUCT.GENDER_OPTIONS.map(
  (option) => option.value,
) as readonly number[];
const SIZE_VALUES = ENUM.PRODUCT.SIZE_OPTIONS.map(
  (option) => option.value,
) as readonly number[];
const CONDITION_VALUES = ENUM.PRODUCT.CONDITION_OPTIONS.map(
  (option) => option.value,
) as readonly number[];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ["image/png", "image/jpeg", "image/jpg"] as const;

// --- STEP SÉMÁK ---
export const SELL_STEPS = ["select", "details", "items", "upload"] as const;
export type SellStep = (typeof SELL_STEPS)[number];

export const SELL_FIELDS: Record<SellStep, readonly string[]> = {
  select: ["select.isCatalog"],
  details: [
    "details.title",
    "details.description",
    "details.product.id",
    "details.product.brand",
    "details.product.model",
    "details.product.colorWay",
  ],
  items: ["items.items"],
  upload: ["upload.images"],
};

// Step 1: Select
export const sellSelectSchema = z.object({
  select: z.object({
    isCatalog: z.boolean(),
  }),
});

// Step 2: Details
const productSchema = z.object({
  id: z.number().int().nullable(), // ha katalógusból választott
  brand: z.string().trim().min(1, "A mező kitöltése kötelező."),
  model: z.string().trim().min(1, "A mező kitöltése kötelező."),
  colorWay: z.string().trim().min(1, "A mező kitöltése kötelező."),
});

export const sellDetailsSchema = z.object({
  details: z.object({
    title: z.string().trim().min(1, "A mező kitöltése kötelező."),
    description: z
      .string()
      .max(500, "Legfeljebb 500 karakter írható.")
      .optional()
      .or(z.literal("")),
    product: productSchema,
  }),
});

// Step 3: Items
export const itemSchema = z.object({
  gender: z
    .number({ error: "A mező kitöltése kötelező." })
    .int()
    .refine((v) => GENDER_VALUES.includes(v), "Érvénytelen érték."),
  size: z
    .number({ error: "A mező kitöltése kötelező." })
    .int()
    .refine((v) => SIZE_VALUES.includes(v), "Érvénytelen érték."),
  condition: z
    .number({ error: "A mező kitöltése kötelező." })
    .int()
    .refine((v) => CONDITION_VALUES.includes(v), "Érvénytelen érték."),
  price: z
    .number({ error: "A mező kitöltése kötelező." })
    .int("Az ár csak egész szám lehet.")
    .min(1, "Az árnak pozitívnak kell lennie."),
});
export type SellItem = z.infer<typeof itemSchema>;

export const itemDraftSchema = z.object({
  gender: z.number().nullable(),
  size: z.number().nullable(),
  condition: z.number().nullable(),
  price: z.number().nullable(),
  count: z.number().min(1).max(20),
});

export const sellItemsSchema = z.object({
  items: z.object({
    draft: itemDraftSchema.optional(),
    items: z.array(itemSchema).min(1, "Legalább egy eladó tételt adj meg."),
  }),
});

// Step 4: Upload
export const sellUploadSchema = z.object({
  upload: z.object({
    images: z
      .array(
        z
          .custom<File>((v) => v instanceof File, {
            message: "Kép feltöltése kötelező.",
          })
          .superRefine((file, ctx) => {
            if (!(file instanceof File)) return; // már megkaptuk a "kötelező" hibát
            if (!ACCEPTED.includes(file.type as any)) {
              ctx.addIssue({
                code: "custom",
                message: `Érvénytelen fájltípus. Csak a következők engedélyezettek: ${ACCEPTED.join(", ")}.`,
              });
            }
            if (file.size > MAX_SIZE) {
              ctx.addIssue({
                code: "custom",
                message: `A fájl mérete túl nagy. A megengedett méret ${MAX_SIZE / (1024 * 1024)} MB.`,
              });
            }
          }),
      )
      .min(3, "Legalább 3 képet tölts fel.")
      .max(10, "Legfeljebb 10 képet tölthetsz fel."),
  }),
});

export const sellSchema = z.object({
  step: z.enum(["select", "details", "items", "upload"]),
  ...sellSelectSchema.shape,
  ...sellDetailsSchema.shape,
  ...sellItemsSchema.shape,
  ...sellUploadSchema.shape,
});

export type SellValues = z.infer<typeof sellSchema>;
