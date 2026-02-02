import { ValidationCause } from "@tanstack/react-form";
import { z } from "zod";

type ValidateStepResult = {
  isValid: boolean;
  fieldErrors: Record<string, unknown[]>; // whatever meta.errors holds
  schemaErrors: any | null; // TanStack-style errorMap returned by parseValuesWithSchemaAsync
};

function hasError(meta: any) {
  return (
    !!meta?.errors &&
    (Array.isArray(meta.errors) ? meta.errors.length > 0 : true)
  );
}

export async function validateStep(
  form: any,
  fields: readonly string[],
  opts?: { schema?: z.ZodType<any>; cause?: ValidationCause },
): Promise<ValidateStepResult> {
  const cause = opts?.cause ?? ("submit" as ValidationCause);

  // 1) Touch fields so errors render
  fields.forEach((name) => {
    form.setFieldMeta(name as any, (prev: any) => ({
      ...prev,
      isTouched: true,
    }));
  });

  // 2) Re-run field validators for the step (this is what actually updates UI state)
  await Promise.all(
    fields.map((name) => form.validateField(name as any, cause)),
  );

  // 3) Collect field errors from meta (for returning / debugging)
  const fieldErrors: Record<string, unknown[]> = {};
  for (const name of fields) {
    const meta = form.getFieldMeta(name as any);
    if (hasError(meta)) {
      fieldErrors[name] = meta.errors ?? [];
    }
  }

  // 4) Optional: run schema validation too (DO NOT setErrorMap)
  //    This is useful for cross-field rules or just extra safety.
  let schemaErrors: any | null = null;
  if (opts?.schema) {
    schemaErrors = await form.parseValuesWithSchemaAsync(opts.schema);
  }

  const isValid = Object.keys(fieldErrors).length === 0 && schemaErrors == null;

  return { isValid, fieldErrors, schemaErrors };
}

export function resetErroredFields(form: any, fields: readonly string[]) {
  fields.forEach((f) => {
    const meta = form.getFieldMeta(f as any);
    if (hasError(meta)) form.resetField(f as any);
  });
}
