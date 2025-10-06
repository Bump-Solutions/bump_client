import {
  CartDTO,
  CartItemDTO,
  CartPackageDTO,
  CartProductDTO,
  CartSummaryDTO,
  CatalogProductRefDTO,
} from "../dtos/CartDTO";
import {
  CartItemModel,
  CartModel,
  CartPackageModel,
  CartProductModel,
  CartSummaryModel,
  CatalogProductRefModel,
  DiscountPercent,
  MoneyModel,
  SellerModel,
} from "../models/cartModel";

const HUF = "HUF" as const;
const money = (
  amount: number,
  currency: MoneyModel["currency"] = HUF
): MoneyModel => ({ amount, currency });
const pct = (n: number | undefined): DiscountPercent | undefined =>
  typeof n === "number" ? Math.min(100, Math.max(1, Math.round(n))) : undefined;

const mapItemDTO = (dto: CartItemDTO): CartItemModel => ({
  id: dto.id,

  size: dto.size,
  gender: dto.gender,
  condition: dto.condition,

  price: money(dto.price),

  hasDiscount: dto.has_discount ?? false,
  discountPercent: pct(dto.discount_percentage),
  discountedPrice:
    typeof dto.discounted_price === "number"
      ? money(dto.discounted_price)
      : undefined,
});

const mapCatalogProductRefDTO = (
  dto: CatalogProductRefDTO
): CatalogProductRefModel => ({
  brand: dto.brand,
  model: dto.model,
  colorWay: dto.color_way,
  category: dto.category,
  colors: dto.colors,
});

const mapProductDTO = (dto: CartProductDTO): CartProductModel => ({
  id: dto.id,
  title: dto.title,
  image: dto.image,
  product: mapCatalogProductRefDTO(dto.product),
  items: dto.items.map(mapItemDTO),
});

const mapSellerDTO = (dto: CartPackageDTO): SellerModel => ({
  id: dto.id,
  username: dto.username,
  profilePicture: dto.profile_picture,
});

const mapPackageDTO = (dto: CartPackageDTO): CartPackageModel => ({
  seller: mapSellerDTO(dto),
  products: dto.inventories.map(mapProductDTO),
});

const mapSummaryDTO = (dto: CartSummaryDTO): CartSummaryModel => ({
  packagesCount: dto.packages_count,
  itemsCount: dto.items_count,

  grossSubtotal: money(dto.gross_total),
  discountsTotal: money(dto.total_discount_value),
  indicativeSubtotal: money(dto.discounted_total),
});

export const fromCartDTO = (dto: CartDTO): CartModel => ({
  packages: dto.packages.map(mapPackageDTO),

  summary: mapSummaryDTO(dto.summary),
});
