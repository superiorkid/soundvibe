import { useEffect, useState } from "react";

export function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  });

  const setStoredValue = (newValue: string | null) => {
    setValue(newValue);
    if (typeof window !== "undefined") {
      if (newValue === null) localStorage.removeItem(key);
      else localStorage.setItem(key, newValue);
    }
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(e.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [value, setStoredValue] as const;
}
