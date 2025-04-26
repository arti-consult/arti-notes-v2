import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PermissionsForm } from "./components/permissions-form";

export default async function PermissionsPage() {
  const supabase = await createClient();

  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Permission Management</h1>
        <p className="text-muted-foreground">
          Create and manage permissions in your application
        </p>
      </div>

      <div className="space-y-8">
        <PermissionsForm />
      </div>
    </div>
  );
}
