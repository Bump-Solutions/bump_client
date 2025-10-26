import { ACCOUNT_FIELDS, PERSONAL_FIELDS } from "./SignupForm";
import {
  canGoNext,
  resetErroredFields,
  touchAndValidateFields,
} from "../../utils/form";
import { withForm } from "../../hooks/form/hooks";
import { signupFormOptions } from "../../utils/formOptions";
import { useStore } from "@tanstack/react-form";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

import { Check, ContactRound, User } from "lucide-react";

type SectionId = "account" | "personal";

const STEPS = [
  { id: "account", label: "Fiók információ", svg: <User /> },
  { id: "personal", label: "Személyes információ", svg: <ContactRound /> },
] as const satisfies ReadonlyArray<{
  id: SectionId;
  label: string;
  svg: React.ReactNode;
}>;

const stepIndexById: Record<SectionId, number> = Object.fromEntries(
  STEPS.map((s, i) => [s.id, i])
) as Record<SectionId, number>;

const SignupFormHeader = withForm({
  ...signupFormOptions,
  render: function Render({ form }) {
    const section = useStore(form.store, (state) => state.values.section);
    const currentStepIndex = stepIndexById[section];

    const handleClickStep = async (targetId: SectionId) => {
      const targetIndex = stepIndexById[targetId];

      // VISSZA: mindig engedjük
      if (targetIndex <= currentStepIndex) {
        const toClear =
          section === "personal" ? PERSONAL_FIELDS : ACCOUNT_FIELDS;
        resetErroredFields(form, toClear);

        form.setFieldValue("section", targetId);
        return;
      }

      const { isValid } = await canGoNext(form);

      // ELŐRE: csak ha a current step valid
      if (isValid) {
        form.setFieldValue("section", targetId);
        return;
      }

      const fields = section === "account" ? ACCOUNT_FIELDS : PERSONAL_FIELDS;
      await touchAndValidateFields(form, fields);

      toast.error("Kérjük javítsd a hibás mezőket!");
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
