import { withForm } from "../../hooks/form/hooks";
import { useStore } from "@tanstack/react-form";
import { accountSchema } from "../../schemas/signupSchema";
import { signupFormOptions } from "../../utils/formOptions";
import { canGoNext, touchAndValidateFields } from "../../utils/form";
import { toast } from "sonner";
import { ACCOUNT_FIELDS, PERSONAL_FIELDS } from "./SignupForm";

import FieldGroup from "../../components/form/FieldGroup";
import Button from "../../components/Button";

import { MoveRight } from "lucide-react";

const AccountStep = withForm({
  ...signupFormOptions,
  render: function Render({ form }) {
    const isBusy = useStore(
      form.store,
      (state) =>
        state.isValidating || state.isFormValidating || state.isFieldsValidating
    );

    const handleNext = async () => {
      if (isBusy) return;

      const { isValid } = await canGoNext(form);

      if (isValid) {
        form.setFieldValue("section", "personal");
        return;
      }

      const section = form.store.state.values.section as "account" | "personal";
      const fields = section === "account" ? ACCOUNT_FIELDS : PERSONAL_FIELDS;

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
