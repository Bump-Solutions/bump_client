/** 1..100 közé szorít, egészre kerekít */
export const clampDiscount = (d?: number | null): number | undefined => {
  return typeof d === "number"
    ? Math.max(1, Math.min(100, Math.floor(d)))
    : undefined;
};

/** Kedvezményes ár minor units-ben (pl. Ft), Math.round */
export const computeDiscounted = (amount: number, d?: number | null) => {
  const discount = clampDiscount(d);
  return discount ? Math.round((amount * (100 - discount)) / 100) : amount;
};

/** HU formázó – csak számcsoportosítás, valutajel nélkül */
const nfHU = new Intl.NumberFormat("hu-HU");
export const formatMinorHU = (amount: number) => nfHU.format(amount);

/** "-tól" suffix döntés (lista/kártya eset) */
export const fromSuffix = (hasMultiple: boolean) => {
  return hasMultiple ? " Ft-tól" : " Ft";
};

/** Kártya-listához: eredeti és kedvezményes „min ár” címkék előállítása */
export const buildListPriceLabels = (opts: {
  minPrice?: number | null;
  price?: number | null;
  discountedMinPrice?: number | null; // ha a szerver már számolta
  discountPercent?: number | null; // ha client oldalon kell számolni
  hasMultipleSizes: boolean; // product.itemsCount > 1.
}) => {
  const base = (opts.minPrice ?? opts.price ?? 0) | 0;
  const disc =
    opts.discountedMinPrice ??
    (opts.discountPercent != null
      ? computeDiscounted(base, opts.discountPercent)
      : undefined);

  const suffix = fromSuffix(opts.hasMultipleSizes);

  const origLabel = `${formatMinorHU(base)}${suffix}`;
  const discLabel =
    disc != null ? `${formatMinorHU(disc)}${suffix}` : undefined;

  return { base, disc, origLabel, discLabel };
};
