import React, { useState, useRef } from 'react';
import { CURATED_AVATARS, CuratedAvatar, getAvatarById } from '../../constants/avatars';
import { AvatarGraphic } from './AvatarGraphic';
import { UserAvatarBadge } from './UserAvatarBadge';
import { useAvatar } from '../../context/AvatarContext';
import { Button } from '../common/Button';
import { Check, Sparkles, Upload, RefreshCw } from 'lucide-react';

interface AvatarSelectorProps {
  selectedId: string;
  onSelect: (avatarId: string, customUrl?: string) => void;
  customUrl?: string;
  isCompact?: boolean;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedId,
  onSelect,
  customUrl,
  isCompact = false,
}) => {
  const { processPhotoToAvatar, isGenerating, generationStep } = useAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'curated' | 'custom'>(customUrl ? 'custom' : 'curated');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedMeta = getAvatarById(selectedId);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      const generatedUrl = await processPhotoToAvatar(file);
      onSelect(selectedId, generatedUrl);
      setActiveTab('custom');
    } catch (err: any) {
      console.error('Failed to process custom avatar:', err);
      setUploadError(err.message || 'Could not process image');
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-plum-100/60 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('curated')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'curated'
              ? 'bg-urjaa-blush text-urjaa-plum shadow-subtle'
              : 'text-plum-600 dark:text-slate-400 hover:text-plum-950 dark:hover:text-white'
          }`}
        >
          Curated Archetypes ({CURATED_AVATARS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'custom'
              ? 'bg-urjaa-blush text-urjaa-plum shadow-subtle'
              : 'text-plum-600 dark:text-slate-400 hover:text-plum-950 dark:hover:text-white'
          }`}
        >
          Upload Custom Photo
        </button>
      </div>

      {activeTab === 'curated' && (
        <div className="space-y-4">
          {/* Curated Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CURATED_AVATARS.map((avatar) => {
              const isSelected = selectedId === avatar.id && !customUrl;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => onSelect(avatar.id, undefined)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all group flex flex-col items-center sm:items-start text-center sm:text-left ${
                    isSelected
                      ? 'border-urjaa-rose bg-urjaa-blush/40 dark:bg-rose-950/40 ring-2 ring-urjaa-rose shadow-soft'
                      : 'border-plum-100/70 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-urjaa-rose/60 hover:bg-ivory-50/60'
                  }`}
                >
                  <div className="relative mb-2">
                    <AvatarGraphic avatarId={avatar.id} size={isCompact ? 44 : 56} />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-urjaa-rose text-white flex items-center justify-center shadow-subtle">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-urjaa-plum dark:text-white leading-tight">
                    {avatar.name}
                  </h4>
                  <p className="text-[10px] text-plum-600/80 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {avatar.archetype}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active selection archetype description card */}
          {!isCompact && (
            <div className="p-3.5 rounded-2xl bg-ivory-100/80 dark:bg-slate-800/60 border border-plum-100/50 dark:border-slate-700/60 flex items-start gap-3">
              <AvatarGraphic avatarId={selectedMeta.id} size={40} className="shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-serif font-bold text-xs text-urjaa-plum dark:text-white">
                    {selectedMeta.name}
                  </h5>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-urjaa-blush text-urjaa-plum">
                    {selectedMeta.archetype}
                  </span>
                </div>
                <p className="text-[11px] text-plum-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {selectedMeta.description}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="p-5 rounded-2xl border border-plum-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="mx-auto w-20 h-20 rounded-full border-2 border-dashed border-urjaa-rose flex items-center justify-center bg-urjaa-blush/30 overflow-hidden">
            {customUrl ? (
              <img src={customUrl} alt="Custom avatar" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-7 h-7 text-urjaa-rose" />
            )}
          </div>

          <div>
            <h4 className="font-semibold text-xs text-urjaa-plum dark:text-white">
              {customUrl ? 'Custom Photo Active' : 'Upload and Harmonize Photo'}
            </h4>
            <p className="text-[11px] text-plum-600 dark:text-slate-400 max-w-xs mx-auto mt-0.5">
              Processes your picture into a soft wellness portrait and uploads to Cloudinary when available.
            </p>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center gap-2 text-xs text-urjaa-rose font-medium py-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{generationStep || 'Harmonizing avatar...'}</span>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{uploadError}</p>
          )}

          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              {customUrl ? 'Replace Photo' : 'Select Photo'}
            </Button>
            {customUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSelect(selectedId, undefined);
                  setActiveTab('curated');
                }}
              >
                Revert to Curated
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
