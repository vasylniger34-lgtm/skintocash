import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Core Emerald to Cyan Cyber Gradient */}
        <linearGradient id="skcGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Ambient Dark Obsidian Facet */}
        <linearGradient id="skcGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111927" />
          <stop offset="100%" stopColor="#0B1017" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="skcGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hexagonal Shield Background */}
      <polygon
        points="32,4 58,18 58,46 32,60 6,46 6,18"
        fill="url(#skcGradDark)"
        stroke="url(#skcGradPrimary)"
        strokeWidth="2"
        strokeLinejoin="round"
        className="opacity-95"
      />

      {/* Inner CS2 Blade / S-Currency Lightning Slash */}
      <g filter="url(#skcGlow)">
        {/* Upper blade facet */}
        <path
          d="M32 10L48 20L36 31L22 23L32 10Z"
          fill="url(#skcGradPrimary)"
          fillOpacity="0.95"
        />

        {/* Dynamic Center Slash */}
        <path
          d="M48 22L42 34L26 31L32 20L48 22Z"
          fill="#34D399"
          fillOpacity="0.8"
        />

        {/* Lower counter-blade / cash arrow */}
        <path
          d="M32 54L16 44L28 33L42 41L32 54Z"
          fill="url(#skcGradPrimary)"
          fillOpacity="0.95"
        />

        {/* Central Currency Pulse Core */}
        <circle cx="32" cy="32" r="3.5" fill="#E6FFFA" />
      </g>
    </svg>
  );
};

export default LogoIcon;
