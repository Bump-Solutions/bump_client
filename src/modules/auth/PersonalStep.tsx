import { MouseEvent } from "react";
import { toast } from "sonner";
import { withForm } from "../../hooks/form/hooks";
import { personalSchema } from "../../schemas/signupSchema";
import { ENUM } from "../../utils/enum";
import { resetErroredFields } from "../../utils/form";
import { signupFormOptions } from "../../utils/formOptions";
import { SIGNUP_FIELDS } from "./SignupForm";

import Button from "../../components/Button";
import FieldGroup from "../../components/form/FieldGroup";
import StateButton from "../../components/StateButton";

import { ClipboardPen, MoveLeft } from "lucide-react";

const PersonalStep = withForm({
  ...signupFormOptions,
  render: function Render({ form }) {
    const handlePrev = () => {
      resetErroredFields(form, SIGNUP_FIELDS.personal);
      form.setFieldValue("step", "account");
    };

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      await form.handleSubmit();
      if (!form.store.state.isValid) {
        toast.error("Kérjük javítsd a hibás mezőket!");
        throw new Error("Invalid form submission");
      }
    };

    return (
      <>
        <div className='form__inputs'>
          {/* Keresztnév + vezetéknév */}
          <FieldGroup columns={2}>
            <form.AppField
              name='personal.lastName'
              validators={{
                onChange: personalSchema.shape.personal.shape.lastName,
              }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Vezetéknév'
                  required
                  placeholder='Vezetéknév'
                  tabIndex={1}
                  autoFocus
                />
              )}
            </form.AppField>

            <form.AppField
              name='personal.firstName'
              validators={{
                onChange: personalSchema.shape.personal.shape.firstName,
              }}>
              {(field) => (
                <field.Input
                  type='text'
                  label='Keresztnév'
                  required
                  placeholder='Keresztnév'
                  tabIndex={2}
                />
              )}
            </form.AppField>
          </FieldGroup>

          <form.AppField
            name='personal.phoneNumber'
            validators={{
              onChange: personalSchema.shape.personal.shape.phoneNumber,
            }}>
            {(field) => (
              <field.Phone
                label='Mobil telefonszám'
                required
                placeholder='+3630-123-4567'
                tabIndex={3}
              />
            )}
          </form.AppField>

          <form.AppField
            name='personal.gender'
            validators={{
              onChange: personalSchema.shape.personal.shape.gender,
            }}>
            {(field) => (
              <field.Select
                label='Nem'
                options={ENUM.AUTH.GENDER_OPTIONS}
                tabIndex={4}
              />
            )}
          </form.AppField>
        </div>

        <div className='form__buttons'>
          <Button
            type='button'
            onClick={handlePrev}
            text='Vissza'
            className='tertiary'
            tabIndex={4}>
            <MoveLeft />
          </Button>

          <StateButton
            type='submit'
            onClick={handleSubmit}
            text='Regisztráció'
            className='primary'
            tabIndex={5}>
            <ClipboardPen />
          </StateButton>
        </div>
      </>
    );
  },
});

export default PersonalStep;
