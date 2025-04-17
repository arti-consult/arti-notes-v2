import { validateEnv } from "@/lib/env";

const env = validateEnv();

const getRedirectUri = () => {
  return "https://bolt.new/auth/callback/microsoft";
};

export const config = {
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    tenantId: process.env.MICROSOFT_TENANT_ID,
    get redirectUri() {
      return getRedirectUri();
    },
  },
};
