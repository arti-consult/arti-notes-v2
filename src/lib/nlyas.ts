import Nylas from "nylas";

if (!process.env.NYLAS_API_KEY) {
  throw new Error("NYLAS_API_KEY is required");
}

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri: process.env.NYLAS_CALLBACK_URI,
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI,
};

export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: nylasConfig.apiUri,
});
