import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase.js";
import { useLocalStorage } from "./useLocalStorage.js";

// Despensa offline-first con sync opcional a Supabase.
// - Sin sesión: solo localStorage (por dispositivo).
// - Con sesión: al entrar, carga de la nube (o sube la local si la nube está vacía);
//   los cambios se escriben con debounce para no spamear la DB.
export function usePantry(session) {
  const [pantry, setLocal] = useLocalStorage("cm_pantry", {});
  const [syncing, setSyncing] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    (async () => {
      setSyncing(true);
      try {
        const { data } = await supabase.from("pantry").select("data").eq("user_id", session.user.id).maybeSingle();
        const localNow = JSON.parse(localStorage.getItem("cm_pantry") || "{}");
        if (data && data.data && Object.keys(data.data).length) {
          if (!cancelled) setLocal(data.data);
        } else if (Object.keys(localNow).length) {
          await supabase.from("pantry").upsert({ user_id: session.user.id, data: localNow });
        }
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  const pushDB = (data) => {
    if (!supabase || !session) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      supabase.from("pantry").upsert({ user_id: session.user.id, data });
    }, 600);
  };

  const setPantry = (next) => {
    const val = typeof next === "function" ? next(pantry) : next;
    setLocal(val);
    pushDB(val);
  };

  return { pantry, setPantry, pantrySyncing: syncing };
}
