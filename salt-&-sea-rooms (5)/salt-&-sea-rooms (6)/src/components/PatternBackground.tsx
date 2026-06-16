import React from 'react';
import { useCustomizer } from '../context/CustomizerContext';

export default function PatternBackground() {
  const { themeSettings } = useCustomizer();
  const pattern = themeSettings.selectedPattern;
  const opacityVal = (themeSettings.patternOpacity !== undefined ? themeSettings.patternOpacity : 40) / 100;

  // Render texture overlay dynamically depending on settings
  const useTexture = themeSettings.useGrainTexture !== false && themeSettings.selectedTexture !== 'none';
  const texture = themeSettings.selectedTexture || 'grain';
  const textureOpacityVal = (themeSettings.textureOpacity !== undefined ? themeSettings.textureOpacity : 6) / 100;

  return (
    <>
      {/* Noise / Grain / Texture Overlay (Real Tactile Touch) */}
      {useTexture && (
        <div 
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-overlay"
          style={{ opacity: textureOpacityVal }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Grain / Sand Texture */}
              {texture === 'grain' && (
                <filter id="textureFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
              )}

              {/* Greek Linen / Woven Texture */}
              {texture === 'linen' && (
                <filter id="textureFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.6 0.04" numOctaves="2" stitchTiles="stitch" result="horiz" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.04 0.6" numOctaves="2" stitchTiles="stitch" result="vert" />
                  <feBlend mode="multiply" in="horiz" in2="vert" result="blend" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
              )}

              {/* Aegean Plaster Wall Wallcovering */}
              {texture === 'plaster' && (
                <filter id="textureFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" stitchTiles="stitch" result="turb" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.8 0" in="turb" />
                </filter>
              )}
            </defs>
            <rect width="100%" height="100%" filter="url(#textureFilter)" />
          </svg>
        </div>
      )}

      {pattern !== 'clean' && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
          style={{ opacity: opacityVal }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              {/* Subtle Dots Pattern */}
              {pattern === 'dots' && (
                <pattern
                  id="bg-pattern-dots"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="3"
                    cy="3"
                    r="1"
                    fill="currentColor"
                    className="text-brand/20"
                  />
                </pattern>
              )}

              {/* Architecture Blueprint Fine Grid */}
              {pattern === 'grid' && (
                <pattern
                  id="bg-pattern-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    className="stroke-brand/10"
                  />
                </pattern>
              )}

              {/* Organic Aegean Sea Waves */}
              {pattern === 'waves' && (
                <pattern
                  id="bg-pattern-waves"
                  width="60"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 0 12 Q 15 6, 30 12 T 60 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="stroke-accent-gold/25"
                  />
                </pattern>
              )}

              {/* Pinstripes Luxury Pattern */}
              {pattern === 'stripes' && (
                <pattern
                  id="bg-pattern-stripes"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    className="stroke-brand/15"
                  />
                </pattern>
              )}

              {/* Mediterranean Cement Tiles */}
              {pattern === 'tiles' && (
                <pattern
                  id="bg-pattern-tiles"
                  width="36"
                  height="36"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 18 0 C 18 10, 10 18, 0 18 C 10 18, 18 26, 18 36 C 18 26, 26 18, 36 18 C 26 18, 18 10, 18 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    className="stroke-brand/20"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="2"
                    fill="currentColor"
                    className="text-accent-gold/25"
                  />
                </pattern>
              )}

              {/* Greek Key / Meander Pattern */}
              {pattern === 'meander' && (
                <pattern
                  id="bg-pattern-meander"
                  width="40"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 0 10 L 10 10 L 10 5 L 5 5 L 5 15 L 15 15 L 15 10 L 25 10 L 25 15 L 20 15 L 20 5 L 30 5 L 30 10 L 40 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.85"
                    className="stroke-brand/15"
                  />
                </pattern>
              )}
            </defs>

            <rect
              width="100%"
              height="100%"
              fill={`url(#bg-pattern-${pattern})`}
            />
          </svg>
        </div>
      )}
    </>
  );
}
