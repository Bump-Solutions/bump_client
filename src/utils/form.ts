import { z } from "zod";

export async function touchAndValidateFields(
  form: any,
  fields: readonly string[]
) {
  for (const name of fields) {
    form.setFieldMeta(name as any, (prev: any) => ({
      ...prev,
      isTouched: true,
    }));

    await form.validateField(name as any, "submit");
  }
}

export async function canGoNext(form: any, schema: z.ZodType<any>) {
  const errors = await form.parseValuesWithSchemaAsync(schema);
  if (errors) {
    form.setErrorMap(errors);

    return { isValid: false, errors };
  }

  form.setErrorMap({});
  return { isValid: true, errors: null };
}

function hasError(meta: any) {
  return (
    !!meta?.errors &&
    (Array.isArray(meta.errors) ? meta.errors.length > 0 : true)
  );
}

export function resetErroredFields(form: any, fields: readonly string[]) {
  fields.forEach((f) => {
    const meta = form.getFieldMeta(f as any);
    if (hasError(meta)) form.resetField(f as any);
  });
}
