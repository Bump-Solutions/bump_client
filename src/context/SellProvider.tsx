import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { CatalogProduct, Item } from "../types/product";
import { UploadedFile } from "../types/form";
import { Errors } from "../types/form";

export interface SellFormData {
  isCatalogProduct: boolean;
  title: string;
  description: string;
  product: Partial<CatalogProduct>;
  items: Item[];
  images: UploadedFile[];
}

interface SellContextType {
  data: SellFormData;
  updateData: (fields: Partial<SellFormData>) => void;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  clearErrors: () => void;
}

const INITIAL_DATA: SellFormData = {
  isCatalogProduct: true,
  title: "",
  description: "",
  product: null,
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
  const [data, setData] = useState<SellFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Errors>({});

  const updateData = (fields: Partial<SellFormData>) => {
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
            [key]: INITIAL_DATA[key as keyof SellFormData],
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
