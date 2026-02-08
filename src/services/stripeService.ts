import { AxiosInstance } from "axios";
import { API } from "../utils/api";

export const stripeConnect = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
) => {
  const response = await axiosPrivate.get<{
    url: string; // URL to redirect the user to for Stripe Connect onboarding
  }>(API.STRIPE.CONNECT, {
    signal,
  });

  return response.data.url;
};
