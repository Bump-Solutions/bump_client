import { REGEX } from "../../utils/regex";
import { ENUM } from "../../utils/enum";
import { Option, Errors } from "../../types/form";

import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
} from "react";
import { SignupModel } from "../../models/authModel";

import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../hooks/useToast";

import Input from "../../components/Input";
import Phone from "../../components/Phone";
import Select from "../../components/Select";

interface PersonalFormProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Option<number> | null;
  updateData: (fields: Partial<SignupModel>) => void;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

interface PersonalFormRef {
  isValid: () => boolean;
}

const PersonalForm = forwardRef<PersonalFormRef, PersonalFormProps>(
  (
    { firstName, lastName, phoneNumber, gender, updateData, errors, setErrors },
    ref
  ) => {
    const { addToast } = useToast();

    useImperativeHandle(ref, () => ({ isValid }));

    const isValid = () => {
      const inputFields = { firstName, lastName, phoneNumber };

      const emptyInputs = (
        Object.keys(inputFields) as Array<keyof typeof inputFields>
      ).filter((key) => inputFields[key] === "");

      if (emptyInputs.length > 0) {
        emptyInputs.forEach((key) => {
          setErrors((prev) => ({
            ...prev,
            [key]: "A mező kitöltése kötelező.",
          }));
        });

        addToast("error", "Kérjük töltsd ki a csillaggal jelölt mezőket!");

        return false;
      }

      if (Object.values(errors).some((x) => x !== "")) {
        addToast("error", "Kérjük javítsd a hibás mezőket!");
        return false;
      }

      return true;
    };

    useDebounce(
      () => {
        // Validate first name and last name
        if (firstName && !REGEX.NAME.test(firstName)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            firstName: "Hibás keresztnév formátum.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            firstName: "",
          }));
        }

        if (lastName && !REGEX.NAME.test(lastName)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            lastName: "Hibás vezetéknév formátum.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            lastName: "",
          }));
        }
      },
      250,
      [firstName, lastName]
    );

    useDebounce(
      () => {
        // Validate phone number
        if (phoneNumber && !REGEX.PHONE.test(phoneNumber)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: "Hibás telefonszám. Formátum: +36xx-xxx-xxxx",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: "",
          }));
        }
      },
      250,
      [phoneNumber]
    );

    useDebounce(
      () => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          gender: "",
        }));
      },
      0,
      [gender]
    );

    const handleChangeSelect = (option: Option<number> | null) => {
      updateData({
        gender: option,
      });
    };

    return (
      <div className='form__inputs'>
        <div className='field__wrapper'>
          <Input
            type='text'
            name='sn_lastname'
            value={lastName}
            label='Vezetéknév'
            required
            placeholder='Vezetéknév'
            onChange={(value) => {
              updateData({ lastName: value });
            }}
            error={errors.lastName}
            success={!!lastName && !errors.lastName}
            autoFocus
          />
          <Input
            type='text'
            name='sn_firstname'
            value={firstName}
            label='Keresztnév'
            required
            placeholder='Keresztnév'
            onChange={(value) => {
              updateData({ firstName: value });
            }}
            error={errors.firstName}
            success={!!firstName && !errors.firstName}
          />
        </div>

        <Phone
          name='sn_phone'
          value={phoneNumber}
          placeholder='Formátum: +3630-123-4567'
          label='Mobil telefonszám'
          required
          onChange={(value) => {
            updateData({ phoneNumber: value });
          }}
          error={errors.phoneNumber}
          success={!!phoneNumber && !errors.phoneNumber}
        />

        <Select
          name='sn_gender'
          value={gender}
          label='Nem'
          options={ENUM.AUTH.GENDER_OPTIONS}
          placeholder='Válassz az alábbiak közül ...'
          onChange={(option) =>
            handleChangeSelect(option as Option<number> | null)
          }
        />
      </div>
    );
  }
);

export default PersonalForm;
