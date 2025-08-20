import axios from "axios";
import { cookies, headers } from "next/headers";

export async function axiosServer() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const instance = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
      "x-forwarded-for": headerStore.get("x-forwarded-for") || "",
      "user-agent": headerStore.get("user-agent") || "",
    },
  });

  return instance;
}
