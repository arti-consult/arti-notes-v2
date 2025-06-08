export function getStripeSecretKey(): string {
  console.log("Current NODE_ENV:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    console.log("Checking STRIPE_TEST_SECRET_KEY...");
    if (!process.env.STRIPE_TEST_SECRET_KEY) {
      throw new Error("Missing STRIPE_TEST_SECRET_KEY environment variable");
    }
    return process.env.STRIPE_TEST_SECRET_KEY;
  } else {
    console.log("Checking STRIPE_PRODUCTION_SECRET_KEY...");
    if (!process.env.STRIPE_PRODUCTION_SECRET_KEY) {
      throw new Error(
        "Missing STRIPE_PRODUCTION_SECRET_KEY environment variable"
      );
    }
    return process.env.STRIPE_PRODUCTION_SECRET_KEY;
  }
}

export function getStripeWebhookSecret(): string {
  console.log("Getting webhook secret for NODE_ENV:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    console.log("Checking STRIPE_TEST_WEBHOOK_SECRET...");
    console.log(
      "STRIPE_TEST_WEBHOOK_SECRET exists:",
      !!process.env.STRIPE_TEST_WEBHOOK_SECRET
    );
    if (!process.env.STRIPE_TEST_WEBHOOK_SECRET) {
      throw new Error(
        "Missing STRIPE_TEST_WEBHOOK_SECRET environment variable"
      );
    }
    return process.env.STRIPE_TEST_WEBHOOK_SECRET;
  } else {
    console.log("Checking STRIPE_PRODUCTION_WEBHOOK_SECRET...");
    console.log(
      "STRIPE_PRODUCTION_WEBHOOK_SECRET exists:",
      !!process.env.STRIPE_PRODUCTION_WEBHOOK_SECRET
    );
    if (!process.env.STRIPE_PRODUCTION_WEBHOOK_SECRET) {
      throw new Error(
        "Missing STRIPE_PRODUCTION_WEBHOOK_SECRET environment variable"
      );
    }
    return process.env.STRIPE_PRODUCTION_WEBHOOK_SECRET;
  }
}
