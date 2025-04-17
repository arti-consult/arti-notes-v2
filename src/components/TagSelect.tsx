import { useState, useEffect } from 'react';
import { Tag as TagIcon, ChevronDown, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTags, getRecordingTags, updateRecordingTags } from '@/services/tagService';
import type { Tag } from '@/types/database';

interface TagSelectProps {
  recordingId: string;
  disabled?: boolean;
  onTagsChange?: () => void;
}

export default function TagSelect({ 
  recordingId,
  disabled = false,
  onTagsChange
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    if (recordingId) {
      fetchTags();
    }
  }, [recordingId]);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all available tags and recording's tags in parallel
      const [allTags, recordingTags] = await Promise.all([
        getTags(),
        getRecordingTags(recordingId)
      ]);

      setAvailableTags(allTags);
      setSelectedTags(recordingTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke hente etiketter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = async (tag: Tag) => {
    try {
      setIsLoading(true);
      setError(null);

      const isSelected = selectedTags.some(t => t.id === tag.id);
      const newSelectedTags = isSelected
        ? selectedTags.filter(t => t.id !== tag.id)
        : [...selectedTags, tag];

      await updateRecordingTags(
        recordingId,
        newSelectedTags.map(t => t.id)
      );

      setSelectedTags(newSelectedTags);
      if (onTagsChange) {
        onTagsChange();
      }
    } catch (err) {
      console.error('Error updating tags:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke oppdatere etiketter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllTags = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await updateRecordingTags(recordingId, []);
      setSelectedTags([]);
      setIsOpen(false);
      if (onTagsChange) {
        onTagsChange();
      }
    } catch (err) {
      console.error('Error removing tags:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke fjerne etiketter');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Etiketter
      </label>
      
      <div className="relative">
        <div ref={setDropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={cn(
            "w-full flex items-start justify-between px-4 py-2 rounded-lg border text-left transition-colors",
            selectedTags.length > 0
              ? "bg-violet-50 border-violet-200" 
              : "bg-white border-gray-300",
            (disabled || isLoading) 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-gray-50"
          )}
        >
          <div className="flex flex-wrap gap-2 min-w-0 pr-6">
            {selectedTags.length === 0 ? (
              <span className="text-gray-500">Ingen etiketter valgt</span>
            ) : (
              selectedTags.map(tag => (
                <span 
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-violet-100 text-violet-700 text-sm"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </span>
              ))
            )}
          </div>
          <ChevronDown className={cn(
            "absolute right-4 top-3 h-4 w-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="p-1">
              {/* Remove all tags option */}
              {selectedTags.length > 0 && (
                <button
                  onClick={handleRemoveAllTags}
                  className="w-full flex items-center px-3 py-2 rounded-md text-left text-sm hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2 text-gray-400" />
                  Fjern alle etiketter
                </button>
              )}

              {/* Available tags */}
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-md text-left text-sm transition-colors",
                    selectedTags.some(t => t.id === tag.id)
                      ? "bg-violet-50 text-violet-900"
                      : "hover:bg-gray-50"
                  )}
                >
                  <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}