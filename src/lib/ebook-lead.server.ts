import { createClient } from "@supabase/supabase-js";

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    // Publishable keys are opaque strings, not bearer JWTs.
    if (headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export async function insertEbookLead(lead: { name: string; phone: string; email: string }) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Cloud environment is not configured");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { fetch: createSupabaseFetch(SUPABASE_KEY) },
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });

  const { error } = await supabase.from("ebook_leads").insert(lead);
  if (error) {
    console.error("[ebook-lead] insert failed:", error.message);
    throw new Error("Failed to save lead");
  }

  return { ok: true as const };
}
