import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  User,
  Settings,
  Download,
  Trash2,
  Sparkles,
  Heart,
  UtensilsCrossed,
  Activity,
  LogOut,
} from 'lucide-react';
import { WELLNESS_GOALS, DIETARY_PREFERENCES } from '../constants';
import { DietaryPreference, FitnessLevel } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, refreshUserData } = useAuth();

  const [name, setName] = useState<string>(profile?.name || '');
  const [wellnessGoal, setWellnessGoal] = useState<string>(profile?.wellness_goal || 'Better overall health');
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
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Account</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-0.5">
            Your Preferences
          </h1>
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

      {/* Edit Profile Form */}
      <Card>
        {saveSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Wellness Goal
            </label>
            <select
              value={wellnessGoal}
              onChange={(e) => setWellnessGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              {WELLNESS_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full px-4 py-2.5 rounded-2xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            >
              {DIETARY_PREFERENCES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} ({d.desc})
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="rose" className="w-full mt-2" isLoading={isLoading}>
            Save Preferences
          </Button>
        </form>
      </Card>

      {/* Privacy, Export & Data Deletion Card (§17) */}
      <Card className="border-rose-100 dark:border-rose-950/40">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Privacy & Data Sovereignty
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Urjaa is designed with privacy-first health principles. You own your health history, can export it at any time, or permanently purge your account.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            leftIcon={<Download className="w-4 h-4" />}
            isLoading={isExporting}
            onClick={handleExportData}
          >
            Export All Health Data (.json)
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account & Data
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account & Data"
        subtitle="This action is permanent and cannot be undone."
      >
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed my-3">
          Deleting your account will permanently remove all your cycle logs, daily check-ins, workout history, nutrition records, and account credentials from the database.
        </p>
        <div className="flex gap-2 pt-3">
          <Button
            variant="outline"
            className="w-1/2"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Keep Account
          </Button>
          <Button
            variant="danger"
            className="w-1/2"
            onClick={handleDeleteAccount}
          >
            Confirm Permanent Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
