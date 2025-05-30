import { Sidebar } from "./components/sidebar";
import { WelcomeAlert } from "./components/welcome-alert";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <WelcomeAlert />
        {children}
      </main>
    </div>
  );
}
