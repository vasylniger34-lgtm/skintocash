import React, { useState } from 'react';

interface SkinImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  fallbackSrc?: string;
}

export const SkinImage: React.FC<SkinImageProps> = ({ 
  src, 
  fallback, 
  fallbackSrc, 
  alt, 
  className, 
  ...props 
}) => {
  const effectiveFallback = fallback || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(src);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setCurrentSrc(src);
  }

  const handleError = () => {
    if (effectiveFallback && currentSrc !== effectiveFallback) {
      setCurrentSrc(effectiveFallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || 'CS2 Weapon Skin'}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
