import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const points = [
  "Know what to look for and get support for reproductive health conditions",
  "Get support for your feelings and stop your symptoms in their tracks",
  "Know what your discharge is telling you about your health and fertility",
];

const GotItScreen = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex-1 flex flex-col items-center px-8 pt-16 pb-8 overflow-y-auto w-full"
  >
    {/* Feminine energy illustration */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="w-48 h-48 flex items-center justify-center mb-6"
    >
      <div className="relative">
        <motion.span
          className="text-8xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌸
        </motion.span>
        <motion.span
          className="absolute -top-3 -right-3 text-3xl"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute -bottom-1 -left-3 text-2xl"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          🦋
        </motion.span>
      </div>
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="dc-heading text-xl font-bold text-center mb-6"
    >
      Got it! We'll help you:
    </motion.h2>

    <div className="w-full space-y-4 flex-1">
      {points.map((point, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.15 }}
          className="flex items-start gap-3"
        >
          <CheckCircle size={22} className="text-dc-pink-deep flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
        </motion.div>
      ))}
    </div>

    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      onClick={onNext}
      className="w-full dc-btn-primary text-sm mt-8"
    >
      Next
    </motion.button>
  </motion.div>
);

export default GotItScreen;
