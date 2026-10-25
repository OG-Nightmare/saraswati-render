import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BikeLoader({
  fullScreen = true,
  dark = false,
  message = '',
  onComplete
}) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('SYSTEM CHECK');
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Constants
  const r = 45;
  const circumference = 2 * Math.PI * r; // ≈ 282.74
  const activeArcLength = circumference * 0.75; // ≈ 212.06
  const inactiveGapLength = circumference * 0.25; // ≈ 70.69
  const maxSweep = 92;

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    startTimeRef.current = null;
    let completedTriggered = false;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (!fullScreen) {
        // --- LOOPING MODE ---
        const duration = 2000;
        const ratio = (elapsed % duration) / duration;
        
        // Sine ease-in-out formula for continuous up and down sweep
        // Goes 0 -> 92 -> 0 over 2000ms
        const currentProgress = maxSweep * (0.5 - 0.5 * Math.cos(ratio * 2 * Math.PI));
        setProgress(currentProgress);
        
        // Looping mode preserves statusText as SYSTEM CHECK or message if provided
        setStatusText(message || 'SYSTEM CHECK');
        
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // --- SINGLE-RUN MODE ---
        const duration = 1200;
        const ratio = Math.min(elapsed / duration, 1);

        if (ratio < 0.5) {
          // 0% to 50%: Sweep from 0 to 92 smoothly
          const p = ratio / 0.5; // ranges 0 to 1
          const currentProgress = maxSweep * (0.5 - 0.5 * Math.cos(p * Math.PI));
          setProgress(currentProgress);
          setStatusText('DIAGNOSTIC SWEEP…');
        } else {
          // 50% to 100%: Sweep back from 92 to 0 smoothly
          const p = (ratio - 0.5) / 0.5; // ranges 0 to 1
          const currentProgress = maxSweep * (0.5 + 0.5 * Math.cos(p * Math.PI));
          setProgress(currentProgress);
          setStatusText('SYSTEM READY');
        }

        if (ratio < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setProgress(0);
          setStatusText('SYSTEM READY');
          
          // Trigger completion callback after a small delay to let user admire completed state
          if (onCompleteRef.current && !completedTriggered) {
            completedTriggered = true;
            setTimeout(() => {
              if (onCompleteRef.current) onCompleteRef.current();
            }, 300);
          }
        }
      }
    };

    // Safety fallback timer — guarantees completion after 1400ms even if requestAnimationFrame is throttled
    let safetyTimer = null;
    if (fullScreen) {
      safetyTimer = setTimeout(() => {
        if (!completedTriggered) {
          completedTriggered = true;
          if (onCompleteRef.current) onCompleteRef.current();
        }
      }, 1400);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (safetyTimer) {
        clearTimeout(safetyTimer);
      }
    };
  }, [fullScreen, message]);

  // Trigonometry Calculations for Needle Position
  // Needle rotates from -135 degrees (0%) to 135 degrees (100%)
  const percentage = progress / maxSweep;
  const needleAngleInDegrees = -135 + 270 * percentage;
  const needleAngleInRadians = (needleAngleInDegrees * Math.PI) / 180;

  const needleTipX = 50 + 34 * Math.sin(needleAngleInRadians);
  const needleTipY = 50 - 34 * Math.cos(needleAngleInRadians);

  // Dynamic colors based on progress threshold: starts light greenish, middle orange, end red
  const getProgressColor = (val) => {
    if (val <= maxSweep * 0.4) return '#4ADE80'; // Light greenish
    if (val <= maxSweep * 0.85) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };
  const progressSweepColor = getProgressColor(progress);
  const trackColor = dark ? '#22232A' : '#E5E4E0';
  const hubColor = dark ? '#FFFFFF' : '#1C1C1E';
  
  // Calculate dynamic dasharray to grow clockwise from bottom-left to bottom-right
  const visibleLength = percentage * activeArcLength;
  const strokeDashArrayString = `${visibleLength} ${circumference}`;

  // Speedometer Dial SVG Content
  const speedometerDial = (
    <svg viewBox="0 0 100 100" className="w-48 h-48 select-none overflow-visible">
      {/* Background Track Arc */}
      <circle
        cx="50"
        cy="50"
        r={r}
        stroke={trackColor}
        strokeWidth="4"
        fill="none"
        strokeDasharray={`${activeArcLength} ${inactiveGapLength}`}
        transform="rotate(135 50 50)"
        strokeLinecap="round"
      />

      {/* Progress Sweep Arc - grew clockwise using dynamic dasharray */}
      <circle
        cx="50"
        cy="50"
        r={r}
        stroke={progressSweepColor}
        strokeWidth="4"
        fill="none"
        strokeDasharray={strokeDashArrayString}
        transform="rotate(135 50 50)"
        strokeLinecap="round"
        className="transition-all duration-75 ease-out"
      />

      {/* Needle Line */}
      <line
        x1="50"
        y1="50"
        x2={needleTipX}
        y2={needleTipY}
        stroke={progressSweepColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        className="transition-all duration-75 ease-out"
      />

      {/* Center Pivot Hub */}
      <circle cx="50" cy="50" r="4.5" fill={hubColor} />
    </svg>
  );

  if (!fullScreen) {
    // --- INLINE MODE ---
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="scale-75 transform origin-center flex items-center justify-center">
          {speedometerDial}
        </div>
        {message && (
          <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 select-none ${dark ? 'text-[#9C9A97]' : 'text-[#6B6965]'}`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // --- FULL SCREEN OVERLAY MODE ---
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none ${
        dark ? 'bg-[#111118]' : 'bg-[#FAFAF8]'
      }`}
    >
      {/* Speedometer Dial */}
      <div className="flex items-center justify-center mb-6">
        {speedometerDial}
      </div>

      {/* Branding Logo: SUPERBIKES by SARASWATI MOTORS */}
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex items-center tracking-tight leading-none">
          <span className="text-white text-xl font-black italic tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
            SUPER
          </span>
          <span className="text-[#FF5500] text-xl font-black italic tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
            BIKES
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-slate-400 italic text-sm" style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }}>
            by
          </span>
          <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            SARASWATI MOTORS
          </span>
        </div>
      </div>

      {/* Dynamic Status Text */}
      <div className="h-6 mt-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={statusText}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`text-[10px] font-black uppercase tracking-widest ${
              dark ? 'text-white/80' : 'text-[#6B6965]'
            }`}
          >
            {statusText}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
