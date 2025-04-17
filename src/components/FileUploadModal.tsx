import { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadRecording } from '@/services/recordingService';
import { validateAudioFile } from '@/lib/fileValidation';
import { cn } from '@/lib/utils';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function FileUploadModal({ 
  isOpen, 
  onClose,
  onUploadComplete
}: FileUploadModalProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    setError(null);
    // Sett standard tittel basert på filnavn, fjern extension
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !title.trim()) {
      setError('Vennligst fyll ut alle felt');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const recording = await uploadRecording(selectedFile, user.id, title);
      console.log('Upload completed successfully', recording);
      onUploadComplete();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke laste opp filen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Last opp lydopptak</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isUploading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Fil velger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velg lydfil
              </label>
              <label 
                className={cn(
                  "block w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                  selectedFile ? "border-violet-500 bg-violet-50" : "border-gray-300 hover:border-gray-400"
                )}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <Upload className={cn(
                  "h-8 w-8 mx-auto mb-2",
                  selectedFile ? "text-violet-500" : "text-gray-400"
                )} />
                {selectedFile ? (
                  <span className="text-sm text-violet-600">
                    {selectedFile.name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">
                    Klikk for å velge fil eller dra og slipp
                  </span>
                )}
              </label>
            </div>

            {/* Tittel */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tittel
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                placeholder="Gi opptaket en tittel"
                disabled={isUploading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Avbryt
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || isUploading}
              className={cn(
                "px-4 py-2 rounded-lg text-white transition-colors",
                isUploading || !selectedFile || !title.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              )}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Laster opp...
                </div>
              ) : (
                'Last opp'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}