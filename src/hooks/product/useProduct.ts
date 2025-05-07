import { use } from "react";
import { ProductContext } from "../../context/ProductProvider";

export const useProduct = () => {
  const context = use(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within an ProductProvider");
  }

  return context;
};
