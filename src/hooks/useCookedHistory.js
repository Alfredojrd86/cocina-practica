import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase.js";
import { useLocalStorage } from "./useLocalStorage.js";
import { recordCook, topCooked } from "../lib/history.js";

// Historial de "lo cocinado", offline-first con sync opcional a Supabase.
// - Sin sesión: solo localStorage (por dispositivo).
// - Con sesión: al entrar carga de la nube (o sube lo local si la nube está vacía);
//   los cambios se escriben con debounce. Si la tabla no existe, degrada sin romper.
export function useCookedHistory(session) {
  const [history, setLocal] = useLocalStorage("cm_cooked", []);
  const timer = useRef(null);

  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.from("cooked").select("data").eq("user_id", session.user.id).maybeSingle();
        const localNow = JSON.parse(localStorage.getItem("cm_cooked") || "[]");
        if (data && Array.isArray(data.data) && data.data.length) {
          if (!cancelled) setLocal(data.data);
        } else if (localNow.length) {
          await supabase.from("cooked").upsert({ user_id: session.user.id, data: localNow });
        }
      } catch {
        // tabla ausente o sin red: seguimos con localStorage
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  const pushDB = (data) => {
    if (!supabase || !session) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      supabase.from("cooked").upsert({ user_id: session.user.id, data }).then(() => {}, () => {});
    }, 600);
  };

  const record = (sug, meal, approach) => {
    const next = recordCook(history, sug, meal, approach, Date.now());
    setLocal(next);
    pushDB(next);
  };

  const topFor = (meal, n) => topCooked(history, meal, n);

  return { history, record, topFor };
}
