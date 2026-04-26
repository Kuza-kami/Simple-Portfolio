import React from 'react';

export const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
            resolve(event.target?.result as string);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = 'https://picsum.photos/800/600?blur=2';
};

export const getLowResUrl = (url: string): string => {
  if (url.includes('picsum.photos')) {
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    
    if (!isNaN(Number(last)) && !isNaN(Number(secondLast))) {
        parts[parts.length - 1] = '600';
        parts[parts.length - 2] = '400';
        return parts.join('/');
    }
  }
  return url;
};

export const getHighResUrl = (url: string): string => {
  // Check if it's a picsum url
  if (url.includes('picsum.photos')) {
    // Replace dimensions with larger ones, e.g., 1920/1080
    // The current format seems to be .../800/600 or similar
    // We can try to replace the last two path segments if they are numbers
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    
    if (!isNaN(Number(last)) && !isNaN(Number(secondLast))) {
        parts[parts.length - 1] = '1080';
        parts[parts.length - 2] = '1920';
        return parts.join('/');
    }
  }
  return url;
};

export const getBlurredPlaceholderUrl = (url: string): string => {
  if (url.includes('picsum.photos')) {
    return url.includes('?') ? `${url}&blur=10` : `${url}?blur=10`;
  }
  return url;
};
