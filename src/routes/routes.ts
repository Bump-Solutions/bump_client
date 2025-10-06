import { ReportType } from "../types/report";

export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  RELEASES: "/releases",

  PROFILE: (username: string) => ({
    ROOT: `/profile/${username}`,
    PRODUCTS: `/profile/${username}`,
    SAVED: `/profile/${username}/saved`,
    FOLLOWERS: `/profile/${username}/followers`,
    FOLLOWINGS: `/profile/${username}/followings`,
  }),

  PRODUCT: (pid: number) => ({
    ROOT: `/product/${pid}`,
    GALLERY: `/product/${pid}/gallery`,
    DISCOUNT: `/product/${pid}/discount`,
  }),

  REPORT: (type: ReportType, id: string | number) => `/report/${type}/${id}`,

  INBOX: {
    ROOT: "/messages",
    CHAT: (chat: string) => `/messages/${chat}`,
  },

  NOTIFICATIONS: "/notifications",
  SELL: "/sell",

  CART: "/cart",

  ORDERS: "/orders",
  ORDER: (uuid: string) => `/order/${uuid}`,

  DISCOVER: "/discover",
  AUCTION: "/auction",
  NEWS: "/news",

  ABOUT: "/about",
  CONTACT: "/contact",

  SETTINGS: {
    ROOT: "/settings",
    PERSONAL: "/settings/personal",
    PROFILE: "/settings/profile",
    UPLOAD: "/settings/upload",
    ADDRESSES: "/settings/addresses",
    PREFERENCES: "/settings/preferences",
    CHANGEPASSWORD: "/settings/change-password",
    MANAGE: "/settings/manage",
    INBOX: "/settings/inbox",
    NEWSLETTER: "/settings/newsletter",
  },

  MORE: "/more",

  LOGIN: "/auth",
  SIGNUP: "/auth/signup",

  UNAUTHORIZED: "/unauthorized",
  NOTFOUND: "/not-found",
  SERVERERROR: "/server-error",
};
