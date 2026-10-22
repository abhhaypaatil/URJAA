import React from 'react';
import { AvatarGraphic } from './AvatarGraphic';
import { CURATED_AVATARS } from '../../constants/avatars';

interface UserAvatarBadgeProps {
  avatarId?: string;
  avatarUrl?: string;
  name?: string;
  size?: number;
  className?: string;
  showBorder?: boolean;
}

export const UserAvatarBadge: React.FC<UserAvatarBadgeProps> = ({
  avatarId,
  avatarUrl,
  name,
  size = 48,
  className = '',
  showBorder = true,
}) => {
  // If custom URL is set (e.g. Cloudinary uploaded/stylized photo)
  if (avatarUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full overflow-hidden shrink-0 ${
          showBorder ? 'border-2 border-urjaa-rose shadow-subtle' : ''
        } ${className}`}
      >
        <img src={avatarUrl} alt={name || 'User avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  // If curated avatarId matches our list
  const isCurated = avatarId && CURATED_AVATARS.some((a) => a.id === avatarId);
  if (isCurated) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full overflow-hidden shrink-0 ${
          showBorder ? 'border-2 border-urjaa-rose shadow-subtle' : ''
        } ${className}`}
      >
        <AvatarGraphic avatarId={avatarId!} size={size} />
      </div>
    );
  }

  // Fallback initial-based monogram with Stage 4 blush & rose styling
  const initial = name?.trim() ? name.trim()[0].toUpperCase() : 'U';

  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.42)) }}
      className={`rounded-full bg-urjaa-blush text-urjaa-plum font-serif font-bold flex items-center justify-center shrink-0 ${
        showBorder ? 'border-2 border-urjaa-rose shadow-subtle' : ''
      } ${className}`}
    >
      {initial}
    </div>
  );
};
