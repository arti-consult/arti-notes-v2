import { createClient } from "@supabase/supabase-js";
import { validateEnv } from "./env";
import { getSecurityHeaders } from "@/middleware/security";

const env = validateEnv();

// Add security headers to Supabase requests
const headers = getSecurityHeaders();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    global: {
      headers,
    },
  }
);
