'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export default function ColorblindWrapper({ children }: { children: React.ReactNode }) {
  const colorblindMode = useAppStore(state => state.colorblindMode);

  useEffect(() => {
    // Apply CSS filter based on colorblind mode
    const root = document.documentElement;
    
    switch (colorblindMode) {
      case 'deuteranopia':
        // Red-green color blindness (most common, ~5% of males)
        root.style.filter = 'url(#deuteranopia)';
        break;
      case 'protanopia':
        // Red-weak color blindness (~1% of males)
        root.style.filter = 'url(#protanopia)';
        break;
      case 'tritanopia':
        // Blue-yellow color blindness (very rare, ~0.001%)
        root.style.filter = 'url(#tritanopia)';
        break;
      default:
        root.style.filter = 'none';
    }

    return () => {
      root.style.filter = 'none';
    };
  }, [colorblindMode]);

  return (
    <>
      {/* SVG filters for colorblind simulation */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* Deuteranopia (Red-Green colorblindness) */}
          <filter id="deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0   0 0
                      0.7   0.3   0   0 0
                      0     0.3   0.7 0 0
                      0     0     0   1 0"
            />
          </filter>

          {/* Protanopia (Red-weak colorblindness) */}
          <filter id="protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0     0 0
                      0.558 0.442 0     0 0
                      0     0.242 0.758 0 0
                      0     0     0     1 0"
            />
          </filter>

          {/* Tritanopia (Blue-Yellow colorblindness) */}
          <filter id="tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95  0.05  0     0 0
                      0     0.433 0.567 0 0
                      0     0.475 0.525 0 0
                      0     0     0     1 0"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </>
  );
}
