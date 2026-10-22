import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Sparkles,
  Bot,
  Palette,
} from 'lucide-react';
import { WELLNESS_GOALS, DIETARY_PREFERENCES, FITNESS_GOALS, WORKOUT_LOCATIONS, AVAILABLE_EQUIPMENT } from '../constants';
import { DietaryPreference, FitnessLevel } from '../types';
import { UserAvatarBadge } from '../components/avatar/UserAvatarBadge';
import { AvatarSelector } from '../components/avatar/AvatarSelector';
import { CompanionOrb } from '../components/companion/CompanionOrb';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, refreshUserData } = useAuth();

  const [name, setName] = useState<string>(profile?.name || '');
  const [wellnessGoal, setWellnessGoal] = useState<string>(
    profile?.wellness_goal || 'Hormonal Balance & Gentle Energy'
  );
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    profile?.primary_goal || 'Build strength'
  );
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>(
    profile?.secondary_goals || []
  );
  const [workoutLocation, setWorkoutLocation] = useState<string>(
    profile?.workout_location || 'Home'
  );
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(
    profile?.available_equipment || ['None (Bodyweight)']
  );
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(profile?.fitness_level || 'Beginner');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(
    profile?.dietary_preference || 'Vegetarian'
  );
  const [companionName, setCompanionName] = useState<string>(profile?.companion_name || 'Aura');

  // Avatar customization modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    profile?.avatar_id || 'solar-bloom'
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(
    profile?.avatar_url
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setWellnessGoal(profile.wellness_goal || 'Hormonal Balance & Gentle Energy');
      setPrimaryGoal(profile.primary_goal || 'Build strength');
      setSecondaryGoals(profile.secondary_goals || []);
      setWorkoutLocation(profile.workout_location || 'Home');
      setAvailableEquipment(profile.available_equipment || ['None (Bodyweight)']);
      setFitnessLevel(profile.fitness_level || 'Beginner');
      setDietaryPreference(profile.dietary_preference || 'Vegetarian');
      setCompanionName(profile.companion_name || 'Aura');
      if (profile.avatar_id) setSelectedAvatarId(profile.avatar_id);
      if (profile.avatar_url) setCustomAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.updateProfile({
        name,
        wellness_goal: wellnessGoal,
        primary_goal: primaryGoal,
        secondary_goals: secondaryGoals,
        workout_location: workoutLocation,
        available_equipment: availableEquipment,
        fitness_level: fitnessLevel,
        dietary_preference: dietaryPreference,
        companion_name: companionName.trim() || 'Aura',
        avatar_id: selectedAvatarId,
        avatar_url: customAvatarUrl,
      });
      await refreshUserData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    setIsLoading(true);
    try {
      await api.updateProfile({
        avatar_id: selectedAvatarId,
        avatar_url: customAvatarUrl,
      });
      await refreshUserData();
      setIsAvatarModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update avatar', err);
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
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-plum-100/70 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-plum-600 dark:text-slate-400 mb-1">
            <User className="w-4 h-4 text-urjaa-rose" />
            <span className="uppercase tracking-wider font-mono text-[11px]">User Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-plum-950 dark:text-white tracking-tight">
            Profile & Personalization
          </h1>
          <p className="text-xs sm:text-sm text-plum-600 dark:text-slate-400 mt-1">
            Manage your personal avatar, AI companion name, and authentic wellness intentions.
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
            leftIcon={<LogOut className="w-3.5 h-3.5 text-urjaa-rose" />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 1. Profile Avatar & Identity Card */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <UserAvatarBadge
              avatarId={profile?.avatar_id || selectedAvatarId}
              avatarUrl={profile?.avatar_url || customAvatarUrl}
              name={profile?.name || user?.email}
              size={64}
            />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-plum-950 dark:text-white">
                  {profile?.name || 'Urjaa Voyager'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-urjaa-blush text-urjaa-plum">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-plum-500 dark:text-slate-400 mt-0.5">
                {user?.email || 'user@urjaa.app'}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Palette className="w-3.5 h-3.5 text-urjaa-rose" />}
            onClick={() => setIsAvatarModalOpen(true)}
          >
            Change Avatar
          </Button>
        </div>
      </div>

      {/* 2. AI Companion Info Card */}
      <div className="rounded-3xl border border-urjaa-lavender/80 dark:border-slate-800 bg-gradient-to-r from-urjaa-lavender/30 via-urjaa-blush/20 to-white dark:from-purple-950/20 dark:to-slate-900 p-5 sm:p-6 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-1.5 rounded-2xl bg-white/80 dark:bg-slate-800 shadow-subtle border border-urjaa-lavender/60">
            <CompanionOrb name={companionName} state="idle" size={44} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Your AI Companion
            </span>
            <h4 className="font-serif font-bold text-base text-plum-950 dark:text-white">
              {companionName}
            </h4>
            <p className="text-xs text-plum-600 dark:text-slate-400">
              Attuned to your cycle rhythm, daily workouts, and nourishment.
            </p>
          </div>
        </div>

        <Link to="/settings">
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-urjaa-plum">
            Customize in Settings
          </Button>
        </Link>
      </div>

      {/* 3. Health & Lifestyle Preferences Form */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-soft">
        <h3 className="text-base font-serif font-bold text-plum-950 dark:text-white mb-4">
          Health & Lifestyle Preferences
        </h3>

        {saveSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Profile and companion preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                Your Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                Companion Name
              </label>
              <input
                type="text"
                value={companionName}
                onChange={(e) => setCompanionName(e.target.value)}
                placeholder="e.g. Aura"
                className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
              Primary Wellness Goal
            </label>
            <select
              value={wellnessGoal}
              onChange={(e) => setWellnessGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
            >
              {WELLNESS_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Fitness Goal Personalization (Stage 5) */}
          <div className="p-4 rounded-2xl bg-urjaa-ivory/50 dark:bg-slate-800/60 border border-plum-100 dark:border-slate-700/60 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-plum-950 dark:text-white mb-1">
                What would you most like to work towards? (Primary Goal)
              </label>
              <p className="text-[11px] text-plum-600 dark:text-slate-400 mb-2">
                This personalizes your daily quests, cycle-aligned workouts, and AI recommendations.
              </p>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose font-medium"
              >
                {FITNESS_GOALS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label} — {g.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-plum-800 dark:text-slate-300 mb-1.5">
                Secondary Aspirations (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FITNESS_GOALS.filter((g) => g.id !== primaryGoal).map((g) => {
                  const isSelected = secondaryGoals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSecondaryGoals((prev) =>
                          isSelected ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                        );
                      }}
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-urjaa-rose text-white border-urjaa-rose shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-plum-700 dark:text-slate-300 border-plum-200 dark:border-slate-700 hover:border-urjaa-rose/50'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-plum-700 dark:text-slate-300 mb-1">
                  Workout Location
                </label>
                <select
                  value={workoutLocation}
                  onChange={(e) => setWorkoutLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-xs text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                >
                  {WORKOUT_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-plum-700 dark:text-slate-300 mb-1">
                  Current Fitness Level
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-xs text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                >
                  <option value="Beginner">Beginner (Gentle, low-impact pacing)</option>
                  <option value="Intermediate">Intermediate (Moderate endurance & flow)</option>
                  <option value="Advanced">Advanced (Progressive strength & load)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-plum-700 dark:text-slate-300 mb-1.5">
                Available Equipment
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_EQUIPMENT.map((eq) => {
                  const isSelected = availableEquipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => {
                        setAvailableEquipment((prev) =>
                          isSelected ? prev.filter((item) => item !== eq) : [...prev, eq]
                        );
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-urjaa-plum text-white border-urjaa-plum dark:bg-slate-700'
                          : 'bg-white dark:bg-slate-800 text-plum-700 dark:text-slate-300 border-plum-200 dark:border-slate-700'
                      }`}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
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
              variant="blush"
              size="md"
              className="w-full shadow-soft py-2.5 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* 4. Privacy & Data Control */}
      <div className="rounded-3xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft">
        <h4 className="text-sm font-bold text-plum-950 dark:text-white mb-1">
          Privacy & Data Sovereignty
        </h4>
        <p className="text-xs text-plum-600 dark:text-slate-400 leading-relaxed mb-4">
          Your cycle history, symptoms, and check-in logs remain private and under your control. You can export your data at any time or permanently delete your account.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            leftIcon={<Download className="w-3.5 h-3.5 text-urjaa-rose" />}
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

      {/* Avatar Customization Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Customize Your Wellness Avatar"
        subtitle="Choose from curated archetypes or upload a photo."
      >
        <div className="py-2 space-y-4">
          <AvatarSelector
            selectedId={selectedAvatarId}
            customUrl={customAvatarUrl}
            onSelect={(id, url) => {
              setSelectedAvatarId(id);
              setCustomAvatarUrl(url);
            }}
          />

          <div className="flex gap-2.5 pt-3 border-t border-plum-100 dark:border-slate-800">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="blush"
              className="w-1/2 shadow-soft font-semibold"
              disabled={isLoading}
              onClick={handleSaveAvatar}
            >
              Apply Avatar
            </Button>
          </div>
        </div>
      </Modal>

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
