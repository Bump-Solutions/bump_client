import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { CreateProductModel } from "../models/productModel";
import { Errors } from "../types/form";

interface SellContextType {
  data: CreateProductModel;
  updateData: (fields: Partial<CreateProductModel>) => void;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  clearErrors: () => void;
}

const INITIAL_DATA: CreateProductModel = {
  title: "",
  description: "",
  product: {
    isCatalog: true,
    id: null,
    brand: "",
    model: "",
    colorWay: "",
  },
  items: [],
  images: [],
};

export const SellContext = createContext<SellContextType | undefined>(
  undefined
);

interface SellProviderProps {
  children: ReactNode;
}

const SellProvider = ({ children }: SellProviderProps) => {
  const [data, setData] = useState<CreateProductModel>(INITIAL_DATA);
  const [errors, setErrors] = useState<Errors>({});

  const updateData = (fields: Partial<CreateProductModel>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const clearErrors = () => {
    if (errors) {
      Object.keys(errors).forEach((key) => {
        if (errors[key] !== "") {
          setErrors((prev) => ({
            ...prev,
            [key]: "",
          }));
          setData((prev) => ({
            ...prev,
            [key]: INITIAL_DATA[key as keyof CreateProductModel],
          }));
        }
      });
    }
  };

  return (
    <SellContext
      value={{
        data,
        updateData,
        errors,
        setErrors,
        clearErrors,
      }}>
      {children}
    </SellContext>
  );
};

export default SellProvider;
