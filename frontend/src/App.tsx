import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { AvatarStudioPage } from './pages/AvatarStudioPage';
import { CompanionPage } from './pages/CompanionPage';
import { CyclePage } from './pages/CyclePage';
import { CheckinPage } from './pages/CheckinPage';
import { NutritionPage } from './pages/NutritionPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { WorkoutSessionPage } from './pages/WorkoutSessionPage';
import { CalendarPage } from './pages/CalendarPage';
import { InsightsPage } from './pages/InsightsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Loading Urjaa...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Dedicated Fullscreen Session Route */}
      <Route
        path="/workout/session/:id"
        element={
          <ProtectedRoute>
            <WorkoutSessionPage />
          </ProtectedRoute>
        }
      />

      {/* Main Authenticated Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/universe" element={<Navigate to="/home" replace />} />
        <Route path="/avatar-studio" element={<AvatarStudioPage />} />
        <Route path="/companion" element={<CompanionPage />} />
        <Route path="/cycle" element={<CyclePage />} />
        <Route path="/check-in" element={<CheckinPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/nutrition/meal/:id" element={<NutritionPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/workout/:id" element={<WorkoutPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
