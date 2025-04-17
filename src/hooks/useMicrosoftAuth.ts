import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { initiateMicrosoftAuth } from '@/services/microsoftService';
import { msalInstance } from '@/lib/msal';

export type ConnectionStatus = 'idle' | 'checking' | 'connecting' | 'connected' | 'error' | 'disconnected';

interface MicrosoftAuthState {
  isConnected: boolean;
  status: ConnectionStatus;
  error: string | null;
  showPopupDialog: boolean;
}

export function useMicrosoftAuth() {
  const { user } = useAuth();
  const location = useLocation();
  const [state, setState] = useState<MicrosoftAuthState>({
    isConnected: false,
    status: 'idle',
    error: null,
    showPopupDialog: false
  });

  // Reset MSAL state when component unmounts
  useEffect(() => {
    return () => {
      msalInstance.initialize().catch(console.error);
    };
  }, []);

  const checkConnection = useCallback(async () => {
    if (!user) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        status: 'disconnected',
        error: null
      }));
      return;
    }

    try {
      console.log('Checking Microsoft connection for user:', user.id);
      setState(prev => ({ ...prev, status: 'checking', error: null }));

      const { data, error: fetchError } = await supabase
        .from('microsoft_connections')
        .select('id, created_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Connection check error:', fetchError);
        throw new Error('Could not verify connection status');
      }

      setState(prev => ({
        ...prev,
        isConnected: !!data,
        status: data ? 'connected' : 'disconnected',
        error: null
      }));
    } catch (err) {
      console.error('Connection check failed:', err);
      setState(prev => ({
        ...prev,
        isConnected: false,
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to check connection status'
      }));
    }
  }, [user]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection, location]);

  const connect = async () => {
    try {
      console.log('Initiating Microsoft connection...');
      setState(prev => ({ 
        ...prev, 
        status: 'connecting', 
        error: null,
        showPopupDialog: false
      }));

      const success = await initiateMicrosoftAuth();
      
      if (success) {
        setState(prev => ({
          ...prev,
          isConnected: true,
          status: 'connected',
          error: null
        }));
      } else {
        throw new Error('Connection failed');
      }
    } catch (err) {
      console.error('Connection failed:', err);
      
      if (err instanceof Error) {
        switch (err.message) {
          case 'popup_blocked':
            setState(prev => ({
              ...prev,
              status: 'error',
              showPopupDialog: true,
              error: 'Popup ble blokkert. Vennligst tillat popups for denne nettsiden.'
            }));
            return;
          case 'auth_in_progress':
            setState(prev => ({
              ...prev,
              status: 'error',
              error: 'En autentisering er allerede i gang. Vennligst vent eller last siden på nytt.'
            }));
            return;
          default:
            setState(prev => ({
              ...prev,
              status: 'error',
              error: err.message
            }));
        }
      } else {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: 'Could not connect to Microsoft'
        }));
      }
    }
  };

  const disconnect = async () => {
    if (!user) {
      console.error('No user found for disconnect');
      return;
    }

    try {
      console.log('Disconnecting Microsoft account...');
      setState(prev => ({ 
        ...prev, 
        status: 'checking', 
        error: null 
      }));

      const { error: deleteError } = await supabase
        .from('microsoft_connections')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Reset MSAL state
      await msalInstance.initialize();

      console.log('Successfully disconnected Microsoft account');
      setState(prev => ({
        ...prev,
        isConnected: false,
        status: 'disconnected',
        error: null
      }));
    } catch (err) {
      console.error('Disconnect failed:', err);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Could not disconnect from Microsoft'
      }));
    }
  };

  const closePopupDialog = () => {
    setState(prev => ({
      ...prev,
      showPopupDialog: false
    }));
  };

  return {
    ...state,
    connect,
    disconnect,
    checkConnection,
    closePopupDialog,
    isLoading: ['checking', 'connecting'].includes(state.status)
  };
}