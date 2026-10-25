import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';
import localHeroVideo from '../assets/hero_bike_video.mp4';

const row1Bikes = [
  'ZX-10R',
  'S1000RR M',
  'HAYABUSA GSX1300R',
  'GSX-R1000R',
  'CBR1000RR-R',
  'MV AGUSTA F4',
];

const row2Bikes = [
  'PANIGALE V4 S',
];

export default function ScrollIntroHero() {
  const heroRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 10-second idle scroll indicator (only if visitor hasn't scrolled)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.scrollY < 30) {
        setShowScrollHint(true);
      }
    }, 10000);

    const handleScroll = () => {
      if (typeof window !== 'undefined' && window.scrollY > 25) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Track scroll through the expanded hero track
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Liquid smooth physics damping so wheel notches and trackpad gestures glide seamlessly
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // Stage 1 (0.00 -> 0.35):
  // - Block 1 starts offset by -55px (-35px on mobile)
  // - Block 2 stays centered (0px)
  // - Block 3 starts offset by +55px (+35px on mobile), mirroring the distance of Block 1 & 2
  // Stage 2 (0.35 -> 0.78): Extra scroll buffer holding the converged hero over the video
  // Stage 3 (0.78 -> 1.00): Graceful transition to the next (white) section
  const block1Y = useTransform(smoothProgress, (v) => {
    const p = Math.min(Math.max(v / 0.35, 0), 1);
    const startY = isMobile ? -35 : -55;
    return startY * (1 - p);
  });

  const block3Y = useTransform(smoothProgress, (v) => {
    const p = Math.min(Math.max(v / 0.35, 0), 1);
    const startY = isMobile ? 35 : 55;
    return startY * (1 - p);
  });

  const block2Scale = useTransform(smoothProgress, (v) => {
    const p = Math.min(Math.max(v / 0.35, 0), 1);
    return 1.03 - 0.03 * p;
  });

  // Subtle video parallax scale during the extra scroll buffer
  const videoScale = useTransform(smoothProgress, [0, 0.85], [1, 1.08]);

  // Content gentle lift as it hands off to the next section
  const contentY = useTransform(smoothProgress, (v) => {
    if (v < 0.78) return 0;
    const p = (v - 0.78) / 0.22;
    return -60 * p;
  });

  // Cinematic fade out only near the very end of the extra scroll track
  const heroOpacity = useTransform(smoothProgress, (v) => {
    if (v < 0.82) return 1;
    return Math.max(0.15, 1 - ((v - 0.82) / 0.18) * 0.85);
  });

  const scrollToNext = () => {
    const nextElem = document.getElementById('featured-showcase');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 2.7, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={heroRef}
      className="relative h-[280vh] w-full bg-[#05070B]"
    >
      {/* ── Sticky Fullscreen Viewport Screen ──────────────────────────── */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center text-white px-4 sm:px-6"
      >
        {/* ── Background Video Container (Preserved Exact Video) ─────────── */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#05070B] w-full h-full pointer-events-none">
          <motion.video
            style={{ scale: videoScale }}
            src={localHeroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.20]"
          />

          {/* Cinematic Vignette Overlays for Maximum Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-[#05070B]/85" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#05070B]/35 to-[#05070B]" />
          
          {/* Subtle Warm Spotlight Glow Behind Central Logo */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#FF5500]/12 rounded-full blur-[140px]" />
        </div>

        {/* ── Center Content: Exactly 3 Distinct Blocks with Dynamic Convergence Spacing ── */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 select-none"
        >

          {/* ── Block 1: SUPERBIKES by SARASWATI MOTORS ───────────────── */}
          <motion.div
            style={{ y: block1Y }}
            className="space-y-1.5 sm:space-y-2.5 text-center select-none"
          >
            {/* SUPERBIKES Header */}
            <h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-black italic tracking-tight leading-none uppercase drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <span className="text-white drop-shadow-md">SUPER</span>
              <span className="text-[#FF5500] drop-shadow-[0_4px_24px_rgba(255,85,0,0.6)]">BIKES</span>
            </h1>

            {/* by SARASWATI MOTORS Wordmark */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 leading-none">
              <span
                className="text-slate-300 italic text-2xl sm:text-4xl md:text-5xl font-normal drop-shadow-md -mt-1 sm:-mt-2"
                style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }}
              >
                by
              </span>
              <span
                className="text-white text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.16em] sm:tracking-[0.22em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                SARASWATI MOTORS
              </span>
            </div>
          </motion.div>

          {/* ── Block 2: PREMIUM UNMATCHED MOTORBIKES ──────────────────── */}
          <motion.div
            style={{ scale: block2Scale }}
            className="relative flex items-center justify-center gap-3 sm:gap-4 select-none py-1"
          >
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#FF5500]/70" />
            <div
              className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.35em] sm:tracking-[0.45em] text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] px-1"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              PREMIUM UNMATCHED MOTORBIKES
            </div>
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#FF5500]/70" />
          </motion.div>

          {/* ── Block 3: Multiple Bike Names ───────────────────────────── */}
          <motion.div
            style={{ y: block3Y }}
            className="space-y-2 pt-1 max-w-4xl mx-auto w-full select-none"
          >
            {/* Row 1 (6 Marques) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {row1Bikes.map((bike, idx) => (
                <span
                  key={idx}
                  className="bg-black/75 backdrop-blur-md border border-white/15 hover:border-[#FF5500]/60 text-white text-[10px] sm:text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md hover:bg-black/90 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                >
                  <Zap size={11} className="text-[#FF5500] fill-[#FF5500]" />
                  {bike}
                </span>
              ))}
            </div>

            {/* Row 2 (PANIGALE V4 S Centered) */}
            <div className="flex items-center justify-center">
              {row2Bikes.map((bike, idx) => (
                <span
                  key={idx}
                  className="bg-black/75 backdrop-blur-md border border-white/15 hover:border-[#FF5500]/60 text-white text-[10px] sm:text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md hover:bg-black/90 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                >
                  <Zap size={11} className="text-[#FF5500] fill-[#FF5500]" />
                  {bike}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>

        {/* ── 4. Bottom Subtle Scroll Hint (Revealed after 10s idle, no words) ── */}
        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <AnimatePresence>
            {showScrollHint && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                onClick={scrollToNext}
                className="cursor-pointer flex flex-col items-center gap-1.5 p-2 group outline-none select-none"
                aria-label="Scroll down"
              >
                {/* Minimalist luxury pill outline */}
                <div className="w-[18px] h-8 rounded-full border border-white/30 group-hover:border-[#FF5500]/70 transition-colors flex items-start justify-center p-1 bg-black/40 backdrop-blur-md shadow-lg shadow-black/80">
                  <motion.div
                    animate={{
                      y: [0, 11, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-1 h-1.5 bg-[#FF5500] rounded-full shadow-[0_0_8px_#FF5500]"
                  />
                </div>

                {/* Ultra-subtle downward micro-chevron */}
                <motion.div
                  animate={{
                    y: [0, 3, 0],
                    opacity: [0.2, 0.7, 0.2],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.15,
                  }}
                >
                  <ChevronDown size={13} className="text-[#FF5500] group-hover:scale-110 transition-transform" />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
