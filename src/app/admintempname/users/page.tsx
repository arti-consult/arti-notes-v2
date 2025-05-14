import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { hasRole } from "@/utils/rbac/server";
import { UsersList } from "./components/UsersList";

export default async function UsersPage() {
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

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage users and their permissions
        </p>
      </div>

      <UsersList />
    </div>
  );
}
