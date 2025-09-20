import { useCart } from "../../hooks/trade/useCart";

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

  return (
    <article className='cart__summary'>
      <h1>Összegzés</h1>

      {NOTES.map((note, index) => (
        <div key={index} className={`note ${note.type}`}>
          <strong>{note.title}</strong>
          <p>{note.message}</p>
        </div>
      ))}
    </article>
  );
};

export default CartSummary;
