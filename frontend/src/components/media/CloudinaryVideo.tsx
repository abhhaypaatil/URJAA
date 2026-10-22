import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { buildCloudinaryVideoUrl, buildCloudinaryVideoPosterUrl } from '../../services/cloudinaryUrlBuilder';
import { isCloudinaryConfigured } from '../../services/cloudinaryService';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Film } from 'lucide-react';

export interface CloudinaryVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  publicId?: string;
  src?: string;
  posterPublicId?: string;
  title: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  fallbackElement?: React.ReactNode;
  containerClassName?: string;
}

export const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  publicId,
  src,
  posterPublicId,
  title,
  aspectRatio = '16:9',
  fallbackElement,
  className,
  containerClassName,
  autoPlay = true,
  loop = true,
  muted = true,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);

  const configured = isCloudinaryConfigured();

  const videoUrl = publicId && configured ? buildCloudinaryVideoUrl(publicId) : src;
  const posterUrl =
    posterPublicId && configured
      ? buildCloudinaryVideoPosterUrl(posterPublicId)
      : publicId && configured
      ? buildCloudinaryVideoPosterUrl(publicId)
      : undefined;

  const aspectStyles = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  // If no source or error, render fallback
  if (hasError || !videoUrl) {
    if (fallbackElement) {
      return (
        <div className={twMerge('overflow-hidden rounded-2xl relative', aspectStyles[aspectRatio], containerClassName)}>
          {fallbackElement}
        </div>
      );
    }

    return (
      <div
        className={twMerge(
          'w-full bg-ivory-100/90 dark:bg-slate-900 border border-plum-100/70 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none',
          aspectStyles[aspectRatio],
          containerClassName
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-blush-50 dark:bg-rose-950/40 border border-blush-200/60 dark:border-rose-900/40 flex items-center justify-center text-blush-600 mb-2 shadow-subtle">
          <Film className="w-6 h-6 text-blush-500" />
        </div>
        <span className="text-sm font-semibold text-plum-950 dark:text-slate-100">{title}</span>
        <span className="text-xs text-plum-500 dark:text-slate-400 mt-1">Exercise Demonstration Video</span>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'relative overflow-hidden rounded-2xl bg-black group select-none shadow-soft',
        aspectStyles[aspectRatio],
        containerClassName
      )}
    >
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        poster={posterUrl || undefined}
        playsInline
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        onError={() => setHasError(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={twMerge('w-full h-full object-cover', className)}
        {...props}
      />

      {/* Floating wellness control bar on hover/touch */}
      <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 pointer-events-none">
        <div className="flex items-center justify-between text-white/90 text-xs">
          <span className="font-semibold drop-shadow">{title}</span>
        </div>

        <div className="flex items-center justify-between pointer-events-auto">
          <button
            type="button"
            onClick={togglePlay}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95"
              title="Restart Demonstration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-95"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
