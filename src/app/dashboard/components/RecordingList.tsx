'use client';

import { Recording } from '@/types/recording';
import RecordingCard from './RecordingCard';

interface RecordingListProps {
  recordings: Recording[];
}

export default function RecordingList({ recordings }: RecordingListProps) {
  if (recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No recordings found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recordings.map((recording) => (
        <RecordingCard key={recording.id} recording={recording} />
      ))}
    </div>
  );
} 