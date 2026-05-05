import { motion } from "framer-motion";

const CycleMoodScreen = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto w-full"
  >
    {/* Mood curve visualization */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative w-full h-56 mb-6"
    >
      <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
        {/* Mood curve */}
        <path
          d="M 20 130 C 60 130, 80 40, 130 40 C 160 40, 170 100, 200 100 C 220 100, 230 70, 260 60 C 280 55, 290 80, 310 80"
          stroke="hsl(25, 80%, 60%)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Period bar */}
        <rect x="20" y="155" width="80" height="8" rx="4" fill="hsl(340, 80%, 70%)" opacity="0.8" />
        {/* Fertile bar */}
        <rect x="140" y="155" width="100" height="8" rx="4" fill="hsl(175, 60%, 60%)" opacity="0.8" />
        {/* Grey bars */}
        <rect x="100" y="155" width="40" height="8" rx="4" fill="hsl(0, 0%, 85%)" />
        <rect x="240" y="155" width="70" height="8" rx="4" fill="hsl(0, 0%, 85%)" />
      </svg>

      {/* Emoji labels */}
      <motion.div
        className="absolute top-1 left-16 flex items-center gap-1.5 bg-dc-peach/60 rounded-full px-2.5 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-base">⚡</span>
        <span className="text-xs font-semibold">Energetic</span>
      </motion.div>

      <motion.div
        className="absolute top-8 right-4 flex items-center gap-1.5 bg-dc-peach/60 rounded-full px-2.5 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-base">😣</span>
        <span className="text-xs font-semibold">Irritated</span>
      </motion.div>

      <motion.div
        className="absolute bottom-14 left-2 flex items-center gap-1.5 bg-dc-peach/60 rounded-full px-2.5 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-base">😔</span>
        <span className="text-xs font-semibold">Sad</span>
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-dc-peach/60 rounded-full px-2.5 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="text-base">😌</span>
        <span className="text-xs font-semibold">Calm</span>
      </motion.div>

      {/* Legend */}
      <div className="absolute bottom-0 left-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-dc-coral" />
          <span className="text-xs text-dc-coral font-medium">Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-dc-teal" />
          <span className="text-xs text-dc-teal font-medium">Fertile days</span>
        </div>
      </div>
    </motion.div>

    {/* Text content */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex-1 flex flex-col"
    >
      <h2 className="dc-heading text-xl font-bold text-center mb-3">
        Next we'll look at your cycle
      </h2>
      <p className="text-muted-foreground text-sm text-center leading-relaxed">
        Your hormones are different in each stage. When you log your periods, Dr. Cuterus
        will help you optimize your life around them.
      </p>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      onClick={onNext}
      className="w-full dc-btn-primary text-sm mt-auto"
    >
      Next
    </motion.button>
  </motion.div>
);

export default CycleMoodScreen;
