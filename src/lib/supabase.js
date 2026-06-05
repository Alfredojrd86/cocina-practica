import { createClient } from "@supabase/supabase-js";

// La URL y la anon key son públicas (seguras): Row Level Security protege los datos.
// NUNCA poner aquí la service_role key.
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anon ? createClient(url, anon) : null;
export const supabaseReady = !!supabase;
