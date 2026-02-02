import { useFieldContext } from "../../hooks/form/hooks";
import Currency from "../Currency";
import FormBase, { FormControlProps } from "./FormBase";

type FormInputProps = FormControlProps & {
  placeholder?: string;

  currency?: string;
  currencies?: string[];
  onCurrencyChange?: (currency: string) => void;

  allowNegative?: boolean;
  maxValue?: number;

  suffix?: string;
  decimalSeparator?: "." | ",";
  thousandSeparator?: "." | "," | " ";
  decimalScale?: number;

  autoFocus?: boolean;
  tabIndex?: number;
};

const FormCurrency = (props: FormInputProps) => {
  const field = useFieldContext<number>();

  const success = Boolean(field.state.value) && field.state.meta.isValid;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Currency
        name={field.name}
        required={props.required}
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        currency={props.currency}
        currencies={props.currencies}
        onCurrencyChange={props.onCurrencyChange}
        allowNegative={props.allowNegative}
        maxValue={props.maxValue}
        suffix={props.suffix}
        decimalSeparator={props.decimalSeparator}
        thousandSeparator={props.thousandSeparator}
        decimalScale={props.decimalScale}
        success={success}
        isInvalid={isInvalid}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
      />
    </FormBase>
  );
};

export default FormCurrency;
