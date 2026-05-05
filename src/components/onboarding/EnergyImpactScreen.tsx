import { useState } from "react";
import { motion } from "framer-motion";

const options = ["Yes", "No", "I'm not sure"];

const EnergyImpactScreen = ({ value, onNext }: { value: string; onNext: (val: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(value || null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto w-full"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-muted-foreground text-xs text-center mb-3"
      >
        Dr. Cuterus is the #1 Women's Health and Wellness app.
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dc-heading text-xl font-bold text-center mb-8"
      >
        Does your cycle impact your energy or activity levels?
      </motion.h2>

      <div className="space-y-3 flex-1">
        {options.map((opt, i) => (
          <motion.button
            key={opt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
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

export default EnergyImpactScreen;
