'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import MeetingDetailsPage from '@/pages/MeetingDetailsPage';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router, supabase]);

  return <MeetingDetailsPage meetingId={params.id} />;
} 