import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import { useLocalStorage } from "./useLocalStorage.js";

// Enfoques propios del usuario (además de los de fábrica).
// Offline-first: cache en localStorage; con sesión se sincroniza con Supabase.
// Cada enfoque: { id, nombre, emoji, base, sugeridos:[keys] }.
export function useEnfoques(session) {
  const [enfoques, setLocal] = useLocalStorage("cm_enfoques", []);

  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("enfoques")
        .select("id,nombre,emoji,base,sugeridos")
        .order("created_at", { ascending: true });
      if (!cancelled && data) setLocal(data);
    })();
    return () => { cancelled = true; };
  }, [session]);

  // Crea uno; devuelve el id (o null si falla la nube).
  const add = async (e) => {
    if (supabase && session) {
      const { data, error } = await supabase
        .from("enfoques")
        .insert({ user_id: session.user.id, nombre: e.nombre, emoji: e.emoji, base: e.base, sugeridos: e.sugeridos })
        .select("id,nombre,emoji,base,sugeridos")
        .single();
      if (!error && data) { setLocal((p) => [...p, data]); return data.id; }
      return null;
    }
    // Sin sesión: solo local.
    const id = "e_" + (enfoques.length + 1) + "_" + e.nombre.toLowerCase().replace(/[^a-z0-9]+/g, "");
    setLocal((p) => [...p, { id, ...e }]);
    return id;
  };

  const remove = async (id) => {
    setLocal((p) => p.filter((x) => x.id !== id));
    if (supabase && session) await supabase.from("enfoques").delete().eq("id", id).eq("user_id", session.user.id);
  };

  return { enfoques, add, remove };
}
