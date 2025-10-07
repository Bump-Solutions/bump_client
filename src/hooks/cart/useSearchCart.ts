import { useMemo } from "react";
import { useCart } from "./useCart";
import { CartPackageModel, CartProductModel } from "../../models/cartModel";
import Fuse, { IFuseOptions } from "fuse.js";

import { Range, FieldMatches, HighlightIndex } from "../../utils/highlight";

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

const fuseOptions: IFuseOptions<Doc> = {
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
  if (!cart) return { filteredPackages: [], highlightIndex: {} };

  // 1) Flatten (mindig lefut, nincs korai return → Hooks OK)
  const docs = useMemo<Doc[]>(() => {
    if (!cart?.packages?.length) return [];
    const out: Doc[] = [];
    for (const pkg of cart.packages) {
      const s = pkg.seller;
      for (const prod of pkg.products) {
        const p = prod.product;
        for (const it of prod.items) {
          out.push({
            sellerId: s.id,
            sellerUsername: s.username,
            productId: prod.id,
            productTitle: prod.title,
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

  // 2) Fuse index (cache-elve useMemo-val)
  const fuse = useMemo(() => new Fuse(docs, fuseOptions), [docs]);

  // 3) Keresés + highlight indexek + visszaépítés TÖMBÖKKEL
  const { filteredPackages, highlightIndex } = useMemo(() => {
    const q = query.trim();
    const hits = q
      ? fuse.search(q)
      : docs.map((d) => ({ item: d, matches: [] as any[] }));

    // Engedély mátrix: sellerId -> productId -> itemIds
    const allowMap = new Map<number, Map<number, Set<number>>>();

    // Highlight index
    const perSeller: Record<number, FieldMatches> = {};
    const perProduct: Record<number, FieldMatches> = {};
    const perItem: Record<number, FieldMatches> = {};

    for (const r of hits) {
      const d = r.item;

      // --- engedély mátrix a visszaépítéshez
      let perSellerAllow = allowMap.get(d.sellerId)!;
      if (!perSellerAllow) {
        perSellerAllow = new Map();
        allowMap.set(d.sellerId, perSellerAllow);
      }

      let perProductAllow = perSellerAllow.get(d.productId);
      if (!perProductAllow) {
        perProductAllow = new Set();
        perSellerAllow.set(d.productId, perProductAllow);
      }
      perProductAllow.add(d.itemId);

      // highlight tartományok (Fuse includeMatches → indices)
      // https://www.fusejs.io/api/options.html#includeMatches
      if (r.matches && r.matches.length) {
        for (const m of r.matches) {
          const key = m.key as keyof Doc; // pl. "productTitle"
          const indices = (m.indices || []) as Range[];

          switch (key) {
            case "sellerUsername": {
              const f = (perSeller[d.sellerId] ??= {});
              const arr = (f.sellerUsername ??= []);
              indices.forEach((rg) => arr.push(rg));
              break;
            }

            case "productTitle":
            case "brand":
            case "model":
            case "colorWay": {
              const f = (perProduct[d.productId] ??= {});
              const arr = (f[key] ??= []);
              indices.forEach((rg) => arr.push(rg));
              break;
            }

            case "size": {
              const f = (perItem[d.itemId] ??= {});
              const arr = (f.size ??= []);
              indices.forEach((rg) => arr.push(rg));
              break;
            }

            default:
              break;
          }
        }
      }
    }

    // 4) Visszaépítés a szűrt struktúrára
    let nextPackages: CartPackageModel[] = [];
    if (allowMap.size && cart.packages?.length) {
      nextPackages = cart.packages
        .map<CartPackageModel | null>((pkg) => {
          const perSellerAllow = allowMap.get(pkg.seller.id);
          if (!perSellerAllow) return null;

          const nextProducts: CartProductModel[] = pkg.products
            .map<CartProductModel | null>((prod) => {
              const allowedItemIds = perSellerAllow.get(prod.id);
              if (!allowedItemIds) return null;

              const items = prod.items.filter((it) =>
                allowedItemIds.has(it.id)
              );
              return items.length ? { ...prod, items } : null;
            })
            .filter(Boolean) as CartProductModel[];

          return nextProducts.length
            ? { ...pkg, products: nextProducts }
            : null;
        })
        .filter(Boolean) as CartPackageModel[];
    }

    const highlightIndex: HighlightIndex = { perSeller, perProduct, perItem };

    return {
      filteredPackages: nextPackages.length ? nextPackages : cart.packages,
      highlightIndex,
    };
  }, [fuse, docs, query, cart.packages]);

  return { filteredPackages, highlightIndex };
}
