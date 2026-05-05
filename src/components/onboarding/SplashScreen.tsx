import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CelestialBloomLogo } from "../CelestialBloomLogo";
import splashMoon from "@/assets/splash-moon.jpg";

/* Premium Sparkle Star */
const Sparkle = ({ x, y, delay, size = 2 }: { x: string; y: string; delay: number; size?: number }) => (
  <motion.div
    className="absolute z-10"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.8, 0], 
      scale: [0, 1.2, 0],
      rotate: [0, 180, 360] 
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg width={size * 4} height={size * 4} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
        fill="white"
        fillOpacity="0.6"
      />
    </svg>
  </motion.div>
);

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),   /* Background & Aura */
      setTimeout(() => setPhase(2), 2200),  /* Logo Discovery */
      setTimeout(() => setPhase(3), 3600),  /* Title Reveal */
      setTimeout(() => setPhase(4), 5000),  /* Tagline & Ready */
      setTimeout(() => onComplete(), 7500), /* Proceed to App */
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-[15vh] sm:pt-[20vh] relative overflow-hidden w-full min-h-screen min-h-[100dvh] bg-[#F5D1DA]">
      
      {/* 1. THE AURA BACKGROUND */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Animated Gradient Layer */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 30%, #F5D1DA 0%, #EBBCC9 100%)",
              "radial-gradient(circle at 80% 70%, #F5D1DA 0%, #EBBCC9 100%)",
              "radial-gradient(circle at 50% 50%, #F5D1DA 0%, #EBBCC9 100%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Ambient Moon Aura (Blurred Asset) */}
        <motion.div
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20 blur-[120px]"
           animate={{ rotate: 360, scale: [1, 1.1, 1] }}
           transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity } }}
        >
          <img src={splashMoon} className="w-full h-full object-cover rounded-full" />
        </motion.div>
      </motion.div>

      {/* 2. ATMOSPHERIC SPARKLES */}
      <Sparkle x="15%" y="20%" delay={0.5} size={3} />
      <Sparkle x="85%" y="15%" delay={1.2} size={2} />
      <Sparkle x="75%" y="60%" delay={2.0} size={4} />
      <Sparkle x="20%" y="75%" delay={0.8} size={2} />
      <Sparkle x="50%" y="10%" delay={3.2} size={3} />

      {/* 3. THE CENTERPIECE - THE PROPER MOON (Premium SVG) */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-40 h-40 sm:w-56 sm:h-56 z-20 flex items-center justify-center"
          >
            {/* Cache-Bust Tag v2.0 */}
            {/* Glassmorphic Capsule for the Moon */}
            {/* Glassmorphic Capsule for the SVG Logo */}
            <div className="relative z-20">
              <CelestialBloomLogo size={typeof window !== 'undefined' && window.innerWidth < 400 ? 130 : 180} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. TYPOGRAPHY - ELEGANT SINGLE LINE (No upper lines or swashes) */}
      <div className="mt-4 text-center z-10">
        {phase >= 3 && (
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-[3rem] sm:text-[4.5rem] text-[#2D1E22] leading-tight"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Dr. Cuterus
            </motion.h1>
        )}

        {phase >= 4 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-[11px] font-black text-[#63454A]/60 uppercase tracking-[0.7em]"
          >
            Feminine Energy Reimagined
          </motion.p>
        )}
      </div>

      {/* 5. ELEGANT LOADING INDICATOR */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-4"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-dc-pink-deep/40"
                  animate={{ 
                    y: [0, -4, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.2, 
                    repeat: Infinity 
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] font-medium text-dc-pink-deep/60 uppercase tracking-widest">Initialising Journey</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SplashScreen;
