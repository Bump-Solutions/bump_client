// --- Enums: tükör a backendhez (IntEnum-ekhez illesztve) ---

export enum OrderUserRole {
  SELLER = "seller",
  BUYER = "buyer",
}

export enum OrderAction {
  CONFIRM_ORDER = 0,
  INITIATE_CHECKOUT = 1,
  GET_ORDER_PAYMENT_STATUS = 2,
  GET_SHIPMENT_DETAILS = 3,
  SUBMIT_SELLER_RATING = 4,
  SUBMIT_BUYER_RATING = 5,
  CANCEL_ORDER = 10,
}

export enum OrderState {
  SELLER_CONFIRMATION = 0,
  WAITING_FOR_INITIATE_CHECKOUT = 1,
  WAITING_FOR_EXTERNAL_TASKS = 2,
  CHECKOUT_SUCCESSFUL_NOT_PAID = 3,
  PAID_WAITING_FOR_SHIPMENT = 4,
  SHIPPED_WAITING_FOR_ARRIVAL = 5,
  ARRIVED_WAITING_FOR_PICKUP = 6,
  RECEIVED_WAITING_FOR_RESPONSE = 7,
  COMPLETED = 8,
  CANCELLED = 9,
  EXPIRED = 10,
  FAILED = 11,
}

// --- Közös, kis típusok ---
export type OrderId = number;
export type OrderUUID = string;

export type OrderParty = {
  id: number;
  username: string;
  profilePicture: string | null;
};

export type OrderPillVariant =
  | "success"
  | "warning"
  | "critical"
  | "info"
  | "neutral";

// --- A szerver által visszaadott modellek (kliens oldali) ---

export interface OrderListModel {
  id: OrderId;
  uuid: OrderUUID;

  state: OrderState; // numeric enum
  validActions: OrderAction[]; // numeric enum lista a szervertől

  // A session user szemszögéből:
  isSeller: boolean;
  party: OrderParty;

  createdAt: string; // ISO
  expiresAt: string; // ISO
}

export interface OrderModel extends OrderListModel {}

// Oldalazás

export interface OrdersPageModel {
  orders: OrderListModel[];
  next: number | null;
  previous: string | null;
  count: number;
  totalPages: number;
}

// --- Order létrehozás modellek ---

export type CreateOrderFromProduct = {
  source: "product";
  sellerId: number;
  itemIds: number[];
};

export type CreateOrderFromCart = {
  source: "cart";
  sellerId: number;
  itemIds?: never;
};

export type CreateOrderModel = CreateOrderFromProduct | CreateOrderFromCart;

// Erősen típusos action mapping a kliensen (UI/guardokhoz) ---
// Tuple-ként deklaráljuk, hogy a TypeScript literál szinten megőrizze az értékeket.

const SELLER_ACTIONS: Readonly<Record<OrderState, readonly OrderAction[]>> = {
  [OrderState.SELLER_CONFIRMATION]: [
    OrderAction.CONFIRM_ORDER,
    OrderAction.CANCEL_ORDER,
  ],
  [OrderState.WAITING_FOR_INITIATE_CHECKOUT]: [],
  [OrderState.WAITING_FOR_EXTERNAL_TASKS]: [],
  [OrderState.CHECKOUT_SUCCESSFUL_NOT_PAID]: [],
  [OrderState.PAID_WAITING_FOR_SHIPMENT]: [OrderAction.GET_SHIPMENT_DETAILS],
  [OrderState.SHIPPED_WAITING_FOR_ARRIVAL]: [],
  [OrderState.ARRIVED_WAITING_FOR_PICKUP]: [],
  [OrderState.RECEIVED_WAITING_FOR_RESPONSE]: [],
  [OrderState.COMPLETED]: [OrderAction.SUBMIT_BUYER_RATING],
  [OrderState.CANCELLED]: [],
  [OrderState.EXPIRED]: [],
  [OrderState.FAILED]: [],
} as const;

const BUYER_ACTIONS: Readonly<Record<OrderState, readonly OrderAction[]>> = {
  [OrderState.SELLER_CONFIRMATION]: [OrderAction.CANCEL_ORDER],
  [OrderState.WAITING_FOR_INITIATE_CHECKOUT]: [
    OrderAction.CANCEL_ORDER,
    OrderAction.INITIATE_CHECKOUT,
  ],
  [OrderState.WAITING_FOR_EXTERNAL_TASKS]: [
    OrderAction.GET_ORDER_PAYMENT_STATUS,
  ],
  [OrderState.CHECKOUT_SUCCESSFUL_NOT_PAID]: [
    OrderAction.GET_ORDER_PAYMENT_STATUS,
  ],
  [OrderState.PAID_WAITING_FOR_SHIPMENT]: [],
  [OrderState.SHIPPED_WAITING_FOR_ARRIVAL]: [],
  [OrderState.ARRIVED_WAITING_FOR_PICKUP]: [],
  [OrderState.RECEIVED_WAITING_FOR_RESPONSE]: [
    OrderAction.SUBMIT_SELLER_RATING,
  ],
  [OrderState.COMPLETED]: [],
  [OrderState.CANCELLED]: [],
  [OrderState.EXPIRED]: [],
  [OrderState.FAILED]: [],
} as const;

export const ACTION_MAPPING: Readonly<
  Record<OrderUserRole, Readonly<Record<OrderState, readonly OrderAction[]>>>
> = {
  [OrderUserRole.SELLER]: SELLER_ACTIONS,
  [OrderUserRole.BUYER]: BUYER_ACTIONS,
} as const;

// Helper: kliens oldali ellenőrzés (UI-hoz)
export const canPerform = (
  action: OrderAction,
  state: OrderState,
  role: OrderUserRole
): boolean => {
  return ACTION_MAPPING[role][state].includes(action);
};
