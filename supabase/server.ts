import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookiePair = {
  name: string;
  value: string;
  options?: unknown;
};

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiePair[]) {
        try {
          cookiesToSet.forEach(({ name, value }) => cookieStore.set(name, value));
        } catch {
          /* set from Server Component */
        }
      },
    },
  });
}
