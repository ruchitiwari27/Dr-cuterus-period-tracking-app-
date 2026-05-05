import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

const symptoms = [
  "Cramps", "Spotting", "Bloating", "Mood swings",
  "Headaches", "Fatigue", "Tender breasts", "Backache",
];

const CycleSymptomsScreen = ({ value, onNext }: { value: string[]; onNext: (val: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>(value || []);
  const toggle = (s: string) =>
    setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto w-full"
    >
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground text-xs text-center mb-3"
      >
        71% of users said the app helps them improve how they manage menstrual symptoms.
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dc-heading text-xl font-bold text-center mb-1"
      >
        Do you experience any cycle-related symptoms?
      </motion.h2>
      <p className="text-muted-foreground text-sm text-center mb-6">Select all that apply</p>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {symptoms.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            onClick={() => toggle(s)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
              selected.includes(s)
                ? "bg-dc-pink-deep text-white shadow-lg"
                : "dc-glass hover:bg-dc-pink/20"
            }`}
          >
            <span className="text-sm font-medium">{s}</span>
            {selected.includes(s) ? (
              <CheckCircle2 size={22} className="text-white" />
            ) : (
              <Circle size={22} className="text-muted-foreground/40" />
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => onNext(selected)}
        className="w-full dc-btn-primary text-sm mt-6"
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default CycleSymptomsScreen;
