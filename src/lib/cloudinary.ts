const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UploadOptions {
  folder?: string;
  onProgress?: (percent: number) => void;
  maxSizeMB?: number;
}

/**
 * Upload une image vers Cloudinary
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = '2md-designer',
    onProgress,
    maxSizeMB = 5,
  } = options;

  // Vérifs
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Fichier trop volumineux (max ${maxSizeMB} Mo)`);
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image (JPG, PNG, WebP)');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
        });
      } else {
        reject(new Error(`Upload échoué (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau pendant l\'upload'));
    xhr.send(formData);
  });
}