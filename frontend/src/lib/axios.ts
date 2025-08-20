import axiosInstance from "./http-client";
import { axiosServer } from "./http-server";

export function getAxios() {
  if (typeof window === "undefined") {
    return axiosServer();
  }
  return axiosInstance;
}
