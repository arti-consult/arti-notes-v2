"use server";

import { createClient } from "@/utils/supabase/server";

export async function getPermissions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch permissions");
  }

  return data;
}

export async function updatePermission(
  id: string,
  updates: {
    name: string;
    description: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("permissions")
    .update(updates)
    .eq("id", id);

  if (error) {
    throw new Error("Failed to update permission");
  }
}

export async function createPermission(permission: {
  name: string;
  description: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("permissions").insert([permission]);

  if (error) {
    throw new Error("Failed to create permission");
  }
}

export async function deletePermission(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("permissions").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete permission");
  }
}
