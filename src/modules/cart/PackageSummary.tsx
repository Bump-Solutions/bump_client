import { ROUTES } from "../../routes/routes";
import { CURRENCY_LABELS } from "../../utils/mappers";
import { Link } from "react-router";
import { CartPackageModel } from "../../models/cartModel";
import { useCart } from "../../hooks/cart/useCart";
import { formatMinorHU } from "../../utils/pricing";

import StateButton from "../../components/StateButton";

import { Send } from "lucide-react";

interface PackageSummaryProps {
  pkg: CartPackageModel;
}

const PackageSummary = ({ pkg }: PackageSummaryProps) => {
  const { grossSubtotal, discountsTotal, indicativeSubtotal } = pkg.summary;

  const handleCreateOrder = () => {
    return Promise.resolve();
  };

  return (
    <article className='package__summary'>
      <h1>
        Összegzés -{" "}
        <Link
          to={ROUTES.PROFILE(pkg.seller.username).ROOT}
          className='link blue italic mb-0 fw-600'>
          @{pkg.seller.username}
        </Link>
      </h1>

      <div className='rows'>
        <div className='row'>
          <span>
            {pkg.products.reduce(
              (acc, product) => acc + product.items.length,
              0
            )}{" "}
            tétel
          </span>
        </div>

        <div className='row'>
          <span>Részösszeg (kedvezmény nélkül)</span>
          <span>
            {formatMinorHU(grossSubtotal.amount)}{" "}
            {CURRENCY_LABELS[grossSubtotal.currency]}
          </span>
        </div>

        {discountsTotal.amount > 0 && (
          <div className='row discount'>
            <span>Kedvezmények</span>
            <span>
              − {formatMinorHU(discountsTotal.amount)}{" "}
              {CURRENCY_LABELS[discountsTotal.currency]}
            </span>
          </div>
        )}

        <div className='row'>
          <span>Szállítási költség</span>
          <span>egyeztetendő</span>
        </div>

        <hr className='divider soft' />

        <div className='row total'>
          <span>
            Tájékoztató végösszeg <br />
          </span>
          <span>
            {formatMinorHU(indicativeSubtotal.amount)}{" "}
            {CURRENCY_LABELS[indicativeSubtotal.currency]}
          </span>
        </div>

        <div className='row small'>
          <span>(bruttó)</span>
        </div>
      </div>

      <StateButton
        className='primary mx-auto w-full'
        text='Üzenet az eladónak'
        onClick={handleCreateOrder}>
        <Send />
      </StateButton>

      <Link to={ROUTES.HOME} className='link d-block mx-auto mt-1 fs-16'>
        Vásárlás folytatása
      </Link>
    </article>
  );
};

export default PackageSummary;
