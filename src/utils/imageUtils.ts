import React from 'react';

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
