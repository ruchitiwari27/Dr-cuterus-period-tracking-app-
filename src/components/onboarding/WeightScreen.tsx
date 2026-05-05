import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollPicker from "./ScrollPicker";

const WeightScreen = ({ value, onNext }: { value: number; onNext: (val: number) => void }) => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  
  const initialKgWhole = Math.floor(value || 60);
  const initialKgDecimal = Math.round(((value || 60) - initialKgWhole) * 10);
  
  const [kgWhole, setKgWhole] = useState(initialKgWhole);
  const [kgDecimal, setKgDecimal] = useState(initialKgDecimal > 9 ? 0 : initialKgDecimal);

  const initialLbs = (value || 60) * 2.20462;
  const initialLbsWhole = Math.floor(initialLbs);
  const initialLbsDecimal = Math.round((initialLbs - initialLbsWhole) * 10);

  const [lbsWhole, setLbsWhole] = useState(initialLbsWhole);
  const [lbsDecimal, setLbsDecimal] = useState(initialLbsDecimal > 9 ? 0 : initialLbsDecimal);

  const kgRange = Array.from({ length: 121 }, (_, i) => 30 + i);
  const lbsRange = Array.from({ length: 265 }, (_, i) => 66 + i);
  const decimalRange = Array.from({ length: 10 }, (_, i) => i);

  const handleMetricChange = (w: number, d: number) => {
    setKgWhole(w);
    setKgDecimal(d);
    const totalKg = w + d / 10;
    const totalLbs = totalKg * 2.20462;
    setLbsWhole(Math.floor(totalLbs));
    setLbsDecimal(Math.round((totalLbs - Math.floor(totalLbs)) * 10) % 10);
  };

  const handleImperialChange = (w: number, d: number) => {
    setLbsWhole(w);
    setLbsDecimal(d);
    const totalLbs = w + d / 10;
    const totalKg = totalLbs / 2.20462;
    setKgWhole(Math.floor(totalKg));
    setKgDecimal(Math.round((totalKg - Math.floor(totalKg)) * 10) % 10);
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
        How much do you weigh?
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
              <span className="text-[28px] font-bold text-foreground tracking-wider">{kgWhole}</span>
              <span className="text-xl font-bold text-foreground">.</span>
              <span className="text-[28px] font-bold text-foreground">{kgDecimal}</span>
              <span className="text-sm font-bold text-foreground pl-1">kg</span>
            </>
          ) : (
            <>
              <span className="text-[28px] font-bold text-foreground tracking-wider">{lbsWhole}</span>
              <span className="text-xl font-bold text-foreground">.</span>
              <span className="text-[28px] font-bold text-foreground">{lbsDecimal}</span>
              <span className="text-sm font-bold text-foreground pl-1">lbs</span>
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
              <div className="flex items-center gap-2 w-full justify-center">
                <div className="w-20">
                  <ScrollPicker 
                    items={kgRange} 
                    selected={kgWhole} 
                    onSelect={(v) => handleMetricChange(v as number, kgDecimal)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-2xl font-bold text-foreground -translate-y-1">.</span>
                <div className="w-16">
                  <ScrollPicker 
                    items={decimalRange} 
                    selected={kgDecimal} 
                    onSelect={(v) => handleMetricChange(kgWhole, v as number)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-lg font-bold text-foreground mt-1 ml-2">kg</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full justify-center">
                <div className="w-20">
                  <ScrollPicker 
                    items={lbsRange} 
                    selected={lbsWhole} 
                    onSelect={(v) => handleImperialChange(v as number, lbsDecimal)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-2xl font-bold text-foreground -translate-y-1">.</span>
                <div className="w-16">
                  <ScrollPicker 
                    items={decimalRange} 
                    selected={lbsDecimal} 
                    onSelect={(v) => handleImperialChange(lbsWhole, v as number)} 
                    activeFontSize="1.5rem"
                    baseFontSize="1.2rem"
                    visibleItems={3}
                    itemHeight={64}
                  />
                </div>
                <span className="text-lg font-bold text-foreground mt-1 ml-2">lbs</span>
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
          onClick={() => onNext(kgWhole + kgDecimal / 10)}
          className="w-full dc-btn-primary text-sm"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WeightScreen;
