import { createClient } from "@supabase/supabase-js";

// La URL y la anon key son públicas (seguras): Row Level Security protege los datos.
// NUNCA poner aquí la service_role key.
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tolera que la variable traiga una ruta extra (ej. /rest/v1): usa solo el origen.
let url = null;
try { url = rawUrl ? new URL(rawUrl).origin : null; } catch { url = rawUrl || null; }

export const supabase = url && anon ? createClient(url, anon) : null;
export const supabaseReady = !!supabase;
