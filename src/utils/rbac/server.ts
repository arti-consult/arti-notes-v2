import { createClient } from "@/utils/supabase/server";
import { Role, Permission, RoleWithPermissions } from "@/types/auth";

interface DatabaseRole {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabasePermission {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

/**
 * Get all user roles with their permissions
 */
export async function getUserRoles(
  userId: string
): Promise<RoleWithPermissions[]> {
  const supabase = await createClient();

  const { data: roles, error } = await supabase
    .from("user_roles")
    .select(
      `
      roles (
        id,
        name,
        description,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", userId);

  if (error || !roles?.length) {
    return [];
  }

  // Extract the roles from the nested structure and ensure proper typing
  const userRoles = roles.map((r) => {
    const role = r.roles as unknown as DatabaseRole;
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      created_at: role.created_at,
      updated_at: role.updated_at,
    };
  });

  // Get permissions for each role
  const rolesWithPermissions: RoleWithPermissions[] = [];

  for (const role of userRoles) {
    const { data: permissions } = await supabase
      .from("role_permissions")
      .select(
        `
        permissions (
          id,
          name,
          description,
          created_at
        )
      `
      )
      .eq("role_id", role.id);

    const rolePermissions = (permissions || []).map((p) => {
      const permission = p.permissions as unknown as DatabasePermission;
      return {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        created_at: permission.created_at,
      };
    });

    rolesWithPermissions.push({
      id: role.id,
      name: role.name,
      description: role.description,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: rolePermissions,
    });
  }

  return rolesWithPermissions;
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  userId: string,
  permissionName: string
): Promise<boolean> {
  const supabase = await createClient();

  // Use the database function we created
  const { data, error } = await supabase.rpc("has_permission", {
    permission_name: permissionName,
  });

  if (error) {
    console.error("Error checking permission:", error.message);
    return false;
  }

  return !!data;
}

/**
 * Check if a user has a specific role
 */
export async function hasRole(
  userId: string,
  roleName: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select(
      `
      roles!inner (
        name
      )
    `
    )
    .eq("user_id", userId)
    .eq("roles.name", roleName);

  if (error) {
    console.error("Error checking role:", error.message);
    return false;
  }

  return data.length > 0;
}

/**
 * Check if a user is at least a specific tier
 * Order: free < basic < premium < admin
 */
export async function isAtLeastTier(
  userId: string,
  minimumTier: "free" | "basic" | "premium" | "admin"
): Promise<boolean> {
  const supabase = await createClient();

  const tierLevels = {
    free: 0,
    basic: 1,
    premium: 2,
    admin: 3,
  };

  const minimumLevel = tierLevels[minimumTier];

  const { data, error } = await supabase
    .from("user_roles")
    .select(
      `
      roles!inner (
        name
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error checking tier:", error.message);
    return false;
  }

  // Check if the user has any role that meets or exceeds the minimum tier
  const hasRequiredTier = data.some((item) => {
    const roleName = (item.roles as any).name;
    const roleLevel = tierLevels[roleName as keyof typeof tierLevels] || -1;
    return roleLevel >= minimumLevel;
  });

  return hasRequiredTier;
}

/**
 * Assign a role to a user
 */
export async function assignRole(
  userId: string,
  roleName: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get the role ID
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();

  if (roleError || !role) {
    console.error("Role not found:", roleName);
    return false;
  }

  // Check if the user already has this role
  const { data: existing, error: existingError } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId)
    .eq("role_id", role.id);

  if (existingError) {
    console.error("Error checking existing role:", existingError.message);
    return false;
  }

  // If the user doesn't have the role, assign it
  if (!existing || existing.length === 0) {
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role_id: role.id,
    });

    if (error) {
      console.error("Error assigning role:", error.message);
      return false;
    }
  }

  return true;
}

/**
 * Remove a role from a user
 */
export async function removeRole(
  userId: string,
  roleName: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get the role ID
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();

  if (roleError || !role) {
    console.error("Role not found:", roleName);
    return false;
  }

  // Remove the role
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role_id", role.id);

  if (error) {
    console.error("Error removing role:", error.message);
    return false;
  }

  return true;
}
