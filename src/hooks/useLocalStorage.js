import { useState, useEffect } from "react";

// Estado que persiste en localStorage. Sobrevive recargas y cierre del navegador.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // almacenamiento lleno o no disponible: se ignora
    }
  }, [key, value]);

  return [value, setValue];
}
