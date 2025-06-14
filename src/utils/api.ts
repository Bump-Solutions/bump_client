export const API = {
  // BASE_URL: "http://localhost:8100",
  // WS_BASE_URL: "ws://localhost:8100/ws",
  // BASE_URL: "http://185.221.21.17:8100",
  // WS_BASE_URL: "ws://185.221.21.17:8100/ws",
  BASE_URL: "https://bumpmarket.hu",
  WS_BASE_URL: "wss://bumpmarket.hu/ws",
  // MEDIA_URL: "https://bumpmarket.hu",
  MEDIA_URL: "",

  AUTH: {
    REFRESH: "/api/v1/auth/token/refresh",
    LOGIN: "/api/v1/auth/token/authenticate",
    GOOGLE_AUTH: "/api/v1/social_auth/google_auth",
    REGISTER: "/api/v1/auth/registration",
    LOGOUT: "/api/v1/auth/token/logout",
  },

  USER: {
    LIST_USERS: "/api/v1/user/list_users",
    GET_USER: (username: string) => `/api/v1/user/get_user_data/${username}`,

    FOLLOW: `/api/v1/user/follow`,
    UNFOLLOW: `/api/v1/user/unfollow`,
    DELETE_FOLLOWER: `/api/v1/user/remove_follower`,

    LIST_FOLLOWERS: (
      uid: number,
      size: number,
      page: number,
      searchKey?: string
    ) =>
      `/api/v1/user/list_followers/${uid}?page_size=${size}&page=${page}&username=${searchKey}`,
    LIST_FOLLOWING: (
      uid: number,
      size: number,
      page: number,
      searchKey?: string
    ) =>
      `/api/v1/user/list_followings/${uid}?page_size=${size}&page=${page}&username=${searchKey}`,
  },

  PROFILE: {
    GET_PROFILE: "/api/v1/user/get_profile_data",
    UPDATE_PROFILE: "/api/v1/user/update_profile_data",

    GET_PROFILE_PICTURE: "/api/v1/user/get_profile_picture",
    UPLOAD_PROFILE_PICTURE: "/api/v1/user/upload_profile_picture",

    SET_PROFILE_BACKGROUND_COLOR:
      "/api/v1/user/update_profile_background_color",
  },

  PRODUCT: {
    LIST_PRODUCTS: (uid: number, size: number, page: number) =>
      `/api/v1/product/list_products/${uid}?page_size=${size}&page=${page}`,
    GET_PRODUCT: (pid: number) => `/api/v1/product/get_product/${pid}`,
    UPLOAD_PRODUCT: "/api/v1/product/upload_product",
    DELETE_PRODUCT: (pid: number) => `/api/v1/product/delete_product/${pid}`,

    LIST_CATEGORIES: "/api/v1/product/list_categories",
    LIST_SIZES: (category: number, gender: number) =>
      `/api/v1/product/list_sizes?category=${category}&gender=${gender}`,
    LIST_CONDITIONS: "/api/v1/product/list_conditions",

    // TODO: searchKez
    LIST_AVAILABLE_BRANDS: (size: number, page: number, searchKey?: string) =>
      `/api/v1/product/list_available_brands?page_size=${size}&page=${page}&brand=${searchKey}`,
    LIST_AVAILABLE_MODELS: (
      brand: string,
      size: number,
      page: number,
      searchKey?: string
    ) =>
      `/api/v1/product/list_available_models/${brand}?page_size=${size}&page=${page}&model=${searchKey}`,
    LIST_AVAILABLE_COLORWAYS: (
      brand: string,
      model: string,
      size: number,
      page: number,
      searchKey?: string
    ) =>
      `/api/v1/product/list_available_colorways/${brand}/${model}?page_size=${size}&page=${page}&colorway=${searchKey}`,

    LIKE_PRODUCT: "/api/v1/product/like_product",
    UNLIKE_PRODUCT: "/api/v1/product/dislike_product",

    LIST_SAVED_PRODUCTS: (size: number, page: number) =>
      `/api/v1/product/list_saved?page_size=${size}&page=${page}`,
    SAVE_PRODUCT: "/api/v1/product/save_product",
    UNSAVE_PRODUCT: (pid: number) => `/api/v1/product/remove_save/${pid}`,

    LIST_PRODUCTS_WITHOUT_DISCOUNT: (size: number, page: number) =>
      `/api/v1/product/list_own_not_discounted_products?page_size=${size}&page=${page}`,
    ADD_DISCOUNT: "/api/v1/product/create_discount",
  },

  CHAT: {
    LIST_CHAT_GROUPS: (size: number, page: number, searchKey: string) =>
      `/api/v1/chat/list_chat_groups?page_size=${size}&page=${page}&username=${searchKey}`,
    CREATE_CHAT_GROUP: "/api/v1/chat/create_chat_group",
    LIST_MESSAGES: (chat: string, size: number, page: number) =>
      `/api/v1/chat/list_messages/${chat}?page_size=${size}&page=${page}`,
    MARK_MESSAGE_AS_UNREAD: (chat: string) =>
      `/api/v1/chat/mark_message_unread/${chat}`,
    UPLOAD_CHAT_IMAGES: (chat: string) =>
      `/api/v1/chat/upload_chat_images/${chat}`,
  },

  NOTIFICATIONS: {
    LIST_NOTIFICATIONS: (size: number, page: number) =>
      `/api/v1/notifications/list_notifications?page_size=${size}&page=${page}`,
  },
  REPORT: {
    PRODUCT: "/api/v1/product/report_product",
    USER: "/api/v1/user/report_user",
  },

  SEARCH: {
    PRODUCTS: (size: number, page: number, searchKey: string) =>
      `/api/v1/search/products/?page_size=${size}&page=${page}&q=${searchKey}`,
    USERS: (size: number, page: number, searchKey: string) =>
      `/api/v1/search/users/?page_size=${size}&page=${page}&q=${searchKey}`,
    LIST_HISTORY: "/api/v1/search/list_search_history",
    DELETE_HISTORY: (id: number) =>
      `/api/v1/search/delete_search_history/${id}`,
  },

  ADDRESS: {
    LIST_ADDRESSES: "/api/v1/user/list_addresses",
    ADD_ADDRESS: "/api/v1/user/add_address",
    UPDATE_ADDRESS: (id: number) => `/api/v1/user/update_address/${id}`,
    DELETE_ADDRESS: (id: number) => `/api/v1/user/delete_address/${id}`,
  },
};
