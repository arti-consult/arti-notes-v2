'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isAdmin } from '@/lib/adminAuth';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [adminState, setAdminState] = useState<AdminContextType>({
    isAdmin: false,
    isLoading: true
  });

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setAdminState({ isAdmin: false, isLoading: false });
        return;
      }

      try {
        const adminStatus = await isAdmin(user.id);

        setAdminState({
          isAdmin: adminStatus,
          isLoading: false
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminState({
          isAdmin: false,
          isLoading: false
        });
      }
    }

    checkAdminStatus();
  }, [user]);

  return (
    <AdminContext.Provider value={adminState}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}