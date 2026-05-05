import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollPicker from "./ScrollPicker";

const HeightScreen = ({ value, onNext }: { value: number; onNext: (val: number) => void }) => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [cm, setCm] = useState(value || 165);
  
  // Convert cm to feet/inches
  const totalInches = cm / 2.54;
  const [feet, setFeet] = useState(Math.floor(totalInches / 12));
  const [inches, setInches] = useState(Math.round(totalInches % 12));

  const cmRange = Array.from({ length: 101 }, (_, i) => 120 + i);
  const feetRange = Array.from({ length: 5 }, (_, i) => 3 + i);
  const inchRange = Array.from({ length: 12 }, (_, i) => i);

  const handleCmChange = (newCm: number) => {
    setCm(newCm);
    const ti = newCm / 2.54;
    setFeet(Math.floor(ti / 12));
    setInches(Math.round(ti % 12));
  };

  const handleImperialChange = (newFeet: number, newInches: number) => {
    setFeet(newFeet);
    setInches(newInches);
    setCm(Math.round((newFeet * 12 + newInches) * 2.54));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col px-6 pt-12 pb-8 overflow-y-auto w-full bg-transparent"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center mb-10 text-foreground"
      >
        How tall are you?
      </motion.h2>

      {/* Unit toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-black/5 rounded-full p-1 flex relative w-56">
          <div
            className="absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300"
            style={{ transform: unit === "imperial" ? "translateX(100%)" : "translateX(0)" }}
          />
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 py-1.5 relative z-10 text-[11px] font-bold tracking-wide capitalize transition-colors duration-300 ${
                unit === u ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Display badge */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={unit}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-auto mb-16 w-full max-w-[320px] py-4 rounded-xl bg-black/5 flex items-baseline justify-center gap-2"
        >
          {unit === "metric" ? (
            <>
              <span className="text-[28px] font-bold text-foreground tracking-wider">{cm}</span>
              <span className="text-sm font-bold text-foreground">cm</span>
            </>
          ) : (
            <>
              <span className="text-[28px] font-bold text-foreground">{feet}</span>
              <span className="text-xl font-bold text-foreground -translate-y-1">'</span>
              <span className="text-[28px] font-bold text-foreground pl-1">{inches}</span>
              <span className="text-xl font-bold text-foreground -translate-y-1">"</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pickers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 w-full max-w-[280px] mx-auto"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={unit}
            initial={{ opacity: 0, x: unit === "metric" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: unit === "metric" ? 20 : -20 }}
            transition={{ duration: 0.25 }}
            className="w-full flex items-center justify-center min-h-[180px]"
          >
            {unit === "metric" ? (
              <div className="flex items-center gap-6">
                <div className="w-24">
                  <ScrollPicker 
                    items={cmRange} 
                    selected={cm} 
                    onSelect={(v) => handleCmChange(v as number)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-lg font-bold text-foreground mt-1">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full justify-center">
                <div className="w-20">
                  <ScrollPicker 
                    items={feetRange} 
                    selected={feet} 
                    onSelect={(v) => handleImperialChange(v as number, inches)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-xl font-bold text-foreground -translate-y-2">'</span>
                <div className="w-20">
                  <ScrollPicker 
                    items={inchRange} 
                    selected={inches} 
                    onSelect={(v) => handleImperialChange(feet, v as number)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-xl font-bold text-foreground -translate-y-2">"</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mt-auto pt-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNext(cm)}
          className="w-full dc-btn-primary text-sm"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeightScreen;
