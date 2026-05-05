import { motion } from "framer-motion";

const DischargeDecoderScreen = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 overflow-y-auto w-full"
  >
    {/* Discharge decoder wheel */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="relative w-72 h-72 mb-6"
    >
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Outer ring - Period arc (top, red/coral) */}
        <path
          d="M 150 30 A 120 120 0 0 1 255 90"
          fill="none"
          stroke="hsl(0, 70%, 60%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Right arc - beige/peach */}
        <path
          d="M 260 100 A 120 120 0 0 1 240 220"
          fill="none"
          stroke="hsl(25, 60%, 80%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Bottom arc - Fertile days (teal) */}
        <path
          d="M 230 230 A 120 120 0 0 1 70 230"
          fill="none"
          stroke="hsl(175, 60%, 55%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Left arc - beige/peach */}
        <path
          d="M 60 220 A 120 120 0 0 1 40 100"
          fill="none"
          stroke="hsl(25, 60%, 80%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Left top arc */}
        <path
          d="M 45 90 A 120 120 0 0 1 140 30"
          fill="none"
          stroke="hsl(25, 60%, 80%)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Dot markers */}
        <circle cx="150" cy="30" r="5" fill="hsl(0, 70%, 55%)" />
        <circle cx="150" cy="270" r="5" fill="hsl(175, 60%, 50%)" />
      </svg>

      {/* Labels around the wheel */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-sm font-bold text-red-400">Period</span>
      </motion.div>

      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm font-bold text-teal-500">Fertile days</span>
      </motion.div>

      {/* Discharge type labels */}
      <motion.div
        className="absolute top-16 right-2 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        Sticky
      </motion.div>
      <motion.div
        className="absolute top-28 right-0 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        Creamy
      </motion.div>

      <motion.div
        className="absolute top-16 left-2 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        Sticky
      </motion.div>
      <motion.div
        className="absolute top-28 left-0 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        Creamy
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-4 bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full text-xs font-semibold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Egg white
      </motion.div>

      {/* Discharge illustrations (emoji placeholders) */}
      <span className="absolute top-8 right-14 text-2xl opacity-70">💧</span>
      <span className="absolute top-8 left-14 text-2xl opacity-70">💧</span>
      <span className="absolute bottom-14 right-14 text-2xl opacity-70">🫧</span>
      <span className="absolute bottom-14 left-14 text-2xl opacity-70">🥚</span>
    </motion.div>

    {/* Text */}
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="dc-heading text-xl font-bold text-center mb-3"
    >
      Decode your discharge
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="text-muted-foreground text-sm text-center leading-relaxed mb-auto"
    >
      When you log your discharge, Dr. Cuterus will help you learn how it's connected
      to your cycle and know what to do if something's not right.
    </motion.p>

    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      onClick={onNext}
      className="w-full dc-btn-primary text-sm mt-6"
    >
      Continue
    </motion.button>
  </motion.div>
);

export default DischargeDecoderScreen;
