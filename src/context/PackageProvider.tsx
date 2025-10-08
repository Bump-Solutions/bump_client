import { createContext } from "react";
import { CartPackageModel } from "../models/cartModel";
import { HighlightIndex } from "../utils/highlight";

interface PackageContextType {
  pkg: CartPackageModel;
  highlightIndex?: HighlightIndex;
}

export const PackageContext = createContext<PackageContextType | undefined>(
  undefined
);
