import { useState } from 'react';
import { User, ChevronDown, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Participant } from '@/types/database';

interface ParticipantListProps {
  participants: Participant[];
  className?: string;
}

export default function ParticipantList({ participants, className }: ParticipantListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (participants.length === 0) return null;

  return (
    <div className={cn("bg-white rounded-xl shadow-sm overflow-hidden", className)}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-violet-100 rounded-lg">
            <User className="h-4 w-4 text-violet-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">
            {participants.length} {participants.length === 1 ? 'deltaker' : 'deltakere'}
          </h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((participant, index) => (
              <div 
                key={participant.id}
                className="w-8 h-8 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center"
              >
                <span className="text-xs font-medium text-violet-600">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{participants.length - 3}
                </span>
              </div>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="border-t border-gray-100 pt-2 space-y-2">
                {participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-violet-600">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        {participant.email && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {participant.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}