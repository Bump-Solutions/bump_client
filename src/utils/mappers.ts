import {
  OrderAction,
  OrderPillVariant,
  OrderState,
  OrderUserRole,
} from "../models/orderModel";

export const GENDER_LABELS: Record<number, string> = {
  1: "Férfi",
  2: "Női",
  3: "Uniszex",
  4: "Gyerek",
};

export const CONDITION_LABELS: Record<number, string> = {
  0: "DSWT",
  1: "NIB",
  2: "DS",
  3: "VNDS",
  4: "NDS",
  5: "Beater",
  6: "Egyéb",
};

export const CURRENCY_LABELS: Record<string, string> = {
  HUF: "Ft",
  EUR: "€",
  USD: "$",
  // ...
};

// --- Action → label (HU) ---
export const ORDER_ACTION_LABELS: Record<OrderAction, string> = {
  [OrderAction.CONFIRM_ORDER]: "Rendelés elfogadása",
  [OrderAction.INITIATE_CHECKOUT]: "Checkout indítása",
  [OrderAction.GET_ORDER_PAYMENT_STATUS]: "Fizetési állapot lekérése",
  [OrderAction.GET_SHIPMENT_DETAILS]: "Szállítási adatok",
  [OrderAction.RATE_SELLER]: "Eladó értékelése",
  [OrderAction.CANCEL_ORDER]: "Rendelés törlése",
};

// --- State → label (HU) ---
export const ORDER_STATE_LABELS: Record<OrderState, string> = {
  [OrderState.SELLER_CONFIRMATION]: "Elfogadásra vár",
  [OrderState.WAITING_FOR_INITIATE_CHECKOUT]: "Vevőre vár (fizetés)",
  [OrderState.WAITING_FOR_EXTERNAL_TASKS]: "Feldolgozás alatt",
  [OrderState.CHECKOUT_SUCCESSFUL_NOT_PAID]: "Sikeres checkout – fizetésre vár",
  [OrderState.PAID_WAITING_FOR_SHIPMENT]: "Fizetve – feladásra vár",
  [OrderState.SHIPPED_WAITING_FOR_ARRIVAL]: "Úton",
  [OrderState.ARRIVED_WAITING_FOR_PICKUP]: "Átvehető",
  [OrderState.RECEIVED_WAITING_FOR_RESPONSE]: "Visszaigazolásra vár",
  [OrderState.COMPLETED]: "Teljesítve",
  [OrderState.CANCELLED]: "Törölve",
  [OrderState.EXPIRED]: "Lejárt",
  [OrderState.FAILED]: "Sikertelen",
};

// --- State → UI-variáns (pill/színezés) ---
/**
 * Role-függő state-variánsok.
 * Seller/buyer szerint néhány állapot "te jössz" vs. "másik fél jön" eltérően jelzett.
 */
export const ORDER_STATE_VARIANTS = (
  role: OrderUserRole
): Record<OrderState, OrderPillVariant> => {
  const isSeller = role === OrderUserRole.SELLER;

  return {
    [OrderState.SELLER_CONFIRMATION]: isSeller ? "warning" : "info",
    [OrderState.WAITING_FOR_INITIATE_CHECKOUT]: isSeller ? "info" : "warning",
    [OrderState.WAITING_FOR_EXTERNAL_TASKS]: "info",
    [OrderState.CHECKOUT_SUCCESSFUL_NOT_PAID]: isSeller ? "info" : "warning",
    [OrderState.PAID_WAITING_FOR_SHIPMENT]: "success",
    [OrderState.SHIPPED_WAITING_FOR_ARRIVAL]: "info",
    [OrderState.ARRIVED_WAITING_FOR_PICKUP]: isSeller ? "info" : "warning",
    [OrderState.RECEIVED_WAITING_FOR_RESPONSE]: "info",
    [OrderState.COMPLETED]: "success",
    [OrderState.CANCELLED]: "critical",
    [OrderState.EXPIRED]: "neutral",
    [OrderState.FAILED]: "critical",
  };
};
