import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PulsingHeart = () => (
  <motion.div
    className="relative"
    animate={{ 
      scale: [1, 1.15, 1],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    <div className="absolute inset-0 bg-dc-pink/20 blur-2xl rounded-full" />
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dc-pink-deep relative z-10">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#FF6B9E" fillOpacity="0.1" />
      <motion.path 
        d="M12 21.21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.39L12 21.21z"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </motion.div>
);

const CalculatingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 60);
    const timer = setTimeout(onComplete, 3500);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden w-full pb-20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-dc-pink/10 blur-[80px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-dc-lavender/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

      <PulsingHeart />

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dc-heading text-2xl font-semibold mt-10 text-center tracking-tight"
      >
        Personalizing your journey
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-sm mt-3 text-center max-w-[200px] leading-relaxed opacity-70"
      >
        Analyzing your unique cycle data with medical precision...
      </motion.p>

      <div className="w-full max-w-[220px] mt-12">
        <div className="h-1.5 rounded-full bg-dc-pink/20 overflow-hidden relative border border-white/40">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: "var(--dc-gradient-button)" }}
            animate={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[10px] font-bold text-dc-pink-deep uppercase tracking-widest opacity-60">Progress</span>
          <span className="text-[11px] font-black text-foreground">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default CalculatingScreen;
