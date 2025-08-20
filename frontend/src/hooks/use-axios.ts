"use client";

import { useEffect, useState } from "react";
import { getAxios } from "@/lib/axios";

export function useAxios() {
  const [axiosInstance, setAxiosInstance] = useState<unknown>(null);

  useEffect(() => {
    setAxiosInstance(getAxios());
  }, []);

  return axiosInstance;
}
