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

  // 2) Fuse index
  const fuse = useMemo(() => {
    return new Fuse(docs, fuseOptions);
  }, [docs]);

  // 3) Keresés + highlight index 3 szinten (seller/product/item)
  const { filteredPackages, highlightIndex } = useMemo(() => {
    const q = query.trim();
    const hits = q
      ? fuse.search(q)
      : docs.map((d) => ({ item: d, matches: [] as any[] }));

    // itemId -> field -> ranges
    const hi: HighlightIndex = {};

    // Eredmény-szűréshez: sellerId -> productId -> itemId set
    const allowMap = new Map<number, Map<number, Set<number>>>();

    // Highlight index
    const perSeller: Record<number, FieldMatches> = {};
    const perProduct: Record<number, FieldMatches> = {};
    const perItem: Record<number, FieldMatches> = {};

    for (const r of hits) {
      const d = r.item;

      // --- engedély mátrix a visszaépítéshez
      if (!allowMap.has(d.sellerId)) allowMap.set(d.sellerId, new Map());
      const perSellerAllow = allowMap.get(d.sellerId)!;
      if (!perSellerAllow.has(d.productId))
        perSellerAllow.set(d.productId, new Set());
      perSellerAllow.get(d.productId)!.add(d.itemId);

      // --- highlight tartományok
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
    const next: Record<number, CartPackageModel> = {};

    for (const [sidStr, pkg] of Object.entries(cart.packages)) {
      const sid = Number(sidStr);
      const allowProducts = allowMap.get(sid);
      if (!allowProducts) continue;

      const nextProducts: Record<number, CartProductModel> = {};

      for (const [pidStr, prod] of Object.entries(pkg.products)) {
        const pid = Number(pidStr);
        const allowItems = allowProducts.get(pid);
        if (!allowItems) continue;

        const items = prod.items.filter((it) => allowItems.has(it.id));
        if (items.length) nextProducts[pid] = { ...prod, items };
      }

      if (Object.keys(nextProducts).length) {
        next[sid] = { ...pkg, products: nextProducts };
      }
    }

    const highlightIndex: HighlightIndex = {
      perSeller,
      perProduct,
      perItem,
    };

    return {
      filteredPackages: Object.keys(next).length ? next : cart.packages,
      highlightIndex,
    };
  }, [fuse, docs, query, cart.packages]);

  return { filteredPackages, highlightIndex };
}
