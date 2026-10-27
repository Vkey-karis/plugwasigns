export interface CompressedImageResult {
  base64: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  savingsPercent: number;
  width: number;
  height: number;
}

export function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image in browser'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth/maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const base64 = canvas.toDataURL('image/jpeg', quality);

        const originalSizeKB = Math.round(file.size / 1024);
        // Base64 size estimation: (base64 length * 3/4) / 1024
        const compressedSizeKB = Math.round(((base64.length - 'data:image/jpeg;base64,'.length) * 3) / 4 / 1024);
        const savingsPercent = Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100));

        resolve({
          base64,
          originalSizeKB,
          compressedSizeKB,
          savingsPercent,
          width,
          height
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
