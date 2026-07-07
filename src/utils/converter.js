const FORMAT_MAP = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  bmp: 'image/bmp',
  gif: 'image/gif',
};

const EXTENSION_MAP = {
  png: 'png',
  jpg: 'jpg',
  jpeg: 'jpg',
  webp: 'webp',
  bmp: 'bmp',
  gif: 'gif',
};

export const SUPPORTED_FORMATS = [
  { value: 'png', label: 'PNG — Compresso senza perdita, supporta trasparenza' },
  { value: 'jpg', label: 'JPEG — Alta compressione, ideale per foto' },
  { value: 'webp', label: 'WebP — Moderno, qualità elevata con file ridotti' },
  { value: 'bmp', label: 'BMP — Bitmap non compresso, massima compatibilità' },
  { value: 'gif', label: 'GIF — 256 colori, supporta animazioni semplici' },
];

export const SUPPORTED_INPUT_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/svg+xml',
  'image/tiff',
  'image/avif',
];

export function getMimeType(format) {
  return FORMAT_MAP[format.toLowerCase()] || 'image/png';
}

export function getExtension(format) {
  return EXTENSION_MAP[format.toLowerCase()] || 'png';
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${size} ${units[i]}`;
}

/**
 * Convert an image File to the specified format.
 * Returns { blob, dataUrl, width, height }
 */
export function convertImage(file, format, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        // For JPEG, fill white background since it doesn't support transparency
        if (format === 'jpg' || format === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const mimeType = getMimeType(format);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error('Conversione fallita: impossibile generare il blob.'));
              return;
            }
            const dataUrl = canvas.toDataURL(mimeType, quality);
            resolve({
              blob,
              dataUrl,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          },
          mimeType,
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossibile caricare l\'immagine. Verifica che il file non sia danneggiato.'));
    };

    img.src = url;
  });
}

/**
 * Create a lightweight preview (max 1200px) for display purposes.
 */
export function createPreviewUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const MAX_DIM = 1200;
        let { naturalWidth: w, naturalHeight: h } = img;

        if (w > MAX_DIM || h > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossibile generare l\'anteprima.'));
    };

    img.src = url;
  });
}
