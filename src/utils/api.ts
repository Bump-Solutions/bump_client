const VERSION = import.meta.env.VITE_API_VERSION ?? "v1"; // pl. v1, v2
const ORIGIN = import.meta.env.VITE_ORIGIN ?? ""; // "" => same-origin
const WS_ORIGIN = import.meta.env.VITE_WS_ORIGIN ?? ""; // "" => auto from location

// Normalizált összefűzés, hogy ne legyen dupla perjel
const join = (...parts: (string | number | undefined)[]) =>
  parts
    .filter((p) => p !== undefined && p !== null)
    .map((p) => String(p).replace(/^\/+|\/+$/g, ""))
    .join("/");

// /api/{ver}
const API_PREFIX = `/api/${VERSION}`;

// Prefixelt útvonal-építő: u('user','list_users') => /api/v1/user/list_users
const u = (...parts: (string | number | undefined)[]) =>
  `/${join(API_PREFIX, ...parts)}`;

// Query builder: q(u('user','list',id), { page_size: 20, page: 1 })
const q = (url: string, query?: Record<string, unknown>) => {
  if (!query) return url;

  const qs = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });

  const s = qs.toString();
  return s ? `${url}?${s}` : url;
};

// HTTP és WS bázisok
const HTTP_ORIGIN =
  ORIGIN || `${window.location.protocol}//${window.location.host}`;
const WS_BASE_URL = WS_ORIGIN
  ? `${WS_ORIGIN}/ws`
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }/ws`;

export const API = {
  BASE_URL: HTTP_ORIGIN,
  WS_BASE_URL: WS_BASE_URL,
  MEDIA_URL: "",

  AUTH: {
    REFRESH: u("auth/token/refresh"),
    LOGIN: u("auth/token/authenticate"),
    GOOGLE_AUTH: u("social_auth/google_auth"),
    REGISTER: u("auth/registration"),
    LOGOUT: u("auth/token/logout"),
  },

  USER: {
    LIST_USERS: u("user/list_users"),
    GET_USER: (username: string) => u("user/get_user_data", username),

    FOLLOW: u("user/follow"),
    UNFOLLOW: u("user/unfollow"),
    DELETE_FOLLOWER: u("user/remove_follower"),

    LIST_FOLLOWERS: (
      uid: number,
      size: number,
      page: number,
      searchKey: string
    ) =>
      q(u("user/list_followers", uid), {
        page_size: size,
        page,
        username: searchKey,
      }),
    LIST_FOLLOWING: (
      uid: number,
      size: number,
      page: number,
      searchKey: string
    ) =>
      q(u("user/list_followings", uid), {
        page_size: size,
        page,
        username: searchKey,
      }),
  },

  PROFILE: {
    GET_PROFILE: u("user/get_profile_data"),
    GET_PROFILE_META: u("user/get_profile_meta"),
    UPDATE_PROFILE: u("user/update_profile_data"),

    UPLOAD_PROFILE_PICTURE: u("user/upload_profile_picture"),

    SET_PROFILE_BACKGROUND_COLOR: u("user/update_profile_background_color"),
  },

  PRODUCT: {
    // LIST_PRODUCTS: (uid: number, size: number, page: number) => `/api/v1/product/list_products/${uid}?page_size=${size}&page=${page}`,
    LIST_PRODUCTS: (uid: number, size: number, page: number) =>
      q(u("product/list_products", uid), { page_size: size, page }),
    GET_PRODUCT: (pid: number) => u("product/get_product", pid),
    UPLOAD_PRODUCT: u("product/upload_product"),
    DELETE_PRODUCT: (pid: number) => u("product/delete_product", pid),

    LIST_CATEGORIES: u("product/list_categories"),
    LIST_SIZES: (category: number, gender: number) =>
      q(u("product/list_sizes"), { category, gender }),
    LIST_CONDITIONS: u("product/list_conditions"),

    LIST_AVAILABLE_BRANDS: (size: number, page: number, searchKey = "") =>
      q(u("product/list_available_brands"), {
        page_size: size,
        page,
        brand: searchKey,
      }),
    LIST_AVAILABLE_MODELS: (
      brand: string,
      size: number,
      page: number,
      searchKey: string
    ) =>
      q(u("product/list_available_models", brand), {
        page_size: size,
        page,
        model: searchKey,
      }),
    LIST_AVAILABLE_COLORWAYS: (
      brand: string,
      model: string,
      size: number,
      page: number,
      searchKey: string
    ) =>
      q(u("product/list_available_colorways", brand, model), {
        page_size: size,
        page,
        colorway: searchKey,
      }),

    LIKE_PRODUCT: u("product/like_product"),
    UNLIKE_PRODUCT: u("product/dislike_product"),

    LIST_SAVED_PRODUCTS: (size: number, page: number) =>
      q(u("product/list_saved"), { page_size: size, page }),
    SAVE_PRODUCT: u("product/save_product"),
    UNSAVE_PRODUCT: (pid: number) => u("product/remove_save", pid),

    LIST_PRODUCTS_WITHOUT_DISCOUNT: (size: number, page: number) =>
      q(u("product/list_own_not_discounted_products"), {
        page_size: size,
        page,
      }),
    ADD_DISCOUNT: u("product/create_discount"),
  },

  CHAT: {
    LIST_CHAT_GROUPS: (size: number, page: number, searchKey: string) =>
      q(u("chat/list_chat_groups"), {
        page_size: size,
        page,
        username: searchKey,
      }),
    CREATE_CHAT_GROUP: u("chat/create_chat_group"),
    LIST_MESSAGES: (chat: string, size: number, page: number) =>
      q(u("chat/list_messages", chat), { page_size: size, page }),
    MARK_MESSAGE_AS_UNREAD: (chat: string) =>
      u("chat/mark_message_unread", chat),
    UPLOAD_CHAT_IMAGES: (chat: string) => u("chat/upload_chat_images", chat),
  },

  NOTIFICATIONS: {
    LIST_MESSAGE_RELATED_NOTIFICATIONS: (size: number, page: number) =>
      q(u("notifications/list_message_related_notifications"), {
        page_size: size,
        page,
      }),
    LIST_GENERAL_NOTIFICATIONS: (size: number, page: number) =>
      q(u("notifications/list_general_notifications"), {
        page_size: size,
        page,
      }),
    MARK_NOTIFICATION_AS_READ: (id: number) =>
      u("notifications/mark_notification_read", id),
  },

  CART: {
    GET_CART: u("order/cart/list"),
    ADD_ITEMS: u("order/cart/add"),

    REMOVE_ITEM: (itemId: number) => u("order/cart/remove_item", itemId),
    REMOVE_PRODUCT: (productId: number) =>
      u("order/cart/remove_product", productId),
    REMOVE_PACKAGE: (sellerId: number) =>
      u("order/cart/remove_package", sellerId),

    CLEAR: u("order/cart/clear"),
  },

  ORDERS: {
    LIST_ORDERS: (size: number, page: number) =>
      q(u("order/list_orders"), { page_size: size, page }),
    GET_ORDER: (orderId: number) => u("order/get_order", orderId),
    CREATE_ORDER: u("order/create_order"),
    CONFIRM_ORDER: (orderId: number) => u("order/confirm_order", orderId),
    CANCEL_ORDER: (orderId: number) => u("order/cancel_order", orderId),
  },

  REPORT: {
    PRODUCT: u("product/report_product"),
    USER: u("user/report_user"),
  },

  SEARCH: {
    PRODUCTS: (size: number, page: number, searchKey: string) =>
      q(u("search/products/"), { page_size: size, page, q: searchKey }),
    USERS: (size: number, page: number, searchKey: string) =>
      q(u("search/users/"), { page_size: size, page, q: searchKey }),
    LIST_HISTORY: u("search/list_search_history"),
    DELETE_HISTORY: (id: number) => u("search/delete_search_history", id),
  },

  ADDRESS: {
    LIST_ADDRESSES: u("user/list_addresses"),
    ADD_ADDRESS: u("user/add_address"),
    UPDATE_ADDRESS: (id: number) => u("user/update_address", id),
    DELETE_ADDRESS: (id: number) => u("user/delete_address", id),
  },
};
