import { ReportType } from "../../types/report";
import { Option, Errors } from "../../types/form";
import { FormEvent, useState } from "react";
import { useReport } from "../../hooks/report/useReport";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useDebounce } from "../../hooks/useDebounce";
import { useMounted } from "../../hooks/useMounted";

import Input from "../../components/Input";
import Select from "../../components/Select";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";
import StateButton from "../../components/StateButton";

import { Flag } from "lucide-react";

interface ReportFormProps {
  type: ReportType;
  id: string | undefined;
}

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  options?: Option[];
}

const FIELDS: Record<ReportType, Field[]> = {
  product: [
    {
      name: "rprt_reason",
      label: "Jelentés oka",
      type: "select",
      placeholder: "Válassz az alábbiak közül ...",
      options: [
        {
          value: 0,
          label: "Hamis termék",
          description:
            "Nem eredeti, márkajelzés vagy csomagolás alapján hamisítvány gyanús.",
        },
        {
          value: 1,
          label: "Csalás",
          description:
            "A hirdetés gyanús vagy félrevezető, az eladó viselkedése nem tűnik megbízhatónak.",
        },
        {
          value: 2,
          label: "Tiltott tartalom",
          description: "A termék nem felel meg a platform szabályainak.",
        },
        {
          value: 3,
          label: "Egyéb",
          description: "Nem szerepel a listában – részletezd lentebb.",
        },
      ],
      required: true,
    },
    {
      name: "rprt_description",
      label: "Részletes leírás",
      type: "textarea",
      placeholder: "Írd le részletesen, miért jelented ezt a terméket.",
      required: false,
    },
  ],
  user: [],
};

const TITLES: Record<ReportType, string> = {
  product: "Termék jelentése",
  user: "Felhasználó jelentése",
};

const DESCRIPTIONS: Record<ReportType, string> = {
  product:
    "Törekszünk arra, hogy a termékinformációk pontosak és hitelesek legyenek. Ha ez a termék hamis, félrevezető vagy nem a valóságnak megfelelő, kérjük, jelentsd nekünk. A bejelentéseket bizalmasan vizsgáljuk ki.",
  user: "Fontos számunkra, hogy a sneaker közösség biztonságos és tisztességes maradjon. Ha ez a felhasználó megtévesztő adatokat ad meg, hamis terméket kínál vagy tisztességtelenül kereskedik, kérjük, jelentsd. Minden esetet bizalmasan kezelünk és kivizsgálunk.",
};

const LABELS: Record<ReportType, string> = {
  product: "termék",
  user: "felhasználó",
};

const INITIAL_DATA: Record<string, any> = {
  rprt_reason: null,
  rprt_description: "",
};

const ReportForm = ({ type, id }: ReportFormProps) => {
  const navigate = useNavigate();

  const fields = FIELDS[type];
  const [formData, setFormData] = useState<Record<string, any>>(INITIAL_DATA);

  const [errors, setErrors] = useState<Errors>({});
  const isMounted = useMounted();

  fields.forEach((field) => {
    useDebounce(
      () => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.name]: "",
        }));
      },
      0,
      [formData[field.name]]
    );
  });

  const reportMutation = useReport((resp, variables) => {
    setTimeout(() => {
      if (isMounted()) {
        navigate(-1);
      }
    }, 1000);
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const inputFields = fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = formData[field.name] || "";
      }
      return acc;
    }, {} as Record<string, string>);

    const emptyInputs = Object.keys(inputFields).filter((key) => {
      const value = inputFields[key];

      if (typeof value === "string") {
        return value.trim() === "";
      }

      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length === 0;
      }

      return !value; // ha undefined/null
    });

    if (emptyInputs.length > 0) {
      emptyInputs.forEach((input) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [input]: "A mező kitöltése kötelező.",
        }));
      });
      toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
      return Promise.reject("Empty inputs");
    }

    if (Object.values(errors).some((x) => x !== "")) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      return Promise.reject("Invalid fields");
    }

    const reportPromise = reportMutation.mutateAsync({
      type,
      id: parseInt(id!),
      reason: formData.rprt_reason.value,
      description: formData.rprt_description,
    });

    toast.promise(reportPromise, {
      loading: "Jelentés folyamatban...",
      success: "Jelentés elküldve.",
      error: (err) =>
        (err?.response?.data?.message as string) ||
        `Hiba a ${LABELS[type]} jelentése közben.`,
    });

    return reportPromise;
  };

  return (
    <>
      <h1 className='modal__title'>🚩 {TITLES[type]}</h1>
      <div className='modal__content'>
        <p>{DESCRIPTIONS[type]}</p>

        <form className='pt-1'>
          {fields.map((field) => {
            switch (field.type) {
              case "text":
                return (
                  <Input
                    key={field.name}
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(val) => handleChange(field.name, val)}
                    error={errors[field.name]}
                  />
                );
              case "select":
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    options={field.options || []}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(val) => handleChange(field.name, val)}
                    error={errors[field.name]}
                  />
                );
              case "textarea":
                return (
                  <TextArea
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={(val) => handleChange(field.name, val)}
                    rows={5}
                    maxLength={500}
                    error={errors[field.name]}
                  />
                );
              default:
                return null;
            }
          })}
        </form>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={reportMutation.isPending}
          onClick={() => navigate(-1)}
        />
        <StateButton
          className='secondary red'
          text='Jelentés'
          onClick={handleFormSubmit}>
          <Flag />
        </StateButton>
      </div>
    </>
  );
};

export default ReportForm;
