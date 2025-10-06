import { CURRENCY_LABELS } from "../../utils/mappers";
import { formatMinorHU } from "../../utils/pricing";
import { useCart } from "../../hooks/cart/useCart";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
interface CartSummaryNote {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
}

const NOTES: CartSummaryNote[] = [
  {
    type: "info",
    title: "Hogyan működik a kosár? 🛒",
    message:
      "Itt látod az eladónként létrehozott termékcsomagjaidat. A vásárlás eladónként, közvetlen kapcsolatfelvétellel történik.",
  },
  {
    type: "success",
    title: "Tipp: 💡",
    message:
      "A végösszeg tájékoztató; a szállítás és az árak eladónként egyeztetendők.",
  },
];

const CartSummary = () => {
  const { cart } = useCart();
  if (!cart) return null;

  const { grossSubtotal, discountsTotal, indicativeSubtotal, itemsCount } =
    cart.summary;

  return (
    <article className='cart__summary'>
      <h1>Összegzés</h1>

      {NOTES.map((note, index) => (
        <blockquote key={index} className={`note ${note.type}`}>
          <strong>{note.title}</strong>
          <p>{note.message}</p>
        </blockquote>
      ))}

      <div className='rows'>
        <div className='row'>
          <span>{itemsCount} tétel</span>
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

      <Link to={ROUTES.HOME} className='link mx-auto'>
        Vásárlás folytatása
      </Link>
    </article>
  );
};

export default CartSummary;
