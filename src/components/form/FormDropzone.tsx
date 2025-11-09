import { Accept } from "react-dropzone/.";
import { useFieldContext } from "../../hooks/form/hooks";
import FormBase, { FormControlProps } from "./FormBase";

import Dropzone from "../Dropzone";

type FormDropzoneProps = FormControlProps & {
  accept?: Accept;
  multiple?: boolean;
  maxFiles: number;
  maxSize?: number;
};

const FormDropzone = ({
  accept,
  multiple,
  maxFiles,
  maxSize,
  ...base
}: FormDropzoneProps) => {
  const field = useFieldContext<File | File[] | null>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const onDrop = (accepted: File[]) => {
    if (!accepted.length) return;

    const next = multiple ? accepted : accepted[0];
    field.setValue(next);
    field.handleBlur();
  };

  const onDropRejected = (rejections: { errors: { code: string }[] }[]) => {
    const code = rejections[0]?.errors[0]?.code;

    let message = "Hiba történt a fájl feltöltése során.";

    switch (code) {
      case "file-too-large":
        message = "A fájl mérete túl nagy. A megengedett méret 1MB.";
        break;
      case "file-invalid-type":
        message = "Hibás fájl formátum. Megengedett: PNG/JPG/JPEG/WebP.";
        break;
    }

    field.setValue(multiple ? [] : null);
    field.setMeta((meta) => ({
      ...meta,
      errors: [message],
      errorMap: { onChange: message },
      isTouched: true,
    }));
    field.handleBlur();
  };

  return (
    <FormBase {...base}>
      <Dropzone
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxSize={maxSize}
        isInvalid={isInvalid}
      />
    </FormBase>
  );
};

export default FormDropzone;
