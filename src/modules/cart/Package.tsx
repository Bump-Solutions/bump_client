import { useMemo } from "react";
import { PackageContext } from "../../context/PackageProvider";
import { CartPackageModel } from "../../models/cartModel";
import { HighlightIndex } from "../../utils/highlight";

import PackageSummary from "./PackageSummary";
import PackageHeader from "./PackageHeader";

interface PackageProps {
  pkg: CartPackageModel;
  highlightIndex?: HighlightIndex;
}

const Package = ({ pkg, highlightIndex }: PackageProps) => {
  const contextValue = useMemo(
    () => ({ pkg, highlightIndex }),
    [pkg, highlightIndex]
  );

  return (
    <PackageContext.Provider value={contextValue}>
      <li className='package__wrapper'>
        <div className='package'>
          <PackageHeader />
        </div>

        <PackageSummary />
      </li>
    </PackageContext.Provider>
  );
};

export default Package;
