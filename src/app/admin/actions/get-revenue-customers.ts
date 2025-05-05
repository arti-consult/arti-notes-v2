"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRevenueCustomersCount() {
  const supabase = await createClient();

  // Fetch all user_roles with their joined role name
  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id, roles!inner(name)");

  if (error) {
    console.error("Error fetching revenue customers count:", error);
    return 0;
  }

  // Filter out 'free' and 'admin' roles in JS
  const filtered = (data || []).filter(
    (row) => row.roles?.name !== "free" && row.roles?.name !== "admin"
  );

  return filtered.length;
}
