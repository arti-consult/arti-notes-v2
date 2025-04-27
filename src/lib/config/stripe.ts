export function getStripeSecretKey(): string {
  if (process.env.NODE_ENV === "development") {
    if (!process.env.STRIPE_TEST_SECRET_KEY) {
      throw new Error("Missing STRIPE_TEST_SECRET_KEY environment variable");
    }
    return process.env.STRIPE_TEST_SECRET_KEY;
  } else {
    if (!process.env.STRIPE_PRODUCTION_SECRET_KEY) {
      throw new Error(
        "Missing STRIPE_PRODUCTION_SECRET_KEY environment variable"
      );
    }
    return process.env.STRIPE_PRODUCTION_SECRET_KEY;
  }
}
