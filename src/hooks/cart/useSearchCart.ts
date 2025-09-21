import { useMemo } from "react";
import { useCart } from "./useCart";
import { CartPackageModel, CartProductModel } from "../../models/cartModel";
import Fuse, { IFuseOptions } from "fuse.js";

type Doc = {
  sellerId: number;
  sellerUsername: string;
  productId: number;
  productTitle: string;
  brand: string;
  model: string;
  colorWay: string;
  size?: string;
  itemId: number;
};

type Range = [number, number];
type FieldMatches = Record<string, Range[]>; // pl. { productTitle: [[0,2],[10,14]], brand: [[0,1]] }
type HighlightIndex = Record<number, FieldMatches>; // itemId -> FieldMatches

const options: IFuseOptions<Doc> = {
  includeScore: true,
  includeMatches: true, // UI highlight
  threshold: 0.3, // 0.0=szigorú .. 1.0=megengedő; 0.2–0.35 általában jó
  keys: [
    "sellerUsername",
    "productTitle",
    "brand",
    "model",
    "colorWay",
    "size",
  ],
};

export function useCartSearch(query: string) {
  const { cart } = useCart();

  // Ha a kosár üres, nincs mit keresni
  const hasPackages = Object.keys(cart.packages).length > 0;
  if (!hasPackages)
    return {
      filteredPackages: cart.packages,
      highlightIndex: {} as HighlightIndex,
    };

  // 1) Flatten: minden tételhez csatoljuk a keresendő mezőket
  const docs = useMemo<Doc[]>(() => {
    const out: Doc[] = [];
    for (const pkg of Object.values(cart.packages)) {
      const s = pkg.seller;
      for (const [pid, prod] of Object.entries(pkg.products)) {
        const productId = Number(pid);
        const p = prod.product;
        for (const it of prod.items) {
          out.push({
            sellerId: s.id,
            sellerUsername: s.username,
            productId,
            productTitle: p.title,
            brand: p.brand,
            model: p.model,
            colorWay: p.colorWay,
            size: it.size,
            itemId: it.id,
          });
        }
      }
    }
    return out;
  }, [cart.packages]);

  const fuse = useMemo(() => {
    return new Fuse(docs, options);
  }, [docs]);

  // 2) keresés + highlightIndex építés
  const { filteredPackages, highlightIndex } = useMemo(() => {
    const q = query.trim();
    const hits = q
      ? fuse.search(q)
      : docs.map((d) => ({ item: d, matches: [] as any[] }));

    // itemId -> field -> ranges
    const hi: HighlightIndex = {};

    // sellerId -> productId -> itemId set
    const map = new Map<number, Map<number, Set<number>>>();
    for (const r of hits) {
      const d = r.item;
      if (!map.has(d.sellerId)) map.set(d.sellerId, new Map());
      const perSeller = map.get(d.sellerId)!;
      if (!perSeller.has(d.productId)) perSeller.set(d.productId, new Set());
      perSeller.get(d.productId)!.add(d.itemId);

      // highlight gyűjtése
      if (r.matches && r.matches.length) {
        for (const m of r.matches) {
          // m.key pl. "productTitle", m.indices pl. [[0,2],[10,14]]
          if (!hi[d.itemId]) hi[d.itemId] = {};
          const arr = (hi[d.itemId][m.key] ??= []);
          // összeolvasztás opcionális, itt csak betoljuk
          for (const pair of m.indices) arr.push(pair as Range);
        }
      }
    }

    // visszaépítés: seller->product->filtered items
    const next: Record<number, CartPackageModel> = {};
    for (const [sidStr, pkg] of Object.entries(cart.packages)) {
      const sid = Number(sidStr);
      const allowProducts = map.get(sid);
      if (!allowProducts) continue;

      const nextProducts: Record<number, CartProductModel> = {};
      for (const [pidStr, prod] of Object.entries(pkg.products)) {
        const pid = Number(pidStr);
        const allowItems = allowProducts.get(pid);
        if (!allowItems) continue;

        const items = prod.items.filter((it) => allowItems.has(it.id));
        if (items.length) nextProducts[pid] = { ...prod, items };
      }

      if (Object.keys(nextProducts).length)
        next[sid] = { ...pkg, products: nextProducts };
    }

    return {
      filteredPackages: Object.keys(next).length ? next : cart.packages,
      highlightIndex: hi,
    };
  }, [fuse, docs, query, cart.packages]);

  return { filteredPackages, highlightIndex };
}
