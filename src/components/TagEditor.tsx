import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTags, createTag, updateTag, deleteTag } from '@/services/tagService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import type { Tag } from '@/types/database';

interface TagEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function TagEditor({
  isOpen,
  onClose,
  onSave
}: TagEditorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const fetchedTags = await getTags();
      setTags(fetchedTags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke hente etiketter');
    }
  };

  if (!isOpen) return null;

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const createdTag = await createTag(newTag.trim());
      setTags(prev => [...prev, createdTag]);
      setNewTag('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke legge til etikett');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async () => {
    if (!tagToDelete) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await deleteTag(tagToDelete.id);
      setTags(prev => prev.filter(tag => tag.id !== tagToDelete.id));
      setTagToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke slette etikett');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingIndex(tag.id);
    setEditingValue(tag.name);
    setError(null);
  };

  const handleEditTag = async () => {
    if (!editingIndex) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const updatedTag = await updateTag(editingIndex, editingValue);
      setTags(prev => prev.map(tag => 
        tag.id === editingIndex ? updatedTag : tag
      ));
      setEditingIndex(null);
      setEditingValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke oppdatere etikett');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Rediger etiketter</h3>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Existing tags */}
            <div className="space-y-2">
              {tags.map((tag) => (
                <div 
                  key={tag.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-gray-50"
                >
                  {editingIndex === tag.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => {
                        setEditingValue(e.target.value);
                        setError(null);
                      }}
                      className="flex-1 px-3 py-1 rounded-md border border-violet-300 focus:border-violet-500 focus:ring-violet-500 mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleEditTag();
                        } else if (e.key === 'Escape') {
                          setEditingIndex(null);
                          setEditingValue('');
                          setError(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-700">{tag.name}</span>
                  )}
                  <div className="flex items-center space-x-1">
                    {editingIndex === tag.id ? (
                      <button
                        onClick={handleEditTag}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(tag)}
                        className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setTagToDelete(tag)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new tag */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setError(null);
                }}
                placeholder="Skriv inn ny etikett..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleAddTag}
                className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg"
                disabled={isLoading || !newTag.trim()}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-colors",
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              )}
            >
              Lukk
            </button>
          </div>
        </div>
      </div>
      
      <DeleteConfirmationDialog
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        onConfirm={handleRemoveTag}
        title="Slett etikett"
        message={`Er du sikker på at du vil slette etiketten "${tagToDelete?.name}"? Denne handlingen kan ikke angres.`}
      />
    </div>
  );
}