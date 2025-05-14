"use server";

import { createClient } from "@/utils/supabase/server";

interface RolePermission {
  permission_id: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  role_permissions?: RolePermission[];
}

export async function getRoles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("roles")
    .select(
      `
      *,
      role_permissions (
        permission_id
      )
    `
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch roles");
  }

  // Transform the data to include permissions array
  return (data as Role[]).map((role) => ({
    ...role,
    permissions: role.role_permissions?.map((rp) => rp.permission_id) || [],
  }));
}

export async function updateRole(
  id: string,
  updates: {
    name: string;
    description: string;
    permissions?: string[];
  }
) {
  const supabase = await createClient();
  const { permissions, ...roleUpdates } = updates;

  // Start a transaction
  const { error: roleError } = await supabase
    .from("roles")
    .update(roleUpdates)
    .eq("id", id);

  if (roleError) {
    throw new Error("Failed to update role");
  }

  if (permissions) {
    // Delete existing permissions
    const { error: deleteError } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", id);

    if (deleteError) {
      throw new Error("Failed to update role permissions");
    }

    // Insert new permissions
    if (permissions.length > 0) {
      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(
          permissions.map((permissionId) => ({
            role_id: id,
            permission_id: permissionId,
          }))
        );

      if (insertError) {
        throw new Error("Failed to update role permissions");
      }
    }
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

  // Delete role permissions first (due to foreign key constraint)
  const { error: permissionsError } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", id);

  if (permissionsError) {
    throw new Error("Failed to delete role permissions");
  }

  // Then delete the role
  const { error } = await supabase.from("roles").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete role");
  }
}
