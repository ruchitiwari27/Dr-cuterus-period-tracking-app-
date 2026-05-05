import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LastPeriodCalendar = ({ value, onNext, onSelectDates }: { value?: string, onNext: () => void, onSelectDates: (dates: Date[]) => void }) => {
  const today = new Date();
  const initialDate = value ? new Date(value) : null;
  const [selectedDates, setSelectedDates] = useState<Date[]>(initialDate ? [initialDate] : []);
  const [dontRemember, setDontRemember] = useState(false);
  const [viewMonth, setViewMonth] = useState(initialDate ? initialDate.getMonth() : today.getMonth());
  const [viewYear, setViewYear] = useState(initialDate ? initialDate.getFullYear() : today.getFullYear());

  const handleDateSelect = (date: Date) => {
    setSelectedDates((prev) => {
      // For this specific screen, we only care about the first day of last period
      const next = [date];
      onSelectDates(next);
      return next;
    });
  };

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear();

  // Allow 12 months back and 12 months forward
  // Set date range to 2025-2028 as requested
  const minDate = new Date(2025, 0, 1);
  const maxDate = new Date(2028, 11, 31);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const canGoPrev = viewYear > minDate.getFullYear() || (viewYear === minDate.getFullYear() && viewMonth > minDate.getMonth());
  const canGoNext = viewYear < maxDate.getFullYear() || (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());

  const prevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const { days, leadingDays, trailingDays, daysInMonth } = useMemo(() => {
    const dim = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startDay = new Date(viewYear, viewMonth, 1).getDay();
    const prevDim = new Date(viewYear, viewMonth, 0).getDate();
    
    // Always use 6 rows (42 days) for a consistent calendar height
    const totalCells = 42;
    const trailingCount = totalCells - (startDay + dim);
    
    return {
      daysInMonth: dim,
      days: Array.from({ length: dim }, (_, i) => i + 1),
      leadingDays: Array.from({ length: startDay }, (_, i) => prevDim - startDay + i + 1),
      trailingDays: Array.from({ length: trailingCount }, (_, i) => i + 1),
    };
  }, [viewMonth, viewYear]);

  const isSelected = (day: number) =>
    selectedDates.some(d => 
      d.getDate() === day &&
      d.getMonth() === viewMonth &&
      d.getFullYear() === viewYear
    );

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  const isFuture = (day: number, monthOffset = 0) => {
    const d = new Date(viewYear, viewMonth + monthOffset, day);
    return d > today;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col px-6 pt-14 pb-8 overflow-y-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dc-heading text-xl font-bold text-center mb-2"
      >
        When did your last period start?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-sm text-center mb-6"
      >
        Select the first day of your last period
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dc-glass-strong rounded-2xl p-4"
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4 px-1">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="p-2.5 rounded-full hover:bg-dc-pink/30 transition-all disabled:opacity-10 active:scale-90"
          >
            <ChevronLeft size={20} className="text-dc-pink-deep" />
          </button>
          
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${viewMonth}-${viewYear}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="font-bold text-sm tracking-wide text-dc-pink-deep"
              >
                {monthNames[viewMonth]} {viewYear}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="p-2.5 rounded-full hover:bg-dc-pink/30 transition-all disabled:opacity-10 active:scale-90"
          >
            <ChevronRight size={20} className="text-dc-pink-deep" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-xs text-muted-foreground font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMonth}-${viewYear}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-1 text-center"
          >
            {leadingDays.map((day, i) => (
              <button
                key={`prev-${i}`}
                onClick={() => {
                  if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
                  else setViewMonth(m => m - 1);
                  handleDateSelect(new Date(viewYear, viewMonth - 1, day));
                }}
                className="w-9 h-9 text-xs text-muted-foreground/30 flex items-center justify-center mx-auto hover:bg-dc-pink/20 rounded-full transition-all"
              >
                {day}
              </button>
            ))}
            
            {days.map((day) => {
              const selected = isSelected(day);
              const future = isFuture(day);
              const todayMark = isToday(day);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleDateSelect(new Date(viewYear, viewMonth, day))
                  }
                  className={`w-9 h-9 rounded-full text-xs font-medium flex items-center justify-center mx-auto relative transition-all ${
                    selected
                      ? "bg-dc-pink-deep text-white shadow-lg z-10"
                      : todayMark
                      ? "ring-2 ring-dc-pink-deep/40 text-dc-pink-deep font-bold"
                      : "hover:bg-dc-pink-medium/30 text-foreground"
                  } ${future && !selected ? "opacity-90" : ""}`}
                >
                  {day}
                  {selected && (
                    <motion.div
                      layoutId="selection-ring"
                      className="absolute inset-0 border-2 border-white/50 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}

            {trailingDays.map((day, i) => (
              <button
                key={`next-${i}`}
                onClick={() => {
                  if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
                  else setViewMonth(m => m + 1);
                  handleDateSelect(new Date(viewYear, viewMonth + 1, day));
                }}
                className="w-9 h-9 text-xs text-dc-pink-deep/40 flex items-center justify-center mx-auto hover:bg-dc-pink/30 rounded-full transition-all"
              >
                {day}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => { setSelectedDates([]); onSelectDates([]); setDontRemember(true); }}
        className="text-xs text-dc-pink-deep font-medium mt-4 text-center"
      >
        I don't remember
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onNext}
        disabled={selectedDates.length === 0 && !dontRemember}
        className="w-full dc-btn-primary text-sm mt-auto disabled:opacity-40"
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default LastPeriodCalendar;
