import { useMemo } from "react";
import { FacetProps } from "../../hooks/product/useFacetedSearch";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { Info } from "lucide-react";

interface PriceTagProps extends FacetProps {
  discount: number | null;
}

const PriceTag = ({
  quantity,
  discount,
  available,
  filtered,
  filteredCount,
}: PriceTagProps) => {
  const isFiltered = filteredCount > 0;
  const sourceItems = isFiltered ? filtered : available;
  if (!sourceItems || sourceItems.length === 0) return null;

  // 1) rendezett raw és discounted árak
  const rawPrices = useMemo(
    () => sourceItems.map((i) => i.price).sort((a, b) => a - b),
    [sourceItems]
  );
  if (!rawPrices.length) return null;

  const factor = discount && discount > 0 ? (100 - discount) / 100 : 1;
  const discPrices = rawPrices.map((p) => Math.round(p * factor));
  const fmt = (n: number) => n.toLocaleString();

  // 2) összegezzük az első N elemet (vagy az elsőt, ha quantity<=1)
  const count = Math.min(quantity, rawPrices.length);
  const origVal = rawPrices.slice(0, count).reduce((s, p) => s + p, 0);
  const discVal = discPrices.slice(0, count).reduce((s, p) => s + p, 0);

  // 3) döntsük el a végződést:
  //    - ha pontosan 1 elem van, mindig " Ft"
  //    - ha több elem, és nincs szűrés, akkor " Ft-tól"
  //    - különben " Ft"
  const suffix =
    quantity <= 1 && sourceItems.length > 1 && !isFiltered ? " Ft-tól" : " Ft";

  const origTitle = `${fmt(origVal)}${suffix}`;
  const discTitle = `${fmt(discVal)}${suffix}`;

  return (
    <div className='product__price-tag'>
      <h3>
        {discount && discount > 0 ? (
          <>
            <span className='discount'>{discTitle}</span>
            <span className='price__original'>{origTitle}</span>
          </>
        ) : (
          <span>{origTitle}</span>
        )}
      </h3>

      <div className='product__price__infobox'>
        <p>
          Az itt feltüntetett ár <b className='fc-gray-900'>tájékoztató</b>{" "}
          jellegű. A pontos végleges összegről érdeklődj az eladónál. <br />A
          tételek ára a termék állapotától, méretétől és egyéb jellemzőitől
          függően eltérhet.
        </p>
        <Link to={ROUTES.HOME} className='link black no-anim'>
          <Info /> Részletek
        </Link>
      </div>
    </div>
  );
};

export default PriceTag;
