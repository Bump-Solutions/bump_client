import { ROUTES } from "../../routes/routes";
import { CURRENCY_LABELS } from "../../utils/mappers";
import { MouseEvent } from "react";
import { Link } from "react-router";
import { formatMinorHU } from "../../utils/pricing";
import { usePackage } from "../../hooks/cart/usePackage";
import { CreateOrderModel } from "../../models/orderModel";
import { toast } from "sonner";
import { useCreateOrder } from "../../hooks/order/useCreateOrder";

import StateButton from "../../components/StateButton";

import { Send } from "lucide-react";

const PackageSummary = () => {
  const { pkg } = usePackage();
  const { grossSubtotal, discountsTotal, indicativeSubtotal } = pkg.summary;

  const createOrderMutation = useCreateOrder((response) => {});

  const handleCreateOrder = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (createOrderMutation.isPending) return Promise.reject();
    if (!pkg) return Promise.reject();

    const newOrder: CreateOrderModel = {
      source: "cart",
      sellerId: pkg.seller.id,
    };

    const createOrderPromise = createOrderMutation.mutateAsync({ newOrder });

    toast.promise(createOrderPromise, {
      loading: "Rendelés létrehozása...",
      success: (
        <span>
          A rendelés létrehozva. Rendelésed nyomon követheted{" "}
          <Link
            to={ROUTES.ORDERS}
            target='_blank'
            className='link fc-green-600 underline fw-700'>
            itt.
          </Link>
        </span>
      ),
      error: (err) =>
        // (err?.response?.data?.message as string) ||
        "Hiba a rendelés létrehozása során.",
    });

    return createOrderPromise;
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
        disabled={createOrderMutation.isPending}
        onClick={handleCreateOrder}>
        <Send />
      </StateButton>

      <Link
        to={ROUTES.PROFILE(pkg.seller.username).PRODUCTS}
        className='link d-block mx-auto mt-1 fs-16'>
        Még több termék
      </Link>
    </article>
  );
};

export default PackageSummary;
