import { OpenAIForm } from "./components/openai-form";
import { PermissionsForm } from "./components/permissions-form";

export default async function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and permissions
        </p>
      </div>

      <div className="space-y-8">
        <OpenAIForm />
        <PermissionsForm />
      </div>
    </div>
  );
}
