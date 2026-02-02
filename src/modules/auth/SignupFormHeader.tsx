import { useStore } from "@tanstack/react-form";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";
import { withForm } from "../../hooks/form/hooks";
import { accountSchema, personalSchema } from "../../schemas/signupSchema";
import { resetErroredFields, validateStep } from "../../utils/form";
import { signupFormOptions } from "../../utils/formOptions";
import { SIGNUP_FIELDS } from "./SignupForm";

import { Check, ContactRound, User } from "lucide-react";

type StepId = "account" | "personal";

const STEPS = [
  { id: "account", label: "Fiók információ", svg: <User /> },
  { id: "personal", label: "Személyes információ", svg: <ContactRound /> },
] as const satisfies ReadonlyArray<{
  id: StepId;
  label: string;
  svg: React.ReactNode;
}>;

const stepIndexById: Record<StepId, number> = Object.fromEntries(
  STEPS.map((s, i) => [s.id, i]),
) as Record<StepId, number>;

const SignupFormHeader = withForm({
  ...signupFormOptions,
  render: function Render({ form }) {
    const step = useStore(form.store, (state) => state.values.step);
    const schema = step === "account" ? accountSchema : personalSchema;
    const fields =
      step === "account" ? SIGNUP_FIELDS.account : SIGNUP_FIELDS.personal;

    const currentStepIndex = stepIndexById[step];

    const handleClickStep = async (targetId: StepId) => {
      const targetIndex = stepIndexById[targetId];

      // VISSZA: mindig engedjük
      if (targetIndex <= currentStepIndex) {
        const toClear =
          step === "personal" ? SIGNUP_FIELDS.personal : SIGNUP_FIELDS.account;
        resetErroredFields(form, toClear);

        form.setFieldValue("step", targetId);
        return;
      }

      const { isValid } = await validateStep(form, fields, {
        schema,
        cause: "submit",
      });

      if (!isValid) {
        toast.error("Kérjük javítsd a hibás mezőket!");
        return;
      }

      form.setFieldValue("step", targetId);
    };

    return (
      <div className='form__header'>
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          const stepClassNames = [
            "form__step",
            isActive && "active",
            isCompleted && "valid",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <Fragment key={step.id}>
              <div
                className={stepClassNames}
                onClick={() => handleClickStep(step.id)}>
                <h3>{isCompleted ? <Check strokeWidth={3} /> : step.svg}</h3>
                <h4>{step.label}</h4>
              </div>

              <span
                className={index < STEPS.length - 1 ? "form__divider" : ""}
              />
            </Fragment>
          );
        })}
      </div>
    );
  },
});

export default SignupFormHeader;
