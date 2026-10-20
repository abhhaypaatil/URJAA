import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, UserPreferences } from '../types';
import { api } from '../api/client';
import { DEMO_USER, DEMO_PROFILE, DEMO_PREFERENCES } from '../api/mockData';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  hasSettings: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
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
    if (!token) {
      setUser(null);
      setProfile(null);
      setPreferences(null);
      setHasSettings(false);
      setIsLoading(false);
      return;
    }

    if (token === 'demo-local-access-token') {
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setPreferences(DEMO_PREFERENCES);
      setHasSettings(true);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setProfile(data.profile);
      setPreferences(data.preferences || DEMO_PREFERENCES);
      setHasSettings(data.has_settings ?? true);
    } catch (err) {
      console.error('Failed to load current user', err);
      if (token !== 'demo-local-access-token') {
        localStorage.removeItem('urjaa_access_token');
        localStorage.removeItem('urjaa_refresh_token');
        setUser(null);
      }
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
      const accessToken = data.access_token || 'demo-local-access-token';
      const refreshToken = data.refresh_token || 'demo-local-refresh-token';
      localStorage.setItem('urjaa_access_token', accessToken);
      localStorage.setItem('urjaa_refresh_token', refreshToken);
      setUser(data.user || DEMO_USER);
      setProfile(data.profile || DEMO_PROFILE);
      setPreferences(data.preferences || DEMO_PREFERENCES);
      setHasSettings(data.has_settings ?? true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const data = await api.login({ email: 'demo@urjaa.world', password: 'password123' });
      const accessToken = data.access_token || 'demo-local-access-token';
      const refreshToken = data.refresh_token || 'demo-local-refresh-token';
      localStorage.setItem('urjaa_access_token', accessToken);
      localStorage.setItem('urjaa_refresh_token', refreshToken);
      setUser(data.user || DEMO_USER);
      setProfile(data.profile || DEMO_PROFILE);
      setPreferences(data.preferences || DEMO_PREFERENCES);
      setHasSettings(true);
    } catch {
      localStorage.setItem('urjaa_access_token', 'demo-local-access-token');
      localStorage.setItem('urjaa_refresh_token', 'demo-local-refresh-token');
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setPreferences(DEMO_PREFERENCES);
      setHasSettings(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const data = await api.register({ email, password, name });
      const accessToken = data.access_token || 'demo-local-access-token';
      const refreshToken = data.refresh_token || 'demo-local-refresh-token';
      localStorage.setItem('urjaa_access_token', accessToken);
      localStorage.setItem('urjaa_refresh_token', refreshToken);
      setUser(data.user || DEMO_USER);
      setProfile(data.profile || DEMO_PROFILE);
      setPreferences(DEMO_PREFERENCES);
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
        loginDemo,
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
