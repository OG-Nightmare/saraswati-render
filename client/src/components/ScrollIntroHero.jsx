import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Flame, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import localHeroVideo from '../assets/hero_bike_video.mp4';

const flagshipBikes = [
  'ZX-10R',
  'S1000RR M',
  'HAYABUSA GSX1300R',
  'GSX-R1000R',
  'CBR1000RR-R',
  'MV AGUSTA F4',
  'PANIGALE V4 S'
];

export default function ScrollIntroHero() {
  const containerRef = useRef(null);

  // Track scroll progress within this 220vh container for a slower, cinematic scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background Motion Scale Transform
  const bgScale = useTransform(scrollYProgress, [0, 0.9], [1.05, 1.0]);

  // Line 1 (Brand Name) ALWAYS VISIBLE FROM FRAME 1
  const line1Opacity = useTransform(scrollYProgress, [0, 0.8], [1, 1]);

  // Line 2 (Quote) Motion: Fades in comfortably on initial scroll
  const line2Opacity = useTransform(scrollYProgress, [0.18, 0.45], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.18, 0.45], [20, 0]);

  // Line 3 (Scroll to Ignite) Motion: Fades in comfortably on mid scroll
  const line3Opacity = useTransform(scrollYProgress, [0.48, 0.75], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.48, 0.75], [20, 0]);

  return (
    <div ref={containerRef} className="relative h-[220vh] bg-[#05070B] text-white">
      {/* Sticky Fullscreen Viewport (100% Full Screen Viewport) */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 bg-[#05070B]">
        
        {/* 100% AESTHETIC DARK SUPERBIKE SHOWCASE VIDEO BACKGROUND */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#05070B] w-full h-full">
          <motion.div style={{ scale: bgScale }} className="w-full h-full">
            <video
              src={localHeroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.15]"
            />
          </motion.div>

          {/* Obsidian gradient vignetting for high contrast text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#05070B]/40 to-[#05070B] pointer-events-none" />
        </div>

        {/* Warm Orange Top Spotlight Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FF5500]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Main Animated Text Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7 flex flex-col items-center justify-center min-h-[65vh] pt-14">
          
          {/* LINE 1: Brand Name & Tagline (ALWAYS VISIBLE FROM FRAME 1) */}
          <motion.div
            style={{ opacity: line1Opacity }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-orange-500/40 text-[#FF5500] text-xs font-black uppercase tracking-widest shadow-xl">
              <Flame size={14} className="animate-pulse" />
              Saraswati Motors Flagship Superbike Studio
            </div>

            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] uppercase drop-shadow-2xl"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              <span className="text-white drop-shadow-md">SARASWATI </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#F59E0B] to-[#D97706]">
                MOTORS
              </span>
            </h1>

            <div className="text-xs sm:text-base font-extrabold uppercase tracking-[0.35em] text-slate-300 drop-shadow-md">
              PREMIUM UNMATCHED MOTORBIKES
            </div>

            {/* Autobest-Inspired Flagship Model Ticker Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {flagshipBikes.map((bike, idx) => (
                <span
                  key={idx}
                  className="bg-black/60 backdrop-blur-md border border-white/15 text-slate-200 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                >
                  <Zap size={10} className="text-[#FF5500]" />
                  {bike}
                </span>
              ))}
            </div>
          </motion.div>

          {/* LINE 2: Catchy Luxury Superbike Quote */}
          <motion.div
            style={{ opacity: line2Opacity, y: line2Y }}
            className="max-w-3xl pt-1"
          >
            <div className="relative inline-block bg-black/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl">
              <span className="text-[#FF5500] text-3xl font-serif absolute -top-4 left-6 leading-none">“</span>
              <p
                className="text-base sm:text-2xl md:text-3xl font-medium tracking-wide text-slate-100 italic leading-snug"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Where Engineering Meets Raw Adrenaline.<br className="hidden sm:inline" />
                <span className="text-[#F59E0B] font-bold not-italic"> Sculpting Unrivaled Superbike Perfection.</span>
              </p>
              <span className="text-[#FF5500] text-3xl font-serif absolute -bottom-6 right-6 leading-none">”</span>
            </div>
          </motion.div>

          {/* LINE 3: Scroll to Ignite The Journey Action Indicator */}
          <motion.div
            style={{ opacity: line3Opacity, y: line3Y }}
            className="pt-3 flex flex-col items-center gap-2.5"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#FF5500] bg-orange-950/60 border border-orange-500/50 px-5 py-2 rounded-full shadow-lg backdrop-blur-md">
              <Sparkles size={14} className="text-[#F59E0B]" />
              Scroll to Ignite The Journey
            </div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-md"
            >
              <ChevronDown size={20} className="text-[#FF5500]" />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
