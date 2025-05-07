import { use } from "react";
import { SellContext } from "../../context/SellProvider";

export const useSell = () => {
  const context = use(SellContext);

  if (!context) {
    throw new Error("useSell must be used within an SellProvider");
  }

  return context;
};
