import { useState } from "react";
import { motion } from "framer-motion";

const options = [
  "Less than 6 hours",
  "6-7 hours",
  "7–9 hours",
  "9-10 hours",
  "More than 10 hours",
];

const SleepHoursScreen = ({ value, onNext }: { value: string; onNext: (val: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(value || null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dc-heading text-xl font-bold text-left mb-2"
      >
        How many hours of sleep do you usually get?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-sm text-left mb-8"
      >
        Experts recommend around 7 to 9 hours of sleep a night to feel your best.
      </motion.p>

      <div className="space-y-3 flex-1">
        {options.map((opt, i) => (
          <motion.button
            key={opt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            onClick={() => { setSelected(opt); setTimeout(() => onNext(opt), 300); }}
            className={`w-full text-left px-5 py-4 rounded-2xl transition-all text-sm font-medium ${
              selected === opt
                ? "bg-dc-pink-deep text-white shadow-lg"
                : "dc-glass hover:bg-dc-pink/20"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SleepHoursScreen;
