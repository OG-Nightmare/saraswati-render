import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// =============================================================================
// REEL CONFIGURATION — EDIT THIS TO SET YOUR FIVE REELS
// =============================================================================
// Place your video files in:  client/public/reels/
// Then update the `src` values below.
// Vite serves the `public` folder at the site root, so reference them as:
//   /reels/reel-1.mp4
//   /reels/reel-2.mp4   …etc.
// =============================================================================
const HOMEPAGE_REELS = [
  { id: 1, src: "/reels/Video-18758.mp4", title: "Ducati Panigale V4 S" },
  { id: 2, src: "/reels/Video-33235.mp4", title: "BMW S1000RR M Package" },
  { id: 3, src: "/reels/Video-34963.mp4", title: "Kawasaki Ninja ZX-10R" },
  { id: 4, src: "/reels/Video-60438.mp4", title: "Aprilia RSV4 Factory" },
  { id: 5, src: "/reels/Video-70365.mp4", title: "Yamaha YZF-R1M" },
];
// =============================================================================

// Alternating vertical rhythm:
// Index 0 (Reel 1): higher (offset 0px)
// Index 1 (Reel 2): lower  (offset +36px)
// Index 2 (Reel 3): higher (offset 0px)
// Index 3 (Reel 4): lower  (offset +36px)
// Index 4 (Reel 5): higher (offset 0px)
const IS_LOWER = [false, true, false, true, false];

function ReelCard({ reel, isLow, index }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const attempt = video.play();
    if (attempt !== undefined) {
      attempt.catch(() => {
        // Autoplay gracefully handled if blocked
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: isLow ? 40 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={`group relative flex-1 min-w-[200px] md:min-w-0 transition-all duration-300 ${
        isLow ? "md:translate-y-8" : "md:translate-y-0"
      }`}
    >
      <div
        className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 hover:border-[#FF5500]/60 transition-all duration-300 cursor-pointer"
        style={{ aspectRatio: "9 / 16" }}
      >
        <video
          ref={videoRef}
          src={reel.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover block pointer-events-none"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-black/20 opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

        {/* Live Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
            Live
          </span>
        </div>

        {/* Subtle Bottom Title / Brand accent */}
        <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-[11px] font-black text-white truncate drop-shadow-md">
            {reel.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedReels() {
  return (
    <div className="w-full py-6 md:py-10">
      {/* 5-Card Alternating Layout */}
      <div className="flex flex-row gap-3 sm:gap-4 md:gap-5 items-start justify-between overflow-x-auto md:overflow-visible pb-6 md:pb-12 scrollbar-hide px-1">
        {HOMEPAGE_REELS.map((reel, i) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            index={i}
            isLow={IS_LOWER[i]}
          />
        ))}
      </div>
    </div>
  );
}
