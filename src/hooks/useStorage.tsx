"use client";

import { useCallback, useState, useEffect } from "react";

function useStorage(key: string, defaultValue: unknown, storage: Storage) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: unknown) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting storage key "${key}":`, error);
      }
    },
    [key, storedValue, storage]
  );

  const clearValue = useCallback(() => {
    try {
      storage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error(`Error clearing storage key "${key}":`, error);
    }
  }, [key, storage, defaultValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = storage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : defaultValue);
      } catch (error) {
        console.error(`Error syncing storage key "${key}":`, error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, storage, defaultValue]);

  return [storedValue, setValue, clearValue] as const;
}

export function useLocalStorage(key: string, defaultValue: unknown) {
  return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage(key: string, defaultValue: unknown) {
  return useStorage(key, defaultValue, window.sessionStorage);
}
