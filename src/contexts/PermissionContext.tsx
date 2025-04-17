// src/contexts/PermissionContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { RoleWithPermissions, Permission } from "@/types/auth";

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

interface PermissionContextType {
  roles: RoleWithPermissions[];
  permissions: Permission[];
  hasPermission: (permissionName: string) => boolean;
  hasRole: (roleName: string) => boolean;
  isAtLeastTier: (
    minimumTier: "free" | "basic" | "premium" | "admin"
  ) => boolean;
  isLoading: boolean;
}

const defaultContext: PermissionContextType = {
  roles: [],
  permissions: [],
  hasPermission: () => false,
  hasRole: () => false,
  isAtLeastTier: () => false,
  isLoading: true,
};

const PermissionContext = createContext<PermissionContextType>(defaultContext);

export const usePermission = () => useContext(PermissionContext);

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        setIsLoading(true);

        // First check if the user is authenticated
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setRoles([]);
          setPermissions([]);
          return;
        }

        // Fetch user roles with permissions
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select(
            `
            roles!inner (
              id,
              name,
              description,
              created_at,
              updated_at
            )
          `
          )
          .eq("user_id", session.user.id);

        if (rolesError) {
          console.error("Error fetching roles:", rolesError.message);
          return;
        }

        // Extract the roles from the nested structure
        const userRoles = rolesData.map((r) => {
          const role = r.roles as unknown as DatabaseRole;
          return {
            id: role.id,
            name: role.name,
            description: role.description,
            created_at: role.created_at,
            updated_at: role.updated_at,
            permissions: [], // Initialize with empty permissions
          } as RoleWithPermissions;
        });

        // Get permissions for each role
        const allPermissions: Permission[] = [];

        for (const role of userRoles) {
          const { data: permissionsData, error: permissionsError } =
            await supabase
              .from("role_permissions")
              .select(
                `
              permissions!inner (
                id,
                name,
                description,
                created_at
              )
            `
              )
              .eq("role_id", role.id);

          if (!permissionsError && permissionsData) {
            const rolePermissions = permissionsData.map((p) => {
              const permission = p.permissions as unknown as DatabasePermission;
              return {
                id: permission.id,
                name: permission.name,
                description: permission.description,
                created_at: permission.created_at,
              } as Permission;
            });

            role.permissions = rolePermissions;

            // Add to the flat list of permissions
            rolePermissions.forEach((perm) => {
              if (!allPermissions.some((p) => p.id === perm.id)) {
                allPermissions.push(perm);
              }
            });
          }
        }

        setRoles(userRoles);
        setPermissions(allPermissions);
      } catch (error) {
        console.error("Error in permission provider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserRoles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Check if a user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    return permissions.some((p) => p.name === permissionName);
  };

  // Check if a user has a specific role
  const hasRole = (roleName: string): boolean => {
    return roles.some((r) => r.name === roleName);
  };

  // Check if a user is at least a specific tier
  const isAtLeastTier = (
    minimumTier: "free" | "basic" | "premium" | "admin"
  ): boolean => {
    const tierLevels = {
      free: 0,
      basic: 1,
      premium: 2,
      admin: 3,
    };

    const minimumLevel = tierLevels[minimumTier];

    return roles.some((role) => {
      const roleLevel = tierLevels[role.name as keyof typeof tierLevels] || -1;
      return roleLevel >= minimumLevel;
    });
  };

  const value: PermissionContextType = {
    roles,
    permissions,
    hasPermission,
    hasRole,
    isAtLeastTier,
    isLoading,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
