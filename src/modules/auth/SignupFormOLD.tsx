import "../../assets/css/multistepform.css";

import { Errors } from "../../types/form";
import { SignupModel } from "../../models/authModel";
import { FormEvent, useRef, useState, Fragment } from "react";
import { toast } from "sonner";

import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { ContactRound, User } from "lucide-react";
import { useSignup } from "../../hooks/auth/useSignup";
import { useLogin } from "../../hooks/auth/useLogin";

import { Check, MoveLeft, MoveRight, ClipboardPen } from "lucide-react";

import Button from "../../components/Button";
import StateButton from "../../components/StateButton";
import AccountForm from "./AccountForm";
import PersonalForm from "./PersonalForm";

const INITIAL_DATA: SignupModel = {
  email: "",
  username: "",
  password: "",
  passwordConfirmation: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  gender: null,
};

const SignupForm = () => {
  const accountRef = useRef<{ isValid: () => boolean }>(null);
  const personalRef = useRef<{ isValid: () => boolean }>(null);

  const [data, setData] = useState<SignupModel>(INITIAL_DATA);
  const [errors, setErrors] = useState<Errors>({});

  const updateData = (fields: Partial<SignupModel>) => {
    setData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const { steps, currentStepIndex, isFirstStep, isLastStep, next, prev, goTo } =
    useMultiStepForm([
      {
        label: "Fiók információ",
        svg: <User />,
        ref: accountRef,
        component: (
          <AccountForm
            ref={accountRef}
            {...data}
            updateData={updateData}
            errors={errors}
            setErrors={setErrors}
          />
        ),
      },
      {
        label: "Személyes adatok",
        svg: <ContactRound />,
        ref: personalRef,
        component: (
          <PersonalForm
            ref={personalRef}
            {...data}
            updateData={updateData}
            errors={errors}
            setErrors={setErrors}
          />
        ),
      },
    ]);

  const clearErrors = () => {
    if (errors) {
      Object.keys(errors).forEach((key) => {
        if (errors[key] !== "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [key]: "",
          }));
          setData((prevData) => ({
            ...prevData,
            [key]: "",
          }));
        }
      });
    }
  };

  const loginMutation = useLogin();
  const signupMutation = useSignup(
    (response) => {
      // console.log(response);

      loginMutation.mutateAsync({ email: data.email, password: data.password });
      setData(INITIAL_DATA);
      // navigate(ROUTES.LOGIN);
    },
    (error) => {
      if (typeof error?.response?.data.message === "object") {
        Object.entries(
          error.response!.data.message as Record<string, string[]>
        ).forEach(([field, messages]: [string, string[]]) => {
          setErrors((prev) => ({
            ...prev,
            [field]: messages[0],
          }));
        });
      }

      if (
        error?.response?.data.message.email ||
        error?.response?.data.message.username
      ) {
        goTo(0);
      }
    }
  );

  const handleSignup = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Personal ref can be only valid id the account ref is already valid
    const isValid = personalRef.current?.isValid();
    if (!isValid) {
      return Promise.reject("Invalid fields");
    }

    const formattedData = {
      ...data,
      gender: data.gender ?? null,
    };

    const signupPromise = signupMutation.mutateAsync(formattedData);

    toast.promise(signupPromise, {
      loading: "Regisztráció folyamatban...",
      success: "Sikeres regisztráció. Bejelentkezés...",
      error: "Kérjük javítsd a hibás mezőket!",
    });

    return signupPromise;
  };

  return (
    <form className='multi-step-form'>
      <div className='form__header'>
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div
              className={
                index < currentStepIndex
                  ? "form__step valid"
                  : index === currentStepIndex
                  ? "form__step active"
                  : "form__step"
              }
              onClick={() => {
                clearErrors();
                goTo(index);
              }}>
              {index < currentStepIndex ? (
                <h3>
                  <Check strokeWidth={3} />
                </h3>
              ) : (
                <h3>{step.svg}</h3>
              )}
              <h4>{step.label}</h4>
            </div>
            <span
              className={
                index < steps.length - 1 ? "form__divider" : ""
              }></span>
          </Fragment>
        ))}
      </div>

      <div className='form__body'>
        <div>{steps[currentStepIndex].component}</div>

        <div className='form__buttons'>
          {!isFirstStep && (
            <Button
              type='button'
              text='Vissza'
              className='tertiary'
              onClick={() => {
                clearErrors();
                prev();
              }}
              tabIndex={5}>
              <MoveLeft />
            </Button>
          )}

          {!isLastStep ? (
            <Button
              type='button'
              text='Következő'
              className='tertiary icon--reverse'
              onClick={(e) => next(e)}
              tabIndex={6}>
              <MoveRight />
            </Button>
          ) : (
            <StateButton
              type='submit'
              text='Regisztráció'
              className='primary'
              onClick={handleSignup}
              tabIndex={6}>
              <ClipboardPen />
            </StateButton>
          )}
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
