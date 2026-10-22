import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { buildCloudinaryImageUrl, buildCloudinarySrcSet, ImageDeliveryOptions } from '../../services/cloudinaryUrlBuilder';
import { isCloudinaryConfigured } from '../../services/cloudinaryService';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export interface CloudinaryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  publicId?: string;
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'thumb' | 'scale';
  gravity?: 'auto' | 'face';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  fallbackElement?: React.ReactNode;
  containerClassName?: string;
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  src,
  alt,
  width,
  height,
  crop = 'fill',
  gravity = 'auto',
  aspectRatio = '16:9',
  fallbackElement,
  className,
  containerClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const configured = isCloudinaryConfigured();

  // If publicId is provided and Cloudinary is configured, build URL & srcset
  const deliveryOptions: ImageDeliveryOptions = { width, height, crop, gravity };
  const cldSrc = publicId && configured ? buildCloudinaryImageUrl(publicId, deliveryOptions) : null;
  const srcSet = publicId && configured ? buildCloudinarySrcSet(publicId) : undefined;

  const finalSrc = cldSrc || src;

  const aspectStyles = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
  };

  // If no source is available, or an error occurred, or unconfigured with no src
  if (hasError || !finalSrc) {
    if (fallbackElement) {
      return (
        <div className={twMerge('overflow-hidden rounded-2xl relative', aspectStyles[aspectRatio], containerClassName)}>
          {fallbackElement}
        </div>
      );
    }

    // Default premium wellness placeholder
    return (
      <div
        className={twMerge(
          'w-full bg-ivory-100/90 dark:bg-slate-900 border border-plum-100/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center select-none',
          aspectStyles[aspectRatio],
          containerClassName
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-blush-50 dark:bg-rose-950/40 border border-blush-200/60 dark:border-rose-900/40 flex items-center justify-center text-blush-600 mb-2 shadow-subtle">
          <ImageIcon className="w-5 h-5 text-blush-500" />
        </div>
        <span className="text-xs font-semibold text-plum-900 dark:text-slate-200 line-clamp-1">{alt}</span>
        <span className="text-[10px] text-plum-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-blush-500" />
          <span>Curated Wellness Media</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'relative overflow-hidden rounded-2xl bg-ivory-100 dark:bg-slate-900 select-none',
        aspectStyles[aspectRatio],
        containerClassName
      )}
    >
      {/* Subtle skeleton shimmer until image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-100 via-blush-50/50 to-ivory-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-pulse" />
      )}

      <img
        src={finalSrc}
        srcSet={srcSet || undefined}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={twMerge(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
};
