import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SidebarWrapper } from "./components/sidebar-wrapper"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <SidebarWrapper />
      <main className="flex-1">{children}</main>
    </div>
  )
} 