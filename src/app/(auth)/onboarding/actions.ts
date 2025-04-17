'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: formData.get('fullName') as string,
      username: formData.get('username') as string,
      bio: formData.get('bio') as string,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
} 