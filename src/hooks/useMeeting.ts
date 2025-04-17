import { useState, useEffect } from 'react';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  summary?: string;
  transcription?: Array<{
    timestamp: string;
    speaker: string;
    text: string;
  }>;
  moments?: Array<{
    id: string;
    timestamp: string;
    type: 'important' | 'task' | 'decision';
    text: string;
  }>;
  recordingUrl?: string;
}

// Mock data for development
const MOCK_MEETING: Meeting = {
  id: '1',
  title: 'Ukentlig prosjektmøte',
  date: '2024-03-20 10:00',
  duration: '45 min',
  participants: 8,
  summary: 'Gjennomgang av sprint og planlegging av neste iterasjon.',
  transcription: [
    {
      timestamp: '00:00',
      speaker: 'Andreas',
      text: 'La oss gå gjennom ukens fremgang.'
    }
  ]
};

export function useMeeting(meetingId: string) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchMeeting = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMeeting(MOCK_MEETING);
      } catch (err) {
        console.error('Error fetching meeting:', err);
        setError('Kunne ikke hente møtedetaljer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  return { meeting, isLoading, error };
}