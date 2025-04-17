'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Recording } from '@/types/recording';
import RecordingList from './components/RecordingList';

export default function DashboardPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecordings() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('recordings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRecordings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recordings');
      } finally {
        setLoading(false);
      }
    }

    fetchRecordings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recordings</h1>
      <RecordingList recordings={recordings} />
    </div>
  );
} 