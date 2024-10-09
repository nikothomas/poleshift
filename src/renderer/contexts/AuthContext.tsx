// src/renderer/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../utils/supabaseClient';

export interface AuthContextType {
  user: any; // Replace `any` with your user type
  userTier: string | null;
  userLevel: number;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleLogout: () => Promise<void>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const userTierMap: Record<string, number> = {
  admin: 3,
  manager: 2,
  employee: 1,
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let authListenerSubscription: any;

    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
        }
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error in getSession:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    authListenerSubscription = subscription;

    return () => {
      if (authListenerSubscription) {
        authListenerSubscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserTier = async () => {
      if (!user) {
        setUserTier(null);
        setUserLevel(0);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('user_tier')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          console.error('Error fetching user tier:', error);
          setUserTier(null);
          setUserLevel(0);
        } else {
          setUserTier(data.user_tier);
          const level = userTierMap[data.user_tier] || 0;
          setUserLevel(level);
        }
      } catch (err) {
        console.error('Error in fetchUserTier:', err);
        setUserTier(null);
        setUserLevel(0);
      }
    };

    fetchUserTier();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
      setErrorMessage('An error occurred during logout. Please try again.');
    } else {
      setUser(null);
      setUserTier(null);
      setUserLevel(0);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userTier,
        userLevel,
        loading,
        setUser,
        handleLogout,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
