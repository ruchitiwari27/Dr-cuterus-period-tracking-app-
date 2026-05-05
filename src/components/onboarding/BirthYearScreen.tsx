import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const BirthYearScreen = ({ value, onNext }: { value: number; onNext: (val: number) => void }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1985 + 1 }, (_, i) => 1985 + i);
  const [selectedYear, setSelectedYear] = useState(value || 2000);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 56;
  const visibleItems = 5;
  const centerOffset = Math.floor(visibleItems / 2) * itemHeight;

  const scrollToYear = useCallback((year: number, smooth = false) => {
    if (!scrollRef.current) return;
    const idx = years.indexOf(year);
    if (idx === -1) return;
    scrollRef.current.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [years]);

  useEffect(() => {
    scrollToYear(selectedYear);
  }, [scrollToYear, selectedYear]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const idx = Math.round(scrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(years.length - 1, idx));
    if (years[clamped] !== selectedYear) {
      setSelectedYear(years[clamped]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center px-8 pt-14 pb-8 overflow-y-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dc-heading text-xl font-bold text-center mb-2 text-foreground"
      >
        When were you born?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-sm text-center mb-10 leading-relaxed"
      >
        Your cycle can change with age. Knowing it helps us make better predictions.
      </motion.p>

      {/* Year Picker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative w-full max-w-[280px]"
        style={{ height: visibleItems * itemHeight }}
      >
        {/* Fade gradients top/bottom - made transparent to match light theme properly */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-transparent to-transparent z-20 pointer-events-none" />

        {/* Select highlight band */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none rounded-2xl bg-muted/60"
          style={{
            top: centerOffset,
            height: itemHeight,
          }}
        />

        {/* Scrollable years */}
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
          style={{ paddingTop: centerOffset, paddingBottom: centerOffset }}
          onScroll={handleScroll}
        >
          {years.map((year) => {
            const isSelected = year === selectedYear;
            return (
              <div
                key={year}
                className="snap-center flex items-center justify-center transition-all duration-200"
                style={{ height: itemHeight }}
                onClick={() => {
                  setSelectedYear(year);
                  scrollToYear(year, true);
                }}
              >
                <span
                  className={`text-lg font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "text-foreground font-bold text-2xl"
                      : "text-muted-foreground/40"
                  }`}
                >
                  {year}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Select Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNext(selectedYear)}
        className="w-full max-w-[280px] bg-muted/80 rounded-2xl py-4 text-foreground font-bold text-lg mt-8 transition-all hover:bg-muted active:scale-[0.98]"
      >
        Select
      </motion.button>
    </motion.div>
  );
};

export default BirthYearScreen;
