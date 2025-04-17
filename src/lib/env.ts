import { z } from "zod";

// Detailed schema with specific error messages
const envSchema = z.object({
  SALAD_API_KEY: z.string().min(1, {
    message: "SALAD_API_KEY is required",
  }),
  OPENAI_API_KEY: z.string().min(1, {
    message: "OPENAI_API_KEY is required",
  }),
  SUPABASE_URL: z.string().url({
    message: "SUPABASE_URL must be a valid URL",
  }),
  SUPABASE_ANON_KEY: z.string().min(1, {
    message: "SUPABASE_ANON_KEY is required",
  }),
  MICROSOFT_CLIENT_ID: z.string().min(1, {
    message: "MICROSOFT_CLIENT_ID is required",
  }),
  MICROSOFT_CLIENT_SECRET: z.string().min(1, {
    message: "MICROSOFT_CLIENT_SECRET is required",
  }),
  MICROSOFT_TENANT_ID: z.string().min(1, {
    message: "MICROSOFT_TENANT_ID is required",
  }),
  SALAD_ORGANIZATION_ID: z.string().default("articonsult", {
    message: "SALAD_ORGANIZATION_ID is required",
  }),
  REDIRECT_URI: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function validateEnv(): typeof env {
  try {
    return env;
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw error;
  }
}
