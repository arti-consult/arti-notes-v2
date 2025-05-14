"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { hasRole } from "@/utils/rbac/server";
import { revalidatePath } from "next/cache";

// Define validation schema
const AdminUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  username: z.string().min(2, "Username is required"),
});

export type AdminFormData = z.infer<typeof AdminUserSchema>;

export async function createAdminUser(formData: AdminFormData) {
  try {
    // Validate form data
    const validatedData = AdminUserSchema.parse(formData);

    const supabase = await createClient();

    // First check if the current user is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const isAdmin = await hasRole(user.id, "admin");

    if (!isAdmin) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Create the new user
    const { data: newUser, error: createError } =
      await supabase.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: validatedData.fullName,
        },
      });

    if (createError || !newUser?.user) {
      console.error("Error creating user:", createError);
      return {
        success: false,
        error: createError?.message || "Failed to create user",
      };
    }

    // Update the profile with additional info
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: newUser.user.id,
      full_name: validatedData.fullName,
      username: validatedData.username,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return { success: false, error: profileError.message };
    }

    // Get the admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "admin")
      .single();

    if (roleError || !adminRole) {
      console.error("Error fetching admin role:", roleError);
      return { success: false, error: "Failed to find admin role" };
    }

    // Assign admin role to the new user
    const { error: assignRoleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: newUser.user.id,
        role_id: adminRole.id,
      });

    if (assignRoleError) {
      console.error("Error assigning role:", assignRoleError);
      return { success: false, error: "Failed to assign admin role" };
    }

    // Revalidate admin pages to reflect the new user
    revalidatePath("/admin");

    return {
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        fullName: validatedData.fullName,
        username: validatedData.username,
      },
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, error: "Failed to create admin user" };
  }
}
