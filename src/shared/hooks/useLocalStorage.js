import { useEffect, useState } from "react";

/**
 * useState that mirrors its value to localStorage under `key`.
 * Falls back silently to plain in-memory state if storage is unavailable.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage might be unavailable (private browsing, quota, etc.) — ignore.
    }
  }, [key, value]);

  return [value, setValue];
}
