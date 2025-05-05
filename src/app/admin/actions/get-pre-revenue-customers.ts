"use server";

import { createClient } from "@/utils/supabase/server";

export async function getPreRevenueCustomersCount() {
  const supabase = await createClient();

  // Select user_roles with nested roles, filter where roles.name = 'free'
  const { data, error, count } = await supabase
    .from("user_roles")
    .select("user_id, roles!inner(name)", { count: "exact" })
    .eq("roles.name", "free");

  if (error) {
    console.error("Error fetching pre-revenue customers count:", error);
    return 0;
  }

  // Use the count property returned by Supabase
  return count || 0;
}
