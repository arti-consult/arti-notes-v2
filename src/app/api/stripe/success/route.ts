import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function GET(request: NextRequest) {
  try {
    console.log("🎉 Stripe success callback received");

    const supabase = await createClient();
    const url = new URL(request.url);

    // Get Stripe session ID from URL
    const sessionId = url.searchParams.get("session_id");
    console.log("Stripe session ID:", sessionId);

    if (!sessionId) {
      return NextResponse.redirect(
        new URL("/error?message=Missing session ID", request.url)
      );
    }

    // Fetch the Stripe session to get the customer ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ["data.price.product"],
    });

    const product = lineItems?.data?.[0]?.price?.product as Stripe.Product;
    const productLink = product?.metadata?.link;
    const stripeCustomerId = session.customer?.toString();

    if (!stripeCustomerId) {
      console.error("❌ Stripe customer ID not found in session");
    } else {
      console.log("💡 Stripe customer ID:", stripeCustomerId);
    }

    // Get the current Supabase user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ User not authenticated:", userError);
      return NextResponse.redirect(
        new URL(
          "/login?error=Authentication required after payment",
          request.url
        )
      );
    }

    console.log("💳 Processing payment success for user:", user.id);

    // Optionally update profiles table with Stripe customer ID
    if (stripeCustomerId) {
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id); // Adjust if your profiles table uses a different key

      if (profileUpdateError) {
        console.error(
          "❌ Failed to update Stripe customer ID in profiles:",
          profileUpdateError
        );
      } else {
        console.log("✅ Stripe customer ID saved to profiles table");
      }
    }

    // Check current onboarding status
    const { data: currentOnboarding, error: fetchError } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      console.error("❌ Error fetching onboarding:", fetchError);

      // If no onboarding exists, create one
      if (fetchError.code === "PGRST116") {
        const { error: createError } = await supabase
          .from("user_onboarding")
          .insert({
            user_id: user.id,
            payment_completed: true,
            payment_link_tag: productLink,
            stripe_session_id: sessionId,
            user_type: null,
            team_size: null,
            referral_source: null,
            audio_purpose: null,
            mic_permission: false,
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (createError) {
          console.error("❌ Error creating onboarding:", createError);
          return NextResponse.redirect(
            new URL("/error?message=Failed to create user record", request.url)
          );
        }

        console.log("✅ New onboarding record created with payment completed");
      } else {
        return NextResponse.redirect(
          new URL("/error?message=Database error", request.url)
        );
      }
    } else {
      // Update existing onboarding record
      const { error: updateError } = await supabase
        .from("user_onboarding")
        .update({
          payment_completed: true,
          updated_at: new Date().toISOString(),
          ...(sessionId && { stripe_session_id: sessionId }),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("🚨 Error updating payment status:", updateError);
        return NextResponse.redirect(
          new URL("/error?message=Failed to update payment status", request.url)
        );
      }

      console.log("✅ Payment status updated successfully");
    }

    // Re-fetch onboarding to determine redirect
    const { data: updatedOnboarding } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const hasOnboardingAnswers = !!(
      updatedOnboarding?.user_type && updatedOnboarding?.referral_source
    );
    const hasCompletedOnboarding = updatedOnboarding?.completed_at !== null;

    let redirectPath = "/onboarding";

    if (hasOnboardingAnswers && !hasCompletedOnboarding) {
      redirectPath = "/onboarding/connect-account";
    } else if (hasCompletedOnboarding) {
      redirectPath = "/dashboard";
    }

    console.log("🔄 Final redirect path:", redirectPath);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (error) {
    console.error("🚨 Error in Stripe success handler:", error);
    return NextResponse.redirect(
      new URL("/error?message=Payment processing error", request.url)
    );
  }
}
