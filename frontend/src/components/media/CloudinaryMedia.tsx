import React from 'react';
import { getMediaEntry } from '../../constants/mediaManifest';
import { CloudinaryImage } from './CloudinaryImage';
import { CloudinaryVideo } from './CloudinaryVideo';
import { ExerciseAnimation } from '../workout/ExerciseAnimations';
import { AnimationType } from '../../types';

export interface CloudinaryMediaProps {
  assetKey?: string;
  publicId?: string;
  mediaType?: 'image' | 'video';
  title?: string;
  altText?: string;
  posterPublicId?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  animationArchetype?: AnimationType;
  className?: string;
  containerClassName?: string;
  customFallback?: React.ReactNode;
}

export const CloudinaryMedia: React.FC<CloudinaryMediaProps> = ({
  assetKey,
  publicId: explicitPublicId,
  mediaType: explicitMediaType,
  title: explicitTitle,
  altText: explicitAltText,
  posterPublicId,
  aspectRatio: explicitAspectRatio,
  animationArchetype: explicitArchetype,
  className,
  containerClassName,
  customFallback,
}) => {
  const manifestEntry = assetKey ? getMediaEntry(assetKey) : undefined;

  const publicId = explicitPublicId || manifestEntry?.publicId;
  const mediaType = explicitMediaType || manifestEntry?.mediaType || 'image';
  const title = explicitTitle || manifestEntry?.title || 'Wellness Media';
  const altText = explicitAltText || manifestEntry?.altText || title;
  const aspectRatio = explicitAspectRatio || manifestEntry?.aspectRatio || '16:9';
  const archetype = (explicitArchetype || manifestEntry?.defaultAnimationArchetype) as AnimationType | undefined;

  // Build the fallback element: SVG Archetype or custom fallback
  const fallback =
    customFallback ||
    (archetype ? (
      <div className="w-full h-full flex items-center justify-center bg-ivory-100/80 dark:bg-slate-900/50 p-4">
        <ExerciseAnimation type={archetype} className="w-full h-full max-w-[200px] max-h-[200px]" />
      </div>
    ) : undefined);

  if (mediaType === 'video') {
    return (
      <CloudinaryVideo
        publicId={publicId}
        posterPublicId={posterPublicId || manifestEntry?.thumbnailPublicId}
        title={title}
        aspectRatio={aspectRatio as '16:9' | '4:3' | '1:1'}
        fallbackElement={fallback}
        className={className}
        containerClassName={containerClassName}
      />
    );
  }

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={altText}
      aspectRatio={aspectRatio}
      fallbackElement={fallback}
      className={className}
      containerClassName={containerClassName}
    />
  );
};
