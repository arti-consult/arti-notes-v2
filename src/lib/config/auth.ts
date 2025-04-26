const getRedirectUri = () => {
  return `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/microsoft`;
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
