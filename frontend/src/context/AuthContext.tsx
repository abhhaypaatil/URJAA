import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, UserPreferences } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  hasSettings: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [hasSettings, setHasSettings] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUserData = async () => {
    const token = localStorage.getItem('urjaa_access_token');
    if (!token || token === 'demo-local-access-token') {
      localStorage.removeItem('urjaa_access_token');
      localStorage.removeItem('urjaa_refresh_token');
      setUser(null);
      setProfile(null);
      setPreferences(null);
      setHasSettings(false);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setProfile(data.profile);
      setPreferences(data.preferences || null);
      setHasSettings(data.has_settings ?? false);
    } catch (err) {
      console.warn('Authentication expired or invalid token:', err);
      localStorage.removeItem('urjaa_access_token');
      localStorage.removeItem('urjaa_refresh_token');
      setUser(null);
      setProfile(null);
      setPreferences(null);
      setHasSettings(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();

    const handleLogout = () => {
      setUser(null);
      setProfile(null);
      setPreferences(null);
      setHasSettings(false);
    };

    window.addEventListener('urjaa_logout', handleLogout);
    return () => window.removeEventListener('urjaa_logout', handleLogout);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.login({ email, password });
      if (data.access_token) {
        localStorage.setItem('urjaa_access_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('urjaa_refresh_token', data.refresh_token);
      }
      setUser(data.user || null);
      setProfile(data.profile || null);
      setPreferences(data.preferences || null);
      setHasSettings(data.has_settings ?? false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const data = await api.register({ email, password, name });
      if (data.access_token) {
        localStorage.setItem('urjaa_access_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('urjaa_refresh_token', data.refresh_token);
      }
      setUser(data.user || null);
      setProfile(data.profile || null);
      setPreferences(data.preferences || null);
      setHasSettings(data.has_settings ?? false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout().catch(() => {});
    localStorage.removeItem('urjaa_access_token');
    localStorage.removeItem('urjaa_refresh_token');
    setUser(null);
    setProfile(null);
    setPreferences(null);
    setHasSettings(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        hasSettings,
        isLoading,
        login,
        register,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
