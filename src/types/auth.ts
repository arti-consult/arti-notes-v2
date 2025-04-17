// src/types/auth.ts
export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  stripe_customer_id: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface UserWithRoles {
  id: string;
  email: string;
  roles: Role[];
}
