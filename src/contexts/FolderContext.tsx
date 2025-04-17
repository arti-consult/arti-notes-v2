'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Folder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface FolderContextType {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  updateFolder: (id: string, name: string) => Promise<void>;
}

const FolderContext = createContext<FolderContextType | null>(null);

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchFolders();
    } else {
      setFolders([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchFolders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement your folder fetching logic here
      setFolders([]);
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError('Kunne ikke hente mapper');
    } finally {
      setIsLoading(false);
    }
  };

  const addFolder = async (name: string) => {
    if (!user) throw new Error('Bruker ikke logget inn');
    
    try {
      setError(null);
      // TODO: Implement your folder creation logic here
      setFolders(prev => [...prev]);
    } catch (err) {
      console.error('Error adding folder:', err);
      throw err;
    }
  };

  const removeFolder = async (id: string) => {
    if (!user) throw new Error('Bruker ikke logget inn');
    
    try {
      setError(null);
      // TODO: Implement your folder deletion logic here
      setFolders(prev => prev.filter(folder => folder.id !== id));
    } catch (err) {
      console.error('Error removing folder:', err);
      throw err;
    }
  };

  const updateFolder = async (id: string, name: string) => {
    if (!user) throw new Error('Bruker ikke logget inn');
    
    try {
      setError(null);
      // TODO: Implement your folder update logic here
      setFolders(prev => prev.map(folder => 
        folder.id === id ? { ...folder, name } : folder
      ));
    } catch (err) {
      console.error('Error updating folder:', err);
      throw err;
    }
  };

  return (
    <FolderContext.Provider 
      value={{ 
        folders, 
        isLoading, 
        error, 
        addFolder, 
        removeFolder, 
        updateFolder 
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolders must be used within a FolderProvider');
  }
  return context;
}