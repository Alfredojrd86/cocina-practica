import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";
import { useLocalStorage } from "./useLocalStorage.js";

// Favoritos offline-first:
// - Sin sesión: viven en localStorage (por dispositivo).
// - Con sesión Supabase: se sincronizan a la base de datos y se ven en cualquier dispositivo.
//   Al iniciar sesión, los locales se fusionan (upsert) con los de la nube.
export function useFavorites() {
  const [favs, setFavs] = useLocalStorage("cm_favs", []);
  const [session, setSession] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Seguir la sesión de auth.
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Al entrar sesión: subir locales, luego traer todo de la nube.
  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    (async () => {
      setSyncing(true);
      try {
        const current = JSON.parse(localStorage.getItem("cm_favs") || "[]");
        if (current.length) {
          const rows = current.map((f) => ({
            user_id: session.user.id, titulo: f.titulo, pasos: f.pasos, approach: f.approach, meal: f.meal,
          }));
          await supabase.from("favorites").upsert(rows, { onConflict: "user_id,titulo" });
        }
        const { data } = await supabase.from("favorites").select("*").order("created_at", { ascending: false });
        if (!cancelled && data) {
          setFavs(data.map((d) => ({ titulo: d.titulo, pasos: d.pasos, approach: d.approach, meal: d.meal })));
        }
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  const add = useCallback(async (f) => {
    setFavs((prev) => (prev.some((x) => x.titulo === f.titulo) ? prev : [f, ...prev]));
    if (supabase && session) {
      await supabase.from("favorites").upsert(
        { user_id: session.user.id, titulo: f.titulo, pasos: f.pasos, approach: f.approach, meal: f.meal },
        { onConflict: "user_id,titulo" }
      );
    }
  }, [session, setFavs]);

  const remove = useCallback(async (titulo) => {
    setFavs((prev) => prev.filter((x) => x.titulo !== titulo));
    if (supabase && session) {
      await supabase.from("favorites").delete().eq("titulo", titulo).eq("user_id", session.user.id);
    }
  }, [session, setFavs]);

  return { favs, add, remove, session, syncing };
}
