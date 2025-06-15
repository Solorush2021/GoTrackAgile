import type { SVGProps } from 'react';

const GoTrackLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="48"
    height="48"
    aria-label="GoTrack Agile Logo"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="logoShine" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
        <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#white" result="specOut">
          <fePointLight x="-5000" y="-10000" z="20000" />
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
        <feMerge>
          <feMergeNode in="offsetBlur" />
          <feMergeNode in="litPaint" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#logoShine)">
      <path
        d="M10 50 Q15 20, 40 25 T75 20 Q90 25, 90 50 T75 80 Q40 75, 15 80 T10 50 Z"
        fill="url(#logoGradient)"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
      />
      <path
        d="M30 40 L45 55 L70 30"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default GoTrackLogo;
