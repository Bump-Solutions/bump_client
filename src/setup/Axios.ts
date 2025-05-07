import { API } from "../utils/api";
import axios from "axios";

export default axios.create({
  baseURL: API.BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: API.BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
