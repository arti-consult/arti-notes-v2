import { OpenAI } from "openai";
import { validateEnv } from "./env";

const env = validateEnv();

// Create singleton instance with validated API key
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});
