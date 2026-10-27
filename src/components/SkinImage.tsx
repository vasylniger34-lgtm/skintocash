import React, { useState } from 'react';

interface SkinImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  fallbackSrc?: string;
}

const DEFAULT_GLOBAL_FALLBACK = '/images/skins/m4a1s_printstream.png';

export const SkinImage: React.FC<SkinImageProps> = ({ 
  src, 
  fallback, 
  fallbackSrc, 
  alt, 
  className, 
  ...props 
}) => {
  const effectiveFallback = fallback || fallbackSrc || DEFAULT_GLOBAL_FALLBACK;
  const [currentSrc, setCurrentSrc] = useState(src || effectiveFallback);
  const [prevSrc, setPrevSrc] = useState(src);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setCurrentSrc(src || effectiveFallback);
    setHasFailedOnce(false);
  }

  const handleError = () => {
    if (!hasFailedOnce && effectiveFallback && currentSrc !== effectiveFallback) {
      setHasFailedOnce(true);
      setCurrentSrc(effectiveFallback);
    } else if (currentSrc !== DEFAULT_GLOBAL_FALLBACK) {
      setCurrentSrc(DEFAULT_GLOBAL_FALLBACK);
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
