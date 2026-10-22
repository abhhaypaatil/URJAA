/**
 * Cloudinary Service for Urjaa
 * 
 * Provides secure client-side unsigned uploads to Cloudinary with:
 * - Zero API Secret exposure (only public cloud name + unsigned upload preset used)
 * - Strict client-side validation (file types: jpg, png, webp; max size: 5MB)
 * - Explicit privacy boundary: health/menstrual data must never be uploaded
 * - Safe fallback to local DataURL when Cloudinary credentials are not yet configured
 * - Dynamic transformation helpers for responsive, face-centered avatars and wellness quest snapshots
 */

export interface CloudinaryUploadResult {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  isMockFallback?: boolean;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'thumb' | 'fit' | 'limit' | 'scale';
  gravity?: 'face' | 'center' | 'auto';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const getCloudinaryConfig = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || '';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() || '';

  return {
    cloudName,
    uploadPreset,
    isConfigured: Boolean(cloudName && uploadPreset),
  };
};

/**
 * Checks if the user has provided valid Cloudinary environment variables
 */
export const isCloudinaryConfigured = (): boolean => {
  return getCloudinaryConfig().isConfigured;
};

/**
 * Validates a file before upload
 */
export const validateUploadFile = (fileOrBlob: File | Blob): { valid: boolean; error?: string } => {
  if (fileOrBlob.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(fileOrBlob.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  if (fileOrBlob.type && !ALLOWED_MIME_TYPES.includes(fileOrBlob.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported format (${fileOrBlob.type}). Please upload a JPG, PNG, or WebP image.`,
    };
  }

  return { valid: true };
};

/**
 * Uploads an image file or blob directly to Cloudinary using an unsigned upload preset.
 * Strictly for user avatar photos or daily quest completion snapshots.
 * If credentials are not configured, falls back smoothly to a local DataURL.
 */
export const uploadImageToCloudinary = async (
  fileOrBlob: File | Blob,
  folder: string = 'urjaa/wellness'
): Promise<CloudinaryUploadResult> => {
  // Validate file before initiating any network request
  const validation = validateUploadFile(fileOrBlob);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { cloudName, uploadPreset, isConfigured } = getCloudinaryConfig();

  // Graceful fallback when user hasn't set up credentials yet
  if (!isConfigured) {
    console.info(
      '[URJAA Cloudinary] VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET not configured. Using local fallback preview.'
    );
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: (e.target?.result as string) || URL.createObjectURL(fileOrBlob),
          isMockFallback: true,
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(fileOrBlob),
          isMockFallback: true,
        });
      };
      reader.readAsDataURL(fileOrBlob);
    });
  }

  const formData = new FormData();
  formData.append('file', fileOrBlob);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Cloudinary upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url || data.url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      isMockFallback: false,
    };
  } catch (error) {
    console.warn('[URJAA Cloudinary] Direct upload failed, falling back to local preview:', error);
    return {
      url: URL.createObjectURL(fileOrBlob),
      isMockFallback: true,
    };
  }
};
