import { useState } from "react";
import { getToken, setToken } from "../utils/token";

export const useLocalStorageToken = (defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    getToken(defaultValue);
  });
  const setValue = (value) => {
    setToken(value);
    setStoredValue(value);
  };
  return [storedValue, setValue];
};
