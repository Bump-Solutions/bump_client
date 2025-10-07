import { CartPackageModel } from "../../models/cartModel";
import { HighlightIndex } from "../../utils/highlight";

import PackageSummary from "./PackageSummary";

interface PackageProps {
  pkg: CartPackageModel;
  highlightIndex?: HighlightIndex;
}

const Package = ({ pkg, highlightIndex }: PackageProps) => {
  return (
    <li className='package__wrapper'>
      <div className='package'></div>

      <PackageSummary pkg={pkg} />
    </li>
  );
};

export default Package;
