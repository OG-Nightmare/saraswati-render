import React from 'react';
import { Link } from 'react-router-dom';
import sLogoMetallic from '../assets/s_logo_metallic.png';

/**
 * Superbikes by Saraswati Motors - Official 3D Metallic Emblem & Wordmark
 * Faithful recreation using the exact 3D metallic S emblem.
 */
export function SuperbikesEmblem({ size = 44, framed = true, className = '' }) {
  if (framed) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-xl bg-gradient-to-b from-[#2A3040]/80 via-[#10131B]/95 to-[#07090E] p-1 shadow-lg border border-white/20 flex items-center justify-center flex-shrink-0 group overflow-hidden ${className}`}
      >
        {/* Subtle orange inner ignition glow */}
        <div className="absolute inset-0 bg-[#FF5500]/10 rounded-xl blur-xs pointer-events-none" />
        <img
          src={sLogoMetallic}
          alt="Saraswati Superbikes 3D Metallic S Emblem"
          className="w-[92%] h-[92%] object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(255,85,0,0.45)] group-hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: Math.round(size * 0.85) }}
      className={`relative flex items-center justify-center flex-shrink-0 group ${className}`}
    >
      <img
        src={sLogoMetallic}
        alt="Saraswati Superbikes 3D Metallic S Emblem"
        className="w-full h-full object-contain drop-shadow-[0_4px_14px_rgba(255,85,0,0.5)] group-hover:scale-105 transition-transform"
      />
    </div>
  );
}

export default function BrandLogo({ size = 44, framed = true, className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-3 group select-none ${className}`}>
      <SuperbikesEmblem size={size} framed={framed} />
      <div className="flex flex-col justify-center leading-none">
        {/* SUPERBIKES Wordmark */}
        <div className="flex items-center tracking-tight">
          <span
            className="text-white text-xl sm:text-2xl font-black italic tracking-wide"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            SUPER
          </span>
          <span
            className="text-[#FF5500] text-xl sm:text-2xl font-black italic tracking-wide drop-shadow-[0_2px_10px_rgba(255,85,0,0.5)]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            BIKES
          </span>
        </div>

        {/* by SARASWATI MOTORS */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-slate-300 italic text-sm sm:text-base font-normal -mt-0.5"
            style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }}
          >
            by
          </span>
          <span
            className="text-slate-200 text-[10px] sm:text-[11px] font-black tracking-[0.22em] uppercase"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            SARASWATI MOTORS
          </span>
        </div>
      </div>
    </Link>
  );
}
