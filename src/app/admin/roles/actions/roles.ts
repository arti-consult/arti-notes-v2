"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRoles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch roles");
  }

  return data;
}

export async function updateRole(
  id: string,
  updates: {
    name: string;
    description: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from("roles").update(updates).eq("id", id);

  if (error) {
    throw new Error("Failed to update role");
  }
}

export async function createRole(role: { name: string; description: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from("roles").insert([role]);

  if (error) {
    throw new Error("Failed to create role");
  }
}

export async function deleteRole(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("roles").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete role");
  }
}
