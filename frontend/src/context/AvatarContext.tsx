import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAvatar, AvatarStyle, AvatarAuraColor } from '../types';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

interface AvatarContextType {
  avatar: UserAvatar;
  isGenerating: boolean;
  generationStep: string;
  updateAvatar: (updates: Partial<UserAvatar>) => void;
  processPhotoToAvatar: (file: File, style?: AvatarStyle, aura?: AvatarAuraColor) => Promise<string>;
  resetAvatar: () => void;
}

const STORAGE_KEY = 'urjaa_user_avatar';

const DEFAULT_AVATAR: UserAvatar = {
  id: 'avatar-primary-001',
  style: 'celestial',
  auraColor: 'rose',
  energyLevel: 92,
  title: 'Solar Alchemist',
  glowIntensity: 'radiant',
  createdAt: new Date().toISOString(),
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatar, setAvatar] = useState<UserAvatar>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse stored avatar', e);
    }
    return DEFAULT_AVATAR;
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(avatar));
    } catch (e) {
      console.warn('Could not persist avatar to localStorage', e);
    }
  }, [avatar]);

  const updateAvatar = (updates: Partial<UserAvatar>) => {
    setAvatar((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  /**
   * Processes an uploaded user photograph into a stylized cosmic avatar using HTML5 Canvas.
   * Real image processing: applies canvas duotone tints, radial glows, and soft vignettes.
   * Seamlessly persists to Cloudinary (urjaa/avatars) when credentials are provided.
   */
  const processPhotoToAvatar = async (
    file: File,
    targetStyle: AvatarStyle = 'celestial',
    targetAura: AvatarAuraColor = 'rose'
  ): Promise<string> => {
    setIsGenerating(true);

    const steps = [
      'Preparing your photograph...',
      'Analyzing facial geometry & energy resonance...',
      'Synthesizing digital identity...',
      'Harmonizing with your personal universe...',
    ];

    for (const step of steps) {
      setGenerationStep(step);
      await new Promise((r) => setTimeout(r, 450));
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Render onto an offscreen canvas
            const canvas = document.createElement('canvas');
            const size = 512;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Canvas context not available');
            }

            // Draw circular clip
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Background cosmic aura gradient
            const bgGrad = ctx.createRadialGradient(
              size / 2,
              size / 2,
              50,
              size / 2,
              size / 2,
              size / 2
            );
            if (targetAura === 'rose') {
              bgGrad.addColorStop(0, '#4c0519');
              bgGrad.addColorStop(0.7, '#1e1124');
              bgGrad.addColorStop(1, '#090e1d');
            } else if (targetAura === 'sapphire') {
              bgGrad.addColorStop(0, '#0f2942');
              bgGrad.addColorStop(0.7, '#0b162c');
              bgGrad.addColorStop(1, '#090e1d');
            } else if (targetAura === 'violet') {
              bgGrad.addColorStop(0, '#2e1065');
              bgGrad.addColorStop(0.7, '#1b1136');
              bgGrad.addColorStop(1, '#090e1d');
            } else if (targetAura === 'amber') {
              bgGrad.addColorStop(0, '#451a03');
              bgGrad.addColorStop(0.7, '#241208');
              bgGrad.addColorStop(1, '#090e1d');
            } else {
              bgGrad.addColorStop(0, '#064e3b');
              bgGrad.addColorStop(0.7, '#08231c');
              bgGrad.addColorStop(1, '#090e1d');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, size, size);

            // Draw image cropped to center square
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

            // Stylize overlay based on chosen style
            ctx.globalCompositeOperation = 'screen';
            const overlayGrad = ctx.createRadialGradient(
              size / 2,
              size / 2,
              80,
              size / 2,
              size / 2,
              size / 2
            );

            if (targetStyle === 'celestial') {
              overlayGrad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
              overlayGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
              overlayGrad.addColorStop(1, 'rgba(56, 189, 248, 0.3)');
            } else if (targetStyle === 'cybernetic') {
              overlayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
              overlayGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.25)');
              overlayGrad.addColorStop(1, 'rgba(6, 182, 212, 0.35)');
            } else if (targetStyle === 'bioluminescent') {
              overlayGrad.addColorStop(0, 'rgba(52, 211, 153, 0.3)');
              overlayGrad.addColorStop(0.6, 'rgba(45, 212, 191, 0.25)');
              overlayGrad.addColorStop(1, 'rgba(16, 185, 129, 0.35)');
            } else {
              // Ethereal Minimalist
              overlayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
              overlayGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.15)');
              overlayGrad.addColorStop(1, 'rgba(244, 63, 94, 0.15)');
            }

            ctx.fillStyle = overlayGrad;
            ctx.fillRect(0, 0, size, size);

            // Reset composite operation & draw subtle rim light ring
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 6;
            ctx.strokeStyle =
              targetAura === 'rose'
                ? 'rgba(244, 63, 94, 0.8)'
                : targetAura === 'sapphire'
                ? 'rgba(56, 189, 248, 0.8)'
                : targetAura === 'violet'
                ? 'rgba(168, 85, 247, 0.8)'
                : targetAura === 'amber'
                ? 'rgba(251, 191, 36, 0.8)'
                : 'rgba(52, 211, 153, 0.8)';
            ctx.stroke();

            const finalDataUrl = canvas.toDataURL('image/webp', 0.9);
            let finalDeliveryUrl = finalDataUrl;

            // Attempt Cloudinary upload if configured
            try {
              const res = await fetch(finalDataUrl);
              const blob = await res.blob();
              const cldRes = await uploadImageToCloudinary(blob, 'urjaa/avatars');
              if (cldRes.url && !cldRes.isMockFallback) {
                finalDeliveryUrl = cldRes.url;
              }
            } catch (cldErr) {
              console.info('[URJAA] Local avatar retained, Cloudinary upload deferred:', cldErr);
            }

            const updatedAvatar: UserAvatar = {
              id: `avatar-${Date.now()}`,
              sourceImage: e.target?.result as string,
              generatedAvatarUrl: finalDeliveryUrl,
              style: targetStyle,
              auraColor: targetAura,
              energyLevel: 96,
              title:
                targetStyle === 'celestial'
                  ? 'Celestial Luminary'
                  : targetStyle === 'cybernetic'
                  ? 'Quantum Voyager'
                  : targetStyle === 'bioluminescent'
                  ? 'Verdant Harmonic'
                  : 'Ethereal Soul',
              glowIntensity: 'radiant',
              createdAt: new Date().toISOString(),
            };

            setAvatar(updatedAvatar);
            setIsGenerating(false);
            resolve(finalDeliveryUrl);
          } catch (err) {
            setIsGenerating(false);
            reject(err);
          }
        };
        img.onerror = () => {
          setIsGenerating(false);
          reject(new Error('Failed to load image into canvas'));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        setIsGenerating(false);
        reject(new Error('Failed to read photo file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const resetAvatar = () => {
    setAvatar(DEFAULT_AVATAR);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AvatarContext.Provider
      value={{
        avatar,
        isGenerating,
        generationStep,
        updateAvatar,
        processPhotoToAvatar,
        resetAvatar,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};
