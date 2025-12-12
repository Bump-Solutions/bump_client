import { useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { withForm } from "../../hooks/form/hooks";
import { accountSchema, personalSchema } from "../../schemas/signupSchema";
import { canGoNext, touchAndValidateFields } from "../../utils/form";
import { signupFormOptions } from "../../utils/formOptions";
import { SIGNUP_FIELDS } from "./SignupForm";

import Button from "../../components/Button";
import FieldGroup from "../../components/form/FieldGroup";

import { MoveRight } from "lucide-react";

const AccountStep = withForm({
  ...signupFormOptions,
  render: function Render({ form }) {
    const step = useStore(form.store, (state) => state.values.step);
    const schema = step === "account" ? accountSchema : personalSchema;

    const isBusy = useStore(
      form.store,
      (state) =>
        state.isValidating || state.isFormValidating || state.isFieldsValidating
    );

    const handleNext = async () => {
      if (isBusy) return;

      const { isValid } = await canGoNext(form, schema);

      if (isValid) {
        form.setFieldValue("step", "personal");
        return;
      }

      const step = form.store.state.values.step;
      const fields =
        step === "account" ? SIGNUP_FIELDS.account : SIGNUP_FIELDS.personal;

      await touchAndValidateFields(form, fields);

      toast.error("Kérjük javítsd a hibás mezőket!");
    };

    return (
      <>
        <div className='form__inputs'>
          {/* E-mail */}
          <form.AppField
            name='account.email'
            validators={{
              onChange: accountSchema.shape.account.shape.email,
            }}>
            {(field) => (
              <field.Input
                type='email'
                label='E-mail'
                required
                placeholder='minta@email.com'
                tabIndex={1}
                autoFocus
              />
            )}
          </form.AppField>

          {/* Felhasználónév */}
          <form.AppField
            name='account.username'
            validators={{
              onChange: accountSchema.shape.account.shape.username,
            }}>
            {(field) => (
              <field.Input
                type='text'
                label='Felhasználónév'
                required
                placeholder='minta2025'
                tabIndex={2}
              />
            )}
          </form.AppField>

          {/* Jelszó + megerősítés */}
          <FieldGroup columns={2}>
            <form.AppField
              name='account.password'
              validators={{
                onChange: accountSchema.shape.account.shape.password,
              }}>
              {(field) => (
                <field.Password
                  label='Jelszó'
                  required
                  placeholder='********'
                  tabIndex={3}
                />
              )}
            </form.AppField>

            <form.AppField
              name='account.passwordConfirmation'
              validators={{
                onChangeListenTo: ["account.password"],
                onChange: ({ value, fieldApi }) => {
                  const password = fieldApi.form.getFieldValue(
                    "account.password"
                  ) as string;

                  if (!value) return "A mező kitöltése kötelező.";

                  if (password && value !== password)
                    return "A jelszavak nem egyeznek.";

                  return undefined;
                },
              }}>
              {(field) => (
                <field.Password
                  label='Jelszó újra'
                  required
                  placeholder='********'
                  tabIndex={4}
                />
              )}
            </form.AppField>
          </FieldGroup>
        </div>

        <div className='form__buttons'>
          <Button
            type='button'
            disabled={isBusy}
            onClick={handleNext}
            text='Következő'
            className='primary'
            tabIndex={5}>
            <MoveRight />
          </Button>
        </div>
      </>
    );
  },
});

export default AccountStep;
