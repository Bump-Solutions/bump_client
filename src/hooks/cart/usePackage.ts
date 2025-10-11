import { use } from "react";
import { PackageContext } from "../../context/PackageProvider";

export const usePackage = () => {
  const context = use(PackageContext);

  if (!context) {
    throw new Error("usePackage must be used within an PackageProvider");
  }

  return context;
};
