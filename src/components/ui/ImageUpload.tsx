import { useRef, useState } from 'react';
import { uploadImage } from '../../lib/cloudinary';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, publicId: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = '2md-designer/catalogue',
  label = 'Image',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(0);

    // Aperçu local immédiat
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const result = await uploadImage(file, {
        folder,
        onProgress: setProgress,
      });
      setPreview(result.url);
      onChange(result.url, result.publicId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      setPreview(value || '');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    if (onRemove) onRemove();
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-ink-900">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative rounded-2xl border-2 border-dashed transition cursor-pointer overflow-hidden ${
          uploading
            ? 'border-brand-400 bg-brand-50'
            : 'border-red-200 hover:border-brand-500 hover:bg-red-50'
        }`}
        style={{ aspectRatio: '4 / 3' }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-3" />
                <div className="text-sm font-semibold">{progress}%</div>
              </div>
            )}

            {!uploading && (
              <>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition flex items-center justify-center">
                  <span className="opacity-0 hover:opacity-100 text-white text-sm font-semibold">
                    Cliquer pour changer
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 transition"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-semibold text-ink-900 mb-1">
              {uploading ? 'Upload en cours…' : 'Cliquer ou glisser une image'}
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP — 5 Mo max</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}