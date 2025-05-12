import { use } from "react";
import { TradeContext } from "../../context/TradeProvider";

export const useCart = () => {
  const context = use(TradeContext);

  if (!context) {
    throw new Error("useCart must be used within an TradeProvider");
  }

  return context;
};
