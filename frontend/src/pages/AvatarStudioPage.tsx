import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAvatar } from '../context/AvatarContext';
import { AvatarStyle, AvatarAuraColor } from '../types';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  UploadCloud,
  Camera,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  User,
  ShieldCheck,
} from 'lucide-react';

export const AvatarStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { avatar, updateAvatar, processPhotoToAvatar, isGenerating, generationStep } = useAvatar();

  const [step, setStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(avatar.sourceImage || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Style customization in Step 4
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(avatar.style || 'celestial');
  const [selectedAura, setSelectedAura] = useState<AvatarAuraColor>(avatar.auraColor || 'rose');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File validation
  const validateAndStageFile = (file: File) => {
    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image format (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB. Please choose a smaller photograph.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndStageFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartGeneration = async () => {
    if (!selectedFile && !previewDataUrl) return;

    setStep(3); // Show generation progress

    try {
      if (selectedFile) {
        await processPhotoToAvatar(selectedFile, selectedStyle, selectedAura);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        updateAvatar({ style: selectedStyle, auraColor: selectedAura });
      }
      setStep(4);
    } catch (err: any) {
      setUploadError(err.message || 'Generation failed. Please try a different photo.');
      setStep(2);
    }
  };

  const handleStyleChange = async (style: AvatarStyle) => {
    setSelectedStyle(style);
    updateAvatar({
      style,
      title:
        style === 'celestial'
          ? 'Radiant Glow'
          : style === 'cybernetic'
          ? 'Athletic Focus'
          : style === 'bioluminescent'
          ? 'Botanical Harmony'
          : 'Minimal Warmth',
    });
    if (selectedFile) {
      await processPhotoToAvatar(selectedFile, style, selectedAura);
    }
  };

  const handleAuraChange = async (aura: AvatarAuraColor) => {
    setSelectedAura(aura);
    updateAvatar({ auraColor: aura });
    if (selectedFile) {
      await processPhotoToAvatar(selectedFile, selectedStyle, aura);
    }
  };

  const handleConfirm = () => {
    setStep(5);
    setTimeout(() => {
      navigate('/home');
    }, 1800);
  };

  const stylesList: { id: AvatarStyle; label: string; description: string }[] = [
    {
      id: 'celestial',
      label: 'Radiant Glow',
      description: 'Warm rosy lighting with soft portrait depth.',
    },
    {
      id: 'ethereal',
      label: 'Minimal Warmth',
      description: 'Clean modern studio tones with natural warm light.',
    },
    {
      id: 'bioluminescent',
      label: 'Botanical Harmony',
      description: 'Fresh sage green accents and gentle natural tones.',
    },
    {
      id: 'cybernetic',
      label: 'Athletic Focus',
      description: 'Dynamic sapphire contrast for an active feel.',
    },
  ];

  const aurasList: { id: AvatarAuraColor; label: string; dotClass: string }[] = [
    { id: 'rose', label: 'Blush Rose', dotClass: 'bg-rose-500' },
    { id: 'emerald', label: 'Sage Emerald', dotClass: 'bg-emerald-500' },
    { id: 'amber', label: 'Warm Amber', dotClass: 'bg-amber-500' },
    { id: 'sapphire', label: 'Sapphire', dotClass: 'bg-sky-500' },
    { id: 'violet', label: 'Soft Lavender', dotClass: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            <User className="w-4 h-4" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Personal Profile</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Profile Avatar Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create an expressive, personalized avatar from your photo or portrait style.
          </p>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          Skip for now
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step
                ? 'w-7 bg-rose-600 dark:bg-rose-500'
                : s < step
                ? 'w-3 bg-rose-300 dark:bg-rose-800'
                : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: WELCOME */}
      {step === 1 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Camera className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Personalize Your Profile Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Upload a clear selfie or portrait photograph. Our client-side image engine creates a warm, expressive portrait representation for your wellness profile.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 shadow-sm"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Upload Photo
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD */}
      {step === 2 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndStageFile(e.target.files[0]);
              }
            }}
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-rose-400 bg-warm-50/50 dark:bg-slate-800/40'
            }`}
          >
            {previewDataUrl ? (
              <div className="space-y-3">
                <img
                  src={previewDataUrl}
                  alt="Selected"
                  className="w-28 h-28 object-cover rounded-full mx-auto border-2 border-rose-400 shadow-sm"
                />
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block">
                  Click to choose a different photo
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white block">
                    Drop your selfie here or click to browse
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Supports JPEG, PNG, WebP up to 10MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 text-center">{uploadError}</p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="w-1/3" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              className="w-2/3 shadow-sm"
              disabled={!previewDataUrl}
              onClick={handleStartGeneration}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Styles
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: GENERATING */}
      {step === 3 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center animate-spin">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Formatting Your Profile Avatar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {generationStep || 'Refining colors and profile dimensions...'}
          </p>
        </div>
      )}

      {/* STEP 4: PREVIEW & CUSTOMIZE */}
      {step === 4 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-rose-400 shadow-sm shrink-0">
              <img
                src={avatar.generatedAvatarUrl || previewDataUrl || ''}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {profile?.name || 'User'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select your preferred tone and profile border accent below.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Portrait Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stylesList.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStyleChange(st.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedStyle === st.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {st.label}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {st.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {aurasList.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleAuraChange(a.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                    selectedAura === a.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${a.dotClass}`} />
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-sm py-3"
              onClick={handleConfirm}
            >
              Save Avatar to Profile
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: CELEBRATION */}
      {step === 5 && (
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 p-10 text-center shadow-sm space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Profile Avatar Saved!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Applying your profile updates and returning to your dashboard...
          </p>
        </div>
      )}
    </div>
  );
};
