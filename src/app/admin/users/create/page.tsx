import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { hasRole } from "@/utils/rbac/server";
import CreateAdminForm from "../../components/CreateAdminForm";
import { createAdminUser } from "../../actions/create-admin";

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
    await createAdminUser(data);
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
