import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { hasRole } from "@/utils/rbac/server";
import CreateAdminForm from "../../components/CreateAdminForm";
import { revalidatePath } from "next/cache";

export default async function CreateAdminPage() {
  const supabase = await createClient();

  // Check if the user is authenticated and is an admin
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  // Check if the user has admin role
  const isAdmin = await hasRole(user.id, "admin");
  if (!isAdmin) {
    redirect("/dashboard");
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fullName: formData.get("fullName") as string,
      username: formData.get("username") as string,
    };

    try {
      // Create the new user
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
          user_metadata: {
            full_name: data.fullName,
          },
        });

      if (createError || !newUser?.user) {
        console.error("Error creating user:", createError);
        return;
      }

      // Update the profile with additional info
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: newUser.user.id,
        full_name: data.fullName,
        username: data.username,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return;
      }

      // Get the admin role ID
      const { data: adminRole, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "admin")
        .single();

      if (roleError || !adminRole) {
        console.error("Error fetching admin role:", roleError);
        return;
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
        return;
      }

      // Revalidate admin pages to reflect the new user
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Create Admin User</h1>
        <p className="text-muted-foreground">
          Create a new user with full administrative privileges
        </p>
      </div>

      <CreateAdminForm onSubmit={handleSubmit} />
    </div>
  );
}
