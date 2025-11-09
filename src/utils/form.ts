import { accountSchema, personalSchema } from "../schemas/signupSchema";

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

export async function canGoNext(form: any) {
  const section = form.store.state.values.section as "account" | "personal";
  const schema = section === "account" ? accountSchema : personalSchema;

  const errors = await form.parseValuesWithSchemaAsync(schema);
  if (errors) {
    return { isValid: false, errors };
  }

  return { isValid: true, errors: null };
}

export function resetErroredFields(form: any, paths: readonly string[]) {
  paths.forEach((p) => {
    const meta = form.getFieldMeta(p as any);
    const hasError =
      !!meta?.errors &&
      (Array.isArray(meta.errors) ? meta.errors.length > 0 : true);
    if (hasError) form.resetField(p as any);
  });
}
