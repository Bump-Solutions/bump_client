// --- Alap típusok ------------------------------------------------------------
export interface SellerModel {
  id: number;
  username: string;
  profilePicture: string | null;
  // opcionális: rating, city, stb.
}

/** Pénz: minor units (pl. 42000 = 42 000 Ft) */
export interface MoneyModel {
  amount: number;
  currency: "HUF" | "EUR" | "USD";
}

/** Katalógus/termék snapshot – kép és általános meta a termékszinthez */
export interface CatalogProductRefModel {
  id: number; // pl. "Nike Air Force 1 Triple White" katalógus ID
  title: string; // megjelenítéshez
  brand: string; // pl. "Nike"
  model: string; // pl. "Air Force 1"
  colorWay: string; // pl. "Triple White"
  category: string; // pl. "sneaker"
  colors: string; // Comma separated colors
  image: string; // termék borítókép (a tételeknek nincs saját képük)
}

/** Tétel állapot (szinkron után UI-jelzésekhez) */
export type CartItemState =
  | "available"
  | "reserved"
  | "sold"
  | "unavailable"
  | "price_changed"
  | "removed";

// --- Kedvezmény --------------------------------------------------------------
/** 1–100 közötti egész százalék (pl. 10 = -10%) */
export type DiscountPercent = number; // runtime-ban validáld (1..100)

// --- Line item (egy konkrét termék-ITEM, nincs quantity) ---------------------
/** Egy KOSÁR-tétel = egy konkrét termék-item (nincs quantity) */
export interface CartItemModel {
  /** A PRODUCT ITEM azonosítója (nem a katalógus terméké) */
  id: number;

  /** Item-specifikus attribútumok */
  size: string; // pl. "42 EU"
  gender: number; // 0=unisex, 1=férfi, 2=női, 3=gyerek
  condition: number; // 1-10

  /** Ár: aktuális, platform devizában (kijelzéshez) */
  price: MoneyModel;

  /** Opcionális kedvezmény (%) – amikor kosárba kerül, már ismert */
  discountPercent?: DiscountPercent; // 1..100
  discountedPrice?: MoneyModel;

  state?: CartItemState; // TODO

  /** Mikor került a kosárba (rendezés/infó) */
  addedAt: string; // ISO
}

// --- Termékszint a kosárban --------------------------------------------------
export interface CartProductModel {
  product: CatalogProductRefModel;
  items: CartItemModel[]; // snapshot (egy helyen!)
  lastUpdatedAt?: string; // az adott termékhez tartozó tételek
}

/** Egy eladó „csomagja”: az adott eladó összes tétele a kosárban */
export interface CartPackageModel {
  seller: SellerModel;
  products: Record<number, CartProductModel>;
  lastUpdatedAt?: string; // ISO idő (cache/tracking)
}

// --- Összegző (csak aggregált adatok) ---------------------------------------

export interface CartSummaryModel {
  packagesCount: number; // hány eladó/csomag
  itemsCount: number; // tételek darabszáma (Σ quantity)

  /** Részösszeg KEDVEZMÉNY NÉLKÜL = Σ item.price.amount */
  grossSubtotal: MoneyModel;

  /** Kedvezmények összesen = grossSubtotal - indicativeSubtotal (>=0) */
  discountsTotal: MoneyModel;

  /** Tájékoztató végösszeg = Σ discounted (line item szint) */
  indicativeSubtotal: MoneyModel;

  computedAt: string; // ISO idő (cache/tracking)
}

// --- Teljes kosár ------------------------------------------------------------

/** sellerId -> package. A termék alatti tételek a nézetben (selector) csoportosítva jelennek meg. */
export type CartModel = {
  packages: Record<number, CartPackageModel>;
  summary: CartSummaryModel;
  version?: 2;
};
