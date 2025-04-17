'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/pages/RegisterPage';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Page() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router, supabase]);

  return <RegisterPage />;
} 