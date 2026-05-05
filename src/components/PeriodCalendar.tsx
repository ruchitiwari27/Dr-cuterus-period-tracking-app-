import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Droplets } from "lucide-react";
import {
  format, addMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, differenceInCalendarDays
} from "date-fns";
import { getCyclePhaseForDate, PHASE_COLORS, CyclePhase, getLastPeriodStartDate, getAvgPeriodDuration } from "@/lib/periodUtils";

interface PeriodCalendarProps {
  open: boolean;
  onClose: () => void;
  periodDates: Date[];
  onTogglePeriodDate: (date: Date) => void;
  avgCycleLength: number;
  cycleStats: { avg: number; min: number; max: number }; // Added cycleStats
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  isLogMode?: boolean;
  onSave?: (dates: Date[]) => void;
}

type PhaseType = "menstrual" | "fertile" | "nonfertile" | "none";

const getPhase = (day: Date, periodStarts: Date[], cycleStats: { avg: number; min: number; max: number }, avgPeriodDuration: number): CyclePhase => {
  // Priority 1: Check if the date is explicitly logged by user
  if (periodStarts.some(d => isSameDay(d, day))) return "menstrual";
  
  const lastStart = getLastPeriodStartDate(periodStarts, day);
  if (!lastStart) {
    const sorted = [...periodStarts].sort((a, b) => a.getTime() - b.getTime());
    const earliest = sorted.length > 0 ? sorted[0] : day;
    return getCyclePhaseForDate(day, earliest, cycleStats, avgPeriodDuration).phase;
  }
  return getCyclePhaseForDate(day, lastStart, cycleStats, avgPeriodDuration).phase;
};

const phaseStyles = (phase: CyclePhase): string => {
  switch (phase) {
    case "menstrual":
      return "bg-[#FF6B9E] text-white font-black shadow-sm border-b-2 border-white/20";
    case "fertile":
      return "bg-[#C0EBA6] text-[#2D5A27] font-black shadow-sm";
    case "may-fertile":
      return "bg-[#E2D1FF] text-[#4A148C] font-black shadow-sm";
    case "not-fertile":
      return "bg-[#B9E5FF] text-[#01579B] font-black shadow-sm";
    default:
      return "bg-[#B9E5FF] text-[#01579B] font-black shadow-sm";
  }
};

const MonthGrid = ({
  month,
  periodStarts,
  onTogglePeriodDate,
  cycleStats,
  selectedDate,
  avgPeriodDuration,
  mini = false
}: {
  month: Date;
  periodStarts: Date[];
  onTogglePeriodDate: (date: Date) => void;
  cycleStats: { avg: number; min: number; max: number };
  selectedDate?: Date;
  avgPeriodDuration: number;
  mini?: boolean;
}) => {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  return (
    <div className={mini ? "mb-2" : "mb-8"} data-month={format(month, "yyyy-MM")}>
      <h4 className={`${mini ? "text-[10px] mb-1" : "text-sm mb-3"} font-bold text-foreground/80 px-1`}>
        {format(month, mini ? "MMM" : "MMMM yyyy")}
      </h4>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const inMonth = isSameMonth(day, month);
          const today = isToday(day);
          const phase = inMonth ? getPhase(day, periodStarts, cycleStats, avgPeriodDuration) : "none";

          return (
            <button
              key={i}
              onClick={() => inMonth && onTogglePeriodDate(day)}
              disabled={!inMonth || mini}
              className={`relative flex items-center justify-center rounded-full transition-all font-black
                ${mini ? "h-6 w-6 text-[8px] mx-auto" : "h-11 w-11 text-xs mx-auto mb-1"}
                ${!inMonth ? "opacity-0 pointer-events-none" : ""}
                ${today ? "ring-4 ring-[#FF6B9E] ring-offset-2 scale-105 z-20" : ""}
                ${selectedDate && isSameDay(day, selectedDate) && !mini && !today ? "ring-2 ring-[#FF6B9E] scale-110 z-10 shadow-lg" : ""}
                ${phaseStyles(phase)}
              `}
            >
              <div className="flex flex-col items-center justify-center font-black relative">
                {inMonth && day.getDate()}
                {inMonth && phase === "menstrual" && !mini && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2">
                    <Droplets size={8} className="text-white opacity-80" fill="currentColor" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PeriodCalendar = ({ 
  open, 
  onClose, 
  periodDates, 
  onTogglePeriodDate, 
  avgCycleLength,
  cycleStats, // Added
  selectedDate,
  onSelectDate,
  isLogMode = false,
  onSave
}: PeriodCalendarProps) => {
  const [viewMode, setViewMode] = useState<"months" | "year">("months");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Local state for log sessions
  const [localDates, setLocalDates] = useState<Date[]>([]);
  
  const currentAvgPeriod = useMemo(() => getAvgPeriodDuration(periodDates), [periodDates]);

  // Reset local state when opened in LogMode
  useEffect(() => {
    if (open && isLogMode) {
      setLocalDates([...periodDates]);
    }
  }, [open, isLogMode, periodDates]);

  const activeDates = isLogMode ? localDates : periodDates;

  const handleToggle = (date: Date) => {
    if (isLogMode) {
      setLocalDates((prev) =>
        prev.some((d) => isSameDay(d, date))
          ? prev.filter((d) => !isSameDay(d, date))
          : [...prev, date]
      );
    } else if (onSelectDate) {
      onSelectDate(date);
      onClose();
    } else {
      onTogglePeriodDate(date);
    }
  };

  const months = useMemo(() => {
    const list: Date[] = [];
    const startYear = 2025;
    const endYear = 2028;
    for (let y = startYear; y <= endYear; y++) {
      for (let m = 0; m < 12; m++) {
        list.push(new Date(y, m, 1));
      }
    }
    return list;
  }, []);

  const years = useMemo(() => {
    const groups: Record<number, Date[]> = {};
    months.forEach((m) => {
      const y = m.getFullYear();
      if (!groups[y]) groups[y] = [];
      groups[y].push(m);
    });
    return Object.entries(groups).map(([year, ms]) => ({ year: parseInt(year), ms }));
  }, [months]);

  useEffect(() => {
    if (open && scrollRef.current && viewMode === "months") {
      const now = new Date();
      // Scroll slightly instantly, then smooth for secondary ensure
      const scrollTarget = () => {
        const targetDate = selectedDate || now;
        const el = scrollRef.current?.querySelector(`[data-month="${format(targetDate, "yyyy-MM")}"]`) as HTMLElement;
        if (el) {
          el.scrollIntoView({ block: "start" });
        }
      };
      
      scrollTarget();
      setTimeout(scrollTarget, 100);
      setTimeout(scrollTarget, 300);
    }
  }, [open, viewMode, selectedDate]);

  const yearScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
     if (open && yearScrollRef.current && viewMode === "year") {
        const now = new Date();
        const targetDate = selectedDate || now;
        const yearIdx = years.findIndex(y => y.year === targetDate.getFullYear());
        if (yearIdx !== -1) {
          setTimeout(() => {
            const el = yearScrollRef.current?.children[yearIdx] as HTMLElement;
            el?.scrollIntoView({ block: "start" });
          }, 200);
        }
     }
  }, [open, years, viewMode, selectedDate]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative flex-1 bg-[#FFF0F3] rounded-t-[2.5rem] overflow-hidden flex flex-col mt-6 shadow-2xl border-t border-white/10 dark:border-white/5"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
          >
            {/* Header Area (Static) */}
            <div className="px-6 pt-7 pb-5 bg-[#FFF0F3] z-20 border-b border-muted/10">
              <div className="flex items-center justify-between mb-6">
                 <div>
                   <h3 className="text-2xl font-black text-foreground tracking-tight">
                    {isLogMode ? (periodDates.length > 0 ? "Edit Period Dates" : "Log Period") : "Calendar"}
                   </h3>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 opacity-60">
                    {isLogMode ? "Confirm your dates below" : "Track your cycle"}
                   </p>
                 </div>
                 <button 
                  onClick={onClose} 
                  className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center active:scale-90 transition-all hover:bg-white/60"
                 >
                   <X size={20} className="text-[#FF6B9E]" />
                 </button>
              </div>

              {/* View Toggle - Enhanced Visibility */}
              <div className="bg-secondary/40 dark:bg-secondary/10 p-1 rounded-2xl flex relative mb-2 shadow-inner border border-muted/20">
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-xl shadow-md z-0"
                  animate={{ x: viewMode === "year" ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
                <button
                  onClick={() => setViewMode("months")}
                  className={`flex-1 py-2.5 text-xs font-black relative z-10 transition-all ${viewMode === "months" ? "text-dc-pink-deep" : "text-muted-foreground/60"}`}
                >
                  MONTHS
                </button>
                <button
                  onClick={() => setViewMode("year")}
                  className={`flex-1 py-2.5 text-xs font-black relative z-10 transition-all ${viewMode === "year" ? "text-dc-pink-deep" : "text-muted-foreground/40 dark:text-muted-foreground/60"}`}
                >
                  YEAR
                </button>
              </div>
            </div>

            {/* Static Week Label Headers - Only shows in Months View as requested */}
            {viewMode === "months" && (
              <div className="grid grid-cols-7 px-6 py-3 bg-[#FFF0F3] border-b border-muted/10 z-10">
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                  <div key={d} className="text-center text-[11px] font-black text-[#FF6B9E] uppercase tracking-tighter opacity-80">{d}</div>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {viewMode === "months" ? (
                  <motion.div
                    key="months-view"
                    ref={scrollRef}
                    className="h-full overflow-y-auto px-6 pt-4 pb-20 scroll-smooth"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {months.map((month) => (
                        <MonthGrid
                          key={month.toISOString()}
                          month={month}
                          periodStarts={activeDates}
                          onTogglePeriodDate={handleToggle}
                          cycleStats={cycleStats}
                          selectedDate={selectedDate}
                          avgPeriodDuration={currentAvgPeriod}
                        />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="year-view"
                    ref={yearScrollRef}
                    className="h-full overflow-y-auto px-6 pt-6 pb-20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {years.map(({ year, ms }) => (
                      <div key={year} className="mb-12">
                        <h3 className="text-2xl font-black text-foreground mb-6 pl-1">{year}</h3>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                          {ms.map((m) => (
                            <div key={m.toISOString()} className="scale-90 origin-top">
                              <MonthGrid
                                month={m}
                                periodStarts={activeDates}
                                onTogglePeriodDate={() => {
                                   // Logic to jump back to month view
                                   setViewMode("months");
                                   setTimeout(() => {
                                     const el = scrollRef.current?.querySelector(`[data-month="${format(m, "yyyy-MM")}"]`) as HTMLElement;
                                     el?.scrollIntoView({ block: "start" });
                                   }, 100);
                                }}
                                cycleStats={cycleStats}
                                avgPeriodDuration={currentAvgPeriod}
                                mini
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions for Log Mode */}
            {isLogMode && (
              <div className="px-6 pb-8 pt-4 bg-background border-t border-muted/20 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl bg-muted/20 dark:bg-muted/10 text-foreground font-black text-xs active:scale-95 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => onSave?.(localDates)}
                  className="flex-[2] py-4 rounded-2xl bg-dc-pink-deep text-white font-black text-xs shadow-lg shadow-dc-pink-deep/20 active:scale-95 transition-all"
                >
                  SAVE PERIOD DATES
                </button>
              </div>
            )}

            {/* Static Legend (Bottom) */}
            {!isLogMode && (
              <div className="px-6 py-5 bg-background border-t border-muted/20">
                <div className="flex items-center gap-4 flex-wrap justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFB9C5]" />
                    <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tight">Period</span>
                  </div>
                   <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#88E5E5]" />
                    <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tight">Fertile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2D1FF]" />
                    <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tight">May Fertile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A9DBFF]" />
                    <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tight">Not Fertile</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PeriodCalendar;
