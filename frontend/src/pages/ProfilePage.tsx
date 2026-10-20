import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAvatar } from '../context/AvatarContext';
import { api } from '../api/client';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  User,
  Settings,
  Download,
  Trash2,
  LogOut,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { WELLNESS_GOALS, DIETARY_PREFERENCES } from '../constants';
import { DietaryPreference, FitnessLevel } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, refreshUserData } = useAuth();
  const { avatar, resetAvatar } = useAvatar();

  const [name, setName] = useState<string>(profile?.name || '');
  const [wellnessGoal, setWellnessGoal] = useState<string>(
    profile?.wellness_goal || 'Hormonal Balance & Gentle Energy'
  );
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(profile?.fitness_level || 'Beginner');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(
    profile?.dietary_preference || 'Vegetarian'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.updateProfile({
        name,
        wellness_goal: wellnessGoal,
        fitness_level: fitnessLevel,
        dietary_preference: dietaryPreference,
      });
      await refreshUserData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `urjaa-health-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      resetAvatar();
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <User className="w-4 h-4 text-rose-500" />
            <span className="uppercase tracking-wider font-mono text-[11px]">User Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Profile & Health Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, dietary preferences, fitness baseline, and private health data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button variant="outline" size="sm" leftIcon={<Settings className="w-3.5 h-3.5" />}>
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 1. Profile Photo / Avatar Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40">
                {avatar.generatedAvatarUrl ? (
                  <img
                    src={avatar.generatedAvatarUrl}
                    alt={profile?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rose-500">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {profile?.name || 'User'}
                </h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {avatar.title || 'Wellness Member'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email || 'user@urjaa.app'}
              </p>
            </div>
          </div>

          <Link to="/avatar-studio">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Camera className="w-3.5 h-3.5" />}
            >
              Update Photo
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Health & Lifestyle Preferences Form */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm">
        <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white mb-4">
          Health & Lifestyle Preferences
        </h3>

        {saveSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Preferences saved and applied to your daily workouts and meals!</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'user@urjaa.app'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Primary Wellness Goal
            </label>
            <select
              value={wellnessGoal}
              onChange={(e) => setWellnessGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {WELLNESS_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {DIETARY_PREFERENCES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} — {d.desc}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full shadow-sm py-2.5"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Privacy & Data Control */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Privacy & Data Sovereignty
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Your cycle history, symptoms, and check-in logs remain private and under your control. You can export your data at any time or permanently delete your account.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            leftIcon={<Download className="w-3.5 h-3.5 text-sapphire-600 dark:text-sapphire-400" />}
            disabled={isExporting}
            onClick={handleExportData}
          >
            {isExporting ? 'Exporting...' : 'Export Health Data (.json)'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account & Health History"
        subtitle="This action cannot be undone."
      >
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-3">
          Deleting your account will permanently remove all logged cycles, check-ins, workout records, and personalized meal configurations.
        </p>
        <div className="flex gap-2.5 pt-3">
          <Button
            variant="outline"
            className="w-1/2"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="w-1/2"
            onClick={handleDeleteAccount}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
