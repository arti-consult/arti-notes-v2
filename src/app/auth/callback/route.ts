import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/payment";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // Check if user has completed payment
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: onboarding } = await supabase
          .from("user_onboarding")
          .select("payment_completed, completed_at")
          .eq("user_id", user.id)
          .single();

        if (onboarding?.payment_completed && onboarding?.completed_at) {
          // Both payment and onboarding completed, go to dashboard
          const redirectUrl = "/dashboard";
          if (isLocalEnv) {
            return NextResponse.redirect(`${origin}${redirectUrl}`);
          } else if (forwardedHost) {
            return NextResponse.redirect(
              `https://${forwardedHost}${redirectUrl}`
            );
          } else {
            return NextResponse.redirect(`${origin}${redirectUrl}`);
          }
        } else if (onboarding?.payment_completed) {
          // Payment completed but not onboarding
          const redirectUrl = "/onboarding";
          if (isLocalEnv) {
            return NextResponse.redirect(`${origin}${redirectUrl}`);
          } else if (forwardedHost) {
            return NextResponse.redirect(
              `https://${forwardedHost}${redirectUrl}`
            );
          } else {
            return NextResponse.redirect(`${origin}${redirectUrl}`);
          }
        }
      }

      // Default to payment page
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
