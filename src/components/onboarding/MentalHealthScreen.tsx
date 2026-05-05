import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

const items = [
  "Mood swings",
  "Anxiety",
  "Fatigue",
  "Irritability",
  "Low mood",
  "I have Premenstrual Dysphoric Disorder (PMDD)",
  "Nope, nothing I can think of",
  "Not sure but I'd like to know more",
];

const MentalHealthScreen = ({ value, onNext }: { value: string[]; onNext: (val: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>(value || []);
  const toggle = (s: string) =>
    setSelected((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

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
        More than half of users say Dr. Cuterus helps them to better understand how their cycle affects their mental health.
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dc-heading text-xl font-bold text-center mb-6"
      >
        Does your cycle impact any aspect of your mental health?
      </motion.h2>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {items.map((item, i) => (
          <motion.button
            key={item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            onClick={() => toggle(item)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
              selected.includes(item)
                ? "bg-dc-pink-deep text-white shadow-lg"
                : "dc-glass hover:bg-dc-pink/20"
            }`}
          >
            <span className="text-sm font-medium text-left">{item}</span>
            {selected.includes(item) ? (
              <CheckCircle2 size={22} className="text-white flex-shrink-0" />
            ) : (
              <Circle size={22} className="text-muted-foreground/40 flex-shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNext(selected)}
        className="w-full dc-btn-primary text-sm mt-6"
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default MentalHealthScreen;
