import { Calendar } from 'lucide-react';
import { useMicrosoftAuth } from '@/hooks/useMicrosoftAuth';
import { cn } from '@/lib/utils';
import PopupBlockedDialog from './PopupBlockedDialog';

export default function MicrosoftIntegration() {
  const { 
    isConnected, 
    status, 
    error,
    showPopupDialog,
    connect, 
    disconnect,
    closePopupDialog,
    isLoading 
  } = useMicrosoftAuth();

  return (
    <>
      <div className="feature-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Calendar className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-medium">Microsoft 365 Kalender</h3>
              <p className="text-sm text-gray-600">
                Synkroniser møter fra din Microsoft 365 kalender
              </p>
            </div>
          </div>

          {error && !showPopupDialog && (
            <div className="text-sm text-red-600 mr-4">
              {error}
            </div>
          )}

          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isConnected
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                {status === 'connecting' ? 'Kobler til...' : 'Laster...'}
              </div>
            ) : isConnected ? (
              'Koble fra'
            ) : (
              'Koble til'
            )}
          </button>
        </div>
      </div>

      <PopupBlockedDialog 
        isOpen={showPopupDialog}
        onClose={closePopupDialog}
        onRetry={connect}
      />
    </>
  );
}