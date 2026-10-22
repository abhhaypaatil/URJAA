/**
 * Cloudinary URL Generation Engine using official @cloudinary/url-gen SDK
 * 
 * Generates verified, optimized delivery URLs for:
 * - Responsive images with automated format (f_auto) and quality (q_auto)
 * - Face-aware and content-aware cropping
 * - Video streaming delivery with automated transcoding and poster image generation
 * - Multiple srcset breakpoints (320w, 480w, 640w, 768w, 1024w, 1280w)
 */

import { Cloudinary } from '@cloudinary/url-gen';
import { fill, thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { autoGravity, focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { getCloudinaryConfig } from './cloudinaryService';

// Singleton Cloudinary instance
let cldInstance: Cloudinary | null = null;

export const getCloudinarySDK = (): Cloudinary | null => {
  const { cloudName } = getCloudinaryConfig();
  if (!cloudName) return null;

  if (!cldInstance) {
    cldInstance = new Cloudinary({
      cloud: {
        cloudName,
      },
      url: {
        secure: true,
      },
    });
  }
  return cldInstance;
};

export interface ImageDeliveryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'thumb' | 'scale';
  gravity?: 'auto' | 'face';
  qualityLevel?: 'auto' | 'best' | 'good' | 'eco' | 'low';
  formatType?: 'auto' | 'webp' | 'png' | 'jpg';
}

/**
 * Builds an optimized Cloudinary delivery URL for an image public ID.
 * Returns null if Cloudinary is not configured.
 */
export const buildCloudinaryImageUrl = (
  publicId: string,
  options: ImageDeliveryOptions = {}
): string | null => {
  const cld = getCloudinarySDK();
  if (!cld || !publicId) return null;

  const image = cld.image(publicId);

  // Apply automatic delivery optimization (f_auto, q_auto)
  image.delivery(format(autoFormat()));
  image.delivery(quality(autoQuality()));

  const { width, height, crop = 'fill', gravity = 'auto' } = options;

  if (width || height) {
    if (crop === 'thumb') {
      const resizeAction = thumbnail().width(width || 300).height(height || 300);
      if (gravity === 'face') {
        resizeAction.gravity(focusOn(FocusOn.face()));
      } else {
        resizeAction.gravity(autoGravity());
      }
      image.resize(resizeAction);
    } else if (crop === 'scale') {
      const resizeAction = scale();
      if (width) resizeAction.width(width);
      if (height) resizeAction.height(height);
      image.resize(resizeAction);
    } else {
      // Default to fill
      const resizeAction = fill();
      if (width) resizeAction.width(width);
      if (height) resizeAction.height(height);
      if (gravity === 'face') {
        resizeAction.gravity(focusOn(FocusOn.face()));
      } else {
        resizeAction.gravity(autoGravity());
      }
      image.resize(resizeAction);
    }
  }

  return image.toURL();
};

/**
 * Generates an HTML5-compliant responsive srcset attribute with multiple breakpoints.
 */
export const buildCloudinarySrcSet = (
  publicId: string,
  widths: number[] = [320, 480, 640, 768, 1024, 1280],
  aspectRatioMultiplier: number = 9 / 16
): string | null => {
  const cld = getCloudinarySDK();
  if (!cld || !publicId) return null;

  const entries = widths.map((w) => {
    const h = Math.round(w * aspectRatioMultiplier);
    const url = buildCloudinaryImageUrl(publicId, { width: w, height: h, crop: 'fill' });
    return url ? `${url} ${w}w` : null;
  });

  const validEntries = entries.filter(Boolean);
  return validEntries.length > 0 ? validEntries.join(', ') : null;
};

/**
 * Builds an optimized Cloudinary video streaming URL.
 */
export const buildCloudinaryVideoUrl = (
  publicId: string,
  options: { width?: number; height?: number } = {}
): string | null => {
  const cld = getCloudinarySDK();
  if (!cld || !publicId) return null;

  const video = cld.video(publicId);
  video.delivery(format(autoFormat()));
  video.delivery(quality(autoQuality()));

  if (options.width || options.height) {
    const resizeAction = fill();
    if (options.width) resizeAction.width(options.width);
    if (options.height) resizeAction.height(options.height);
    video.resize(resizeAction);
  }

  return video.toURL();
};

/**
 * Generates a video poster image URL from the video asset itself (first keyframe).
 */
export const buildCloudinaryVideoPosterUrl = (
  videoPublicId: string,
  width: number = 640,
  height: number = 360
): string | null => {
  return buildCloudinaryImageUrl(videoPublicId, {
    width,
    height,
    crop: 'fill',
    formatType: 'jpg',
  });
};
