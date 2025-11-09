import { useFieldContext } from "../../hooks/form/hooks";
import Select, { Option } from "../Select";
import FormBase, { FormControlProps } from "./FormBase";

type BaseProps<T = string | number> = FormControlProps & {
  options: Option<T>[];
  isSearchable?: boolean;
  placeholder?: string;
  tabIndex?: number;
};

type FormSelectSingleProps<T> = BaseProps<T> & {
  isMulti?: false;
};

type FormSelectMultiProps<T> = BaseProps<T> & {
  isMulti: true;
};

type FormSelectProps<T = string | number> =
  | FormSelectSingleProps<T>
  | FormSelectMultiProps<T>;

const FormSelect = <T extends string | number>(props: FormSelectProps<T>) => {
  const field = useFieldContext<T | T[] | null>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const onChangeSingle = (next: T | null) => {
    field.handleChange(next);
  };

  const onChangeMulti = (next: Array<T>) => {
    field.handleChange(next);
  };

  return (
    <FormBase {...props}>
      {props.isMulti ? (
        <Select
          name={field.name}
          required={props.required}
          placeholder={props.placeholder}
          options={props.options}
          isMulti={true}
          isSearchable={props.isSearchable}
          value={field.state.value as T[]}
          onChange={onChangeMulti}
          isInvalid={isInvalid}
          tabIndex={props.tabIndex}
        />
      ) : (
        <Select
          name={field.name}
          required={props.required}
          placeholder={props.placeholder}
          options={props.options}
          isMulti={false}
          isSearchable={props.isSearchable}
          value={field.state.value as T | null}
          onChange={onChangeSingle}
          isInvalid={isInvalid}
          tabIndex={props.tabIndex}
        />
      )}
    </FormBase>
  );
};

export default FormSelect;
