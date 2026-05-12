import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Calendar, Info, Plus, CheckCircle, Clock, History, Activity, Pill,
  CalendarDays, Lightbulb, Heart, MessageCircle, Settings, Check, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { isSameDay, differenceInCalendarDays, format, addDays, startOfWeek } from "date-fns";
import { formatDateToYYYYMMDD } from "@/lib/dateUtils";
import cardMoodEnergy from "@/assets/card-mood-energy.jpg";
import cardMoodSwings from "@/assets/card-mood-swings.jpg";
import cardDischarge from "@/assets/card-discharge.jpg";
import cardSleep from "@/assets/card-sleep.jpg";
import cardNutrition from "@/assets/card-nutrition.jpg";
import cardHydration from "@/assets/card-hydration.jpg";
import cardMindfulness from "@/assets/card-mindfulness.jpg";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Label,
  PieChart, Pie, Cell, ReferenceArea
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import SettingsSection from "./SettingsSection";
import { User } from "lucide-react";
import CelestialBloomLogo from "./CelestialBloomLogo";
import PeriodCalendar from "./PeriodCalendar";
import InsightsSection from "./InsightsSection";
import snehaAvatar from "@/assets/sneha-avatar.png";
import MessagesSection from "./MessagesSection";
import HealthTipsSection from "./HealthTipsSection";
import { SymptomsLogPage } from "./SymptomsLogPage";
import { DailyWellnessLog } from "./DailyWellnessLog";
import { WellnessHistory } from "./WellnessHistory";
import { getCyclePhaseForDate, PHASE_COLORS, CyclePhase, getLastPeriodStartDate, getPeriodBlocks, calculateMovingAverage, getCycleStats, getAvgPeriodDuration } from "@/lib/periodUtils";

const CYCLE_LENGTH_DEFAULT = 28;
 
export interface DailyLogEntry {
  mood: string;
  symptoms: string[];
  notes: string;
  hashtags?: string;
  periodStatus?: string;
}

const TodaySection = ({ 
  onOpenCalendar, 
  onOpenProfile, 
  periodDates,
  sorted,
  cycles,
  avgCycleLength,
  cycleStats,
  cycleVariation,
  hasData,
  selectedDate,
  onSelectDate,
  onOpenLog,
  onOpenSymptomsLog,
  dailyLogs,
  currentAvgPeriod,
  onOpenHistory,
  setDailyLogs,
  setPeriodDates
}: { 
  onOpenCalendar: () => void; 
  onOpenProfile: () => void;
  periodDates: Date[]; 
  sorted: Date[];
  cycles: { start: Date; length: number }[];
  avgCycleLength: number;
  cycleStats: { avg: number; min: number; max: number }; // Added cycleStats type
  cycleVariation: { min: number; max: number } | null;
  hasData: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenLog: () => void;
  onOpenSymptomsLog: () => void;
  dailyLogs: Record<string, DailyLogEntry>;
  currentAvgPeriod: number;
  onOpenHistory: () => void;
  setDailyLogs: React.Dispatch<React.SetStateAction<Record<string, DailyLogEntry>>>;
  setPeriodDates: React.Dispatch<React.SetStateAction<Date[]>>;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const today = new Date();
  const todayKey = format(selectedDate, "yyyy-MM-dd");
  const hasLoggedToday = !!dailyLogs[todayKey];
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Defensive date calculations
  // Anchor the calendar range to actual "Today" so it doesn't jump randomly
  const calendarRangeAnchor = new Date();
  const startOfCalendar = addDays(calendarRangeAnchor, -15);
  const calendarDays = Array.from({ length: 31 }).map((_, i) => addDays(startOfCalendar, i));
  const daysOfWeekFull = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const todayDateStr = format(selectedDate, "dd");
  const monthName = format(selectedDate, "MMMM");
  const yearName = format(selectedDate, "yyyy");
  const currentYear = format(new Date(), "yyyy");
  const isSelectedToday = isSameDay(selectedDate, today);

  // Scroll to center selected date on mount or when selectedDate changes
  useEffect(() => {
    // Safety check: ensure selectedDate is valid before trying to use it
    if (!selectedDate || isNaN(selectedDate.getTime())) return;

    if (scrollRef.current) {
      const activeItem = scrollRef.current.querySelector("[data-active='true']");
      if (activeItem) {
        const container = scrollRef.current;
        const scrollLeft = (activeItem as HTMLElement).offsetLeft - (container.clientWidth / 2) + ((activeItem as HTMLElement).clientWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [selectedDate]);






  const getPhaseForDate = (date: Date) => {
    // Priority 1: Check if the date is explicitly logged by user
    if (sorted.some(d => isSameDay(d, date))) return "menstrual";

    if (sorted.length === 0) return "none";
    const lastPeriod = getLastPeriodStartDate(sorted, date);
    if (!lastPeriod) {
       const earliest = sorted[0];
       return getCyclePhaseForDate(date, earliest, cycleStats, currentAvgPeriod).phase;
    }
    return getCyclePhaseForDate(date, lastPeriod, cycleStats, currentAvgPeriod).phase;
  };

  const cycleInfo = useMemo(() => {
    if (sorted.length === 0) {
      return { 
        phase: "none" as CyclePhase, 
        labelText: "Track your first period", 
        daysCount: "--", 
        subText: "Log your last period to see predictions \u24D8",
        cycleDay: 0,
        chanceOfPregnancy: "Low" as const,
        isLogged: false
      };
    }

    const lastPeriod = getLastPeriodStartDate(sorted, selectedDate);
    if (!lastPeriod) {
      return { 
        phase: "none" as CyclePhase, 
        labelText: "Track your first period", 
        daysCount: "--", 
        subText: "Log your last period to see predictions \u24D8",
        cycleDay: 0,
        chanceOfPregnancy: "Low" as const,
        isLogged: false
      };
    }
    const info = getCyclePhaseForDate(selectedDate, lastPeriod, cycleStats, currentAvgPeriod);
    const isLoggedSpecific = sorted.some(d => isSameDay(d, selectedDate));
    
    const isLoggedPeriodActive = info.phase === "menstrual" && lastPeriod !== null;

    let label = "";
    let count = "";
    let sub = "";

    if (isLoggedSpecific) {
      label = "Period:";
      count = `Day ${info.cycleDay}`;
      sub = "Keep logging to stay accurate";
    } else if (info.phase === "menstrual") {
      if (isSelectedToday) {
        label = "Period";
        count = "may start today";
        sub = "Log your period to track your cycle";
      } else {
        label = "Future cycle:";
        count = `Day ${info.cycleDay}`;
        sub = "Log your period to track your cycle";
      }
    } else if (info.phase === "may-fertile") {
      label = isSelectedToday ? "Predicted Status" : "Future cycle:";
      count = "May Fertile";
      sub = "Fertility window is approaching \u24D8";
    } else if (info.phase === "fertile") {
      label = isSelectedToday ? "Predicted Status" : "Future cycle:";
      count = "Fertile";
      sub = "High chance of getting pregnant \u24D8";
    } else {
      label = isSelectedToday ? "Predicted Status" : "Future cycle:";
      count = "Not Fertile";
      sub = "Low chances of getting pregnant \u24D8";
    }

    return { 
      phase: info.phase, 
      labelText: label, 
      daysCount: count, 
      subText: sub,
      cycleDay: info.cycleDay,
      fertilityStatus: info.fertilityStatus,
      chanceOfPregnancy: info.fertilityStatus === "high" || info.fertilityStatus === "medium" ? "High" : "Low",
      isLogged: isLoggedSpecific || isLoggedPeriodActive
    };
  }, [sorted, cycleStats, selectedDate, currentAvgPeriod, isSelectedToday]);

  const { phase, labelText, daysCount, subText, cycleDay, chanceOfPregnancy, isLogged } = cycleInfo;

  const themeStyles = {
    menstrual: {
      wrapperBg: "bg-gradient-to-b from-[#FFF0F3] to-[#FFB9C5] dark:from-pink-900/40 dark:to-pink-950/20",
      screenBg: "bg-background",
      textColor: "text-[#1A1A1A] dark:text-pink-100",
      subTextColor: "text-[#1A1A1A]/70 dark:text-pink-200/60",
      buttonBg: "bg-white text-[#FF6B9E] dark:bg-pink-100 dark:text-pink-900",
      dayActive: "bg-white text-[#FF6B9E] w-12 h-12 shadow-md",
      dayNormal: "text-[#1A1A1A]/70 w-9 h-9",
    },
    fertile: {
      wrapperBg: "bg-gradient-to-b from-[#F0FCFC] to-[#88E5E5] dark:from-teal-900/40 dark:to-teal-950/20",
      screenBg: "bg-background",
      textColor: "text-[#1A1A1A] dark:text-green-50",
      subTextColor: "text-[#1A1A1A]/60 dark:text-green-200/60",
      buttonBg: "bg-white text-[#20B2AA] dark:bg-teal-100 dark:text-teal-900",
      dayActive: "bg-white text-[#20B2AA] w-12 h-12 shadow-sm",
      dayNormal: "text-[#1A1A1A]/60 w-9 h-9",
    },
    "may-fertile": {
      wrapperBg: "bg-gradient-to-b from-[#F9F5FF] to-[#E2D1FF] dark:from-purple-900/40 dark:to-purple-950/20",
      screenBg: "bg-background",
      textColor: "text-[#1A1A1A] dark:text-purple-100",
      subTextColor: "text-[#1A1A1A]/60 dark:text-purple-200/60",
      buttonBg: "bg-[#FF6B9E] text-white shadow-sm",
      dayActive: "bg-white text-purple-700 w-12 h-12 shadow-sm",
      dayNormal: "text-[#1A1A1A]/60 w-9 h-9",
    },
    "not-fertile": {
      wrapperBg: "bg-gradient-to-b from-[#F0F9FF] to-[#B9E5FF] dark:from-blue-900/40 dark:to-blue-950/20",
      screenBg: "bg-background",
      textColor: "text-[#1A1A1A] dark:text-blue-100",
      subTextColor: "text-[#1A1A1A]/70 dark:text-blue-200/60",
      buttonBg: "bg-white text-[#0EA5E9] shadow-sm",
      dayActive: "bg-white text-[#0EA5E9] w-12 h-12 shadow-md",
      dayNormal: "text-[#1A1A1A]/70 w-9 h-9",
    },
    none: {
      wrapperBg: "bg-gradient-to-b from-[#FFF0F3] to-[#FDF2F4]",
      screenBg: "bg-background",
      textColor: "text-[#1A1A1A]",
      subTextColor: "text-[#1A1A1A]/60",
      buttonBg: "bg-[#FF6B9E] text-white shadow-sm",
      dayActive: "bg-white text-dc-pink-deep w-12 h-12 shadow-md",
      dayNormal: "text-[#1A1A1A]/60 w-9 h-9",
    },
  };

  // Defensive check for themeStyles
  const activeTheme = themeStyles[phase] || themeStyles.none;

  // Motion Variants for Staggered Entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 200 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`flex-1 overflow-y-auto pb-20 ${activeTheme.screenBg} transition-colors duration-500 scrollbar-hide`}
    >
      <motion.div 
        variants={itemVariants}
        className={`relative ${activeTheme.wrapperBg} rounded-b-[3.5rem] pb-12 transition-all duration-700`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <motion.button 
            onClick={onOpenProfile} 
            className="transition-transform"
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-dc-pink to-purple-400 rounded-full blur opacity-25" />
              <Avatar className="w-11 h-11 border-2 border-white shadow-md relative">
                <AvatarImage src={snehaAvatar} alt="Sneha" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-pink-50 to-pink-100 text-pink-300"><User size={22} /></AvatarFallback>
              </Avatar>
            </div>
          </motion.button>
          
          <div className="text-center relative">
            <motion.div 
              onClick={onOpenCalendar}
              className="px-5 py-2 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] inline-block cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              <h2 className="text-[14px] font-black tracking-tight text-foreground flex items-center gap-2">
                {todayDateStr} {monthName}
                <span className="opacity-30">|</span>
                <span className="opacity-60">{yearName !== currentYear ? yearName : format(selectedDate, "EEE")}</span>
              </h2>
            </motion.div>
            
            <AnimatePresence>
              {!isSelectedToday && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSelectDate(new Date())}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black text-white bg-dc-pink-deep px-3 py-1 rounded-full shadow-lg shadow-dc-pink/30 uppercase tracking-[0.15em] z-30"
                >
                  Today
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            onClick={onOpenCalendar}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/30 dark:bg-black/10 backdrop-blur-sm border border-white/40 shadow-sm"
            whileHover={{ scale: 1.1, rotate: 3, backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            whileTap={{ scale: 0.9 }}
          >
            <CalendarDays size={22} className="text-dc-pink-deep" />
          </motion.button>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-2 px-6 mt-4 mb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        >
          {calendarDays.map((d, i) => {
            const isTdy = isSameDay(d, today);
            const isSel = isSameDay(d, selectedDate);
            const dateStatus = getCyclePhaseForDate(d, getLastPeriodStartDate(sorted, d) || sorted[0] || d, cycleStats);
            const datePhase = dateStatus.phase;
            const dayOfWeek = daysOfWeekFull[d.getDay()];
            
            // Check if it's ovulation day (CD 14 or midpoint)
            const isOvulation = dateStatus.cycleDay === 14;
            
            let dayClass = activeTheme.dayNormal;
            let inlineStyle = {};

            if (isSel) {
              dayClass = "bg-white text-dc-pink-deep w-11 h-11 shadow-lg z-10 scale-110 border-none ring-2 ring-dc-pink-deep/20";
            } else if (isTdy) {
              dayClass = "bg-white/60 border border-white text-foreground w-10 h-10";
            } else if (datePhase === 'menstrual') {
              dayClass = "text-white w-10 h-10 font-bold";
              inlineStyle = { backgroundColor: `#FF6B9E`, borderRadius: '16px' };
            } else if (datePhase === 'fertile') {
              dayClass = "text-teal-900 w-10 h-10 font-bold";
              inlineStyle = { backgroundColor: `#88E5E5`, borderRadius: '16px' };
            } else if (datePhase === 'may-fertile') {
              dayClass = "text-purple-900 w-10 h-10 font-bold";
              inlineStyle = { backgroundColor: `#E2D1FF`, borderRadius: '16px' };
            } else {
              dayClass = "bg-white/30 text-muted-foreground w-10 h-10";
            }

            return (
              <motion.div 
                key={i} 
                data-active={isSel}
                className="flex flex-col items-center flex-shrink-0 snap-center min-w-[14.28%] relative"
                onClick={() => onSelectDate(d)}
                whileHover={{ y: -2 }}
              >
                <div className="h-4 flex items-center justify-center mb-1.5">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isSel ? 'text-dc-pink-deep opacity-100' : 'opacity-40'}`}>
                    {isTdy ? 'TODAY' : dayOfWeek[0]}
                  </span>
                </div>
                <motion.div 
                  className={`flex items-center justify-center rounded-2xl text-[15px] transition-all cursor-pointer ${dayClass}`}
                  style={inlineStyle}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-black">{d.getDate()}</span>
                  
                  {isOvulation && !isSel && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-dc-pink-deep rounded-full animate-pulse" />
                    </div>
                  )}
                </motion.div>
                {isSel && !isTdy && <motion.div layoutId="dot" className="w-1 h-1 rounded-full bg-dc-pink-deep mt-1" />}
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="text-center px-4 mt-8 mb-4"
          variants={itemVariants}
        >
          <p className={`text-[12px] font-black mb-1 opacity-70 uppercase tracking-widest ${activeTheme.textColor}`}>{labelText}</p>
          <motion.div className="relative inline-block mb-3">
            <motion.h1 
              className="text-[36px] sm:text-[48px] font-black mb-1 tracking-tighter leading-none"
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {daysCount}
            </motion.h1>
          </motion.div>
          <div className="flex items-center justify-center gap-1.5 mb-6 mt-2">
            <p className={`text-[13px] font-semibold opacity-70 ${activeTheme.subTextColor}`}>{subText}</p>
          </div>
          <motion.button 
            onClick={onOpenLog}
            className={`rounded-full px-10 py-3 text-[15px] font-bold shadow-lg shadow-black/5 hover:shadow-xl transition-all ${
              phase === "menstrual" 
                ? "bg-white text-[#FF4D8D]" 
                : "bg-white text-[#FF4D8D]"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            {phase === "menstrual" ? "Edit period dates" : "Log period"}
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div className="mt-4 px-5" variants={itemVariants}>
        <h3 className="font-black text-[15px] mb-4 tracking-tight flex items-center gap-1.5 transition-all">
          Daily insights <span className="text-muted-foreground font-black opacity-80">· {format(selectedDate, "dd MMM")}</span>
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">


          {/* Cycle Day Pin Card */}
          <motion.div
            className="flex-shrink-0 w-[100px] sm:w-[114px] h-[130px] sm:h-[142px] bg-[#E2D1FF] rounded-3xl flex flex-col items-center justify-center p-3 border-2 border-[#9370DB]/20 shadow-sm relative overflow-hidden"
            whileHover={{ y: -2 }}
          >
            <div className="dc-cycle-pin">
              <div className="text-[8px] font-black uppercase tracking-tighter mb-1 text-[#6A1B9A]">Cycle day</div>
              <div className="dc-cycle-pin-inner bg-white border-2 border-purple-200 text-[#1A1A1A]">
                {cycleDay}
              </div>
            </div>
          </motion.div>

          {[
            { title: "Mood & Energy", img: cardMoodEnergy },
            { title: "Mood Swings", img: cardMoodSwings },
            { title: "Discharge Guide", img: cardDischarge },
            { title: "Sleep Quality", img: cardSleep },
            { title: "Nutrition Tips", img: cardNutrition },
            { title: "Hydration", img: cardHydration },
            { title: "Mindfulness", img: cardMindfulness },
          ].map((card) => (
            <motion.div
              key={card.title}
              className="flex-shrink-0 w-[100px] sm:w-[114px] h-[130px] sm:h-[142px] rounded-3xl overflow-hidden relative shadow-sm border border-white/40 group active:scale-95 transition-all bg-white"
              whileHover={{ scale: 1.02 }}
            >
              <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <p className="absolute bottom-2.5 left-3 right-3 text-[10px] font-black text-white leading-tight z-10 uppercase tracking-tighter drop-shadow-md">{card.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className="mt-4 mx-5" variants={itemVariants}>
        <motion.div
          className="dc-glass-strong rounded-[2rem] p-6 border border-white/40 shadow-sm relative overflow-hidden"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
        >
          {/* Dynamic Background Hint */}
          <div className={`absolute inset-0 opacity-[0.03] ${activeTheme.wrapperBg}`} />

          {(() => {
            const lastPeriodBeforeSelected = getLastPeriodStartDate(sorted, selectedDate);
            const nextPeriodAfterSelected = lastPeriodBeforeSelected ? addDays(lastPeriodBeforeSelected, avgCycleLength) : null;
            const daysToNext = nextPeriodAfterSelected ? differenceInCalendarDays(nextPeriodAfterSelected, today) : null;

            // Phase based iconography colors
            const iconPlateBg = phase === 'menstrual' ? 'bg-[#FF6B9E]/10' : 
                               phase === 'fertile' ? 'bg-teal-100' : 'bg-purple-100';
            const iconColor = phase === 'menstrual' ? 'text-[#FF6B9E]' : 
                             phase === 'fertile' ? 'text-teal-600' : 'text-purple-600';

            return (
              <div className="relative z-10">
                <h3 className="font-black text-lg mb-5 tracking-tight text-foreground/90">Cycle Summary</h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Next Period Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenLog}
                    className="bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-[1.25rem] p-3.5 flex items-center gap-2.5 border border-white/40 dark:border-white/10 shadow-sm shadow-dc-pink/5 cursor-pointer min-w-0"
                  >
                    <div className={`w-8 h-8 rounded-full ${iconPlateBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                      <CalendarDays size={16} className={`${iconColor} transition-colors duration-500`} />
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 truncate">Next Period</span>
                      <span className="text-[13px] font-black text-foreground leading-tight truncate">
                        {nextPeriodAfterSelected ? format(nextPeriodAfterSelected, "MMM dd") : "--"}
                      </span>
                      <span className="text-[8px] font-bold text-[#F06292] truncate opacity-90">
                        {daysToNext !== null 
                          ? (daysToNext === 0 
                              ? "may start today" 
                              : (daysToNext > 0 ? `in ${daysToNext} days` : `${Math.abs(daysToNext)} days ago`))
                          : "--"}
                      </span>
                    </div>
                  </motion.div>

                  {/* Cycle Day Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenCalendar}
                    className="bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-[1.25rem] p-3.5 flex items-center gap-2.5 border border-white/40 dark:border-white/10 shadow-sm shadow-dc-pink/5 cursor-pointer min-w-0"
                  >
                    <div className={`w-8 h-8 rounded-full ${iconPlateBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                      <Clock size={16} className={`${iconColor} transition-colors duration-500`} />
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 truncate">Cycle Day</span>
                      <span className="text-[13px] font-black text-foreground leading-tight truncate">{cycleDay > 0 ? cycleDay : "--"}</span>
                    </div>
                  </motion.div>

                  {/* Last Period Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenLog}
                    className="bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-[1.25rem] p-3.5 flex items-center gap-2.5 border border-white/40 dark:border-white/10 shadow-sm shadow-dc-pink/5 cursor-pointer min-w-0"
                  >
                    <div className={`w-8 h-8 rounded-full ${iconPlateBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                      <Calendar size={15} className={`${iconColor} transition-colors duration-500`} />
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 truncate">Last Period</span>
                      <p className="text-[13px] font-black text-foreground leading-tight truncate">
                        {lastPeriodBeforeSelected ? format(lastPeriodBeforeSelected, "MMM dd") : "--"}
                      </p>
                    </div>
                  </motion.div>

                  {/* Cycle Length Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenCalendar}
                    className="bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-[1.25rem] p-3.5 flex items-center gap-2.5 border border-white/40 dark:border-white/10 shadow-sm shadow-dc-pink/5 cursor-pointer min-w-0"
                  >
                    <div className={`w-8 h-8 rounded-full ${iconPlateBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                      <TrendingUp size={15} className={`${iconColor} transition-colors duration-500`} />
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 truncate">Cycle Length</span>
                      <span className="text-[13px] font-black text-foreground leading-tight truncate">{avgCycleLength} days</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </motion.div>


      {/* Upcoming Predictions Section */}
      <motion.div className="mt-4 mx-5" variants={itemVariants}>
        <motion.div
          className="dc-glass-strong rounded-[2rem] p-6 border border-white/40 shadow-sm relative overflow-hidden"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
        >
          {(() => {
            const mLen = currentAvgPeriod;
            const cycleLen = avgCycleLength;
            // Ovulation is at cycleLen - 13 (Day 15 in 28-day cycle)
            // Fertile window is from Ovulation - 5 to Ovulation + 1
            const ovulationDay = cycleLen - 13;
            const fertileStart = ovulationDay - 5;
            const fertileEnd = ovulationDay + 1;

            const phasesData = [
              { name: "Menstrual", value: mLen, color: "#FF6B9E", start: 1 },
              { name: "Follicular", value: fertileStart - mLen - 1, color: "#B9E5FF", start: mLen + 1 },
              { name: "Fertile", value: fertileEnd - fertileStart + 1, color: "#C0EBA6", start: fertileStart },
              { name: "Luteal", value: cycleLen - fertileEnd, color: "#E2D1FF", start: fertileEnd + 1 },
            ];

            const currentPhaseIdx = phasesData.findIndex(p => cycleDay >= p.start && (p.start + p.value > cycleDay));
            const nextPhaseIdx = (currentPhaseIdx + 1) % 4;
            const nextPhase = phasesData[nextPhaseIdx];
            const daysToNext = nextPhase.start > cycleDay ? nextPhase.start - cycleDay : (avgCycleLength - cycleDay + nextPhase.start);

            return (
              <div className="relative z-10">
                <h3 className="font-black text-lg mb-5 tracking-tight text-foreground/90">Upcoming Predictions</h3>
                
                <div className="flex items-center gap-6">
                  {/* Left: Donut Chart */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={phasesData}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {phasesData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              opacity={index === currentPhaseIdx ? 1 : 0.6}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black leading-none">4</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Phases</span>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed mb-4">
                      Your cycle is expected to transition into the <span className="text-foreground">{nextPhase.name}</span> phase in <span className="text-dc-pink-deep">{daysToNext} days</span>.
                    </p>
                    
                    <div className="space-y-2.5">
                      {phasesData.map((item, idx) => {
                        const isCurrent = idx === currentPhaseIdx;
                        const daysAway = item.start > cycleDay ? item.start - cycleDay : (avgCycleLength - cycleDay + item.start);
                        
                        return (
                          <div key={item.name} className="flex items-center justify-between gap-2">
                             <div className="flex items-center gap-2">
                               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                               <span className={`text-xs ${isCurrent ? 'font-black' : 'font-bold text-muted-foreground/80'}`}>{item.name}</span>
                             </div>
                             <span className={`text-[10px] font-black ${isCurrent ? 'text-dc-pink-deep bg-dc-pink/10 px-2 py-0.5 rounded-full' : 'text-muted-foreground/60'}`}>
                               {isCurrent ? 'Current' : `In ${daysAway} Days`}
                             </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </motion.div>

      <motion.div className="mt-4 px-5" variants={itemVariants}>
        <DailyWellnessLog 
          date={selectedDate}
          onOpenHistory={onOpenHistory}
          onSave={(data) => {
            const dateKey = format(selectedDate, "yyyy-MM-dd");
            setDailyLogs(prev => ({ ...prev, [dateKey]: data }));
            
            // Sync with period dates
            if (data.periodStatus !== 'no-period') {
              setPeriodDates(prev => prev.some(d => isSameDay(d, selectedDate)) ? prev : [...prev, selectedDate]);
            } else {
              setPeriodDates(prev => prev.filter(d => !isSameDay(d, selectedDate)));
            }
            
            toast.success("Wellness log saved! ✨");
          }}
          onUpdate={(data) => {
            const dateKey = format(selectedDate, "yyyy-MM-dd");
            setDailyLogs(prev => ({ ...prev, [dateKey]: data }));
            
            // Sync with period dates
            if (data.periodStatus !== 'no-period') {
              setPeriodDates(prev => prev.some(d => isSameDay(d, selectedDate)) ? prev : [...prev, selectedDate]);
            } else {
              setPeriodDates(prev => prev.filter(d => !isSameDay(d, selectedDate)));
            }
            
            toast.success("Wellness log updated! ✨");
          }}
          onDelete={() => {
            const dateKey = format(selectedDate, "yyyy-MM-dd");
            setDailyLogs(prev => {
              const next = { ...prev };
              delete next[dateKey];
              return next;
            });
            
            // Also remove from period dates if deleted
            setPeriodDates(prev => prev.filter(d => !isSameDay(d, selectedDate)));
            
            toast.success("Wellness log deleted");
          }}
        />
      </motion.div>


      <motion.div className="mt-4 mx-5 mb-1 pb-0" variants={itemVariants}>
        <motion.div
          className="dc-glass-strong rounded-2xl p-5 border border-white/20 shadow-sm"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base tracking-tight">Cycle History & Milestones</h3>
            <Clock size={16} className="text-muted-foreground opacity-60" />
          </div>

          <div className="px-5 pt-2 pb-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Upcoming milestones</p>
            
            {(() => {
              const lastStart = getLastPeriodStartDate(sorted, selectedDate);
              if (!lastStart) return <p className="text-xs text-muted-foreground italic">Log a period to see predictions</p>;
              
              const nextStart = addDays(lastStart, avgCycleLength);
              const ovulationDay = addDays(nextStart, -14);
              const fertileStart = addDays(ovulationDay, -5);
              const fertileEnd = addDays(ovulationDay, 1);

              return (
                <>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFB9C5]/10 border border-[#FFB9C5]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFB9C5] flex items-center justify-center shadow-sm">
                        <span className="text-xs">🩸</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">Next Period</p>
                        <p className="text-[10px] text-muted-foreground">Predicted start</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#880E4F]">{format(nextStart, "MMM dd")}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#C0EBA6]/10 border border-[#C0EBA6]/20 mt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C0EBA6] flex items-center justify-center shadow-sm">
                        <span className="text-xs">🥚</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">Ovulation Day</p>
                        <p className="text-[10px] text-muted-foreground">High fertility</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-green-800">{format(ovulationDay, "MMM dd")}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E2D1FF]/10 border border-[#E2D1FF]/20 mt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E2D1FF] flex items-center justify-center shadow-sm">
                        <span className="text-xs">✨</span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">Fertile Window</p>
                        <p className="text-[10px] text-muted-foreground">Best for conception</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#6A1B9A]">{format(fertileStart, "MMM d")} - {format(fertileEnd, "d")}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const PlaceholderSection = ({ title }: { title: string }) => (
  <div className="flex-1 flex items-center justify-center pb-24">
    <div className="text-center">
      <h2 className="dc-heading text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">Coming soon ✨</p>
    </div>
  </div>
);

const NAV_ITEMS = [
  { icon: CalendarDays, label: "Today" },
  { icon: Lightbulb, label: "Insights" },
  { icon: Heart, label: "Health Tips" },
  { icon: MessageCircle, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

const Dashboard = ({ 
  userData, 
  initialPeriodDates = [],
  onLogout,
  setBackHandler
}: { 
  userData: { name: string; email: string }; 
  initialPeriodDates?: Date[];
  onLogout: () => void;
  setBackHandler: (handler: () => boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState("Today");
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showSymptomsView, setShowSymptomsView] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  
  // Custom states for cycle calculations
  const [periodDates, setPeriodDates] = useState<Date[]>(() => {
    if (initialPeriodDates && initialPeriodDates.length > 0) return initialPeriodDates;
    const saved = localStorage.getItem("dc_period_dates");
    if (saved && saved !== "[]" && saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((d: string) => new Date(d));
      } catch (e) { 
        console.error("Error loading dates", e); 
      }
    }
    
    // Seed data: March 10 (Last) and April 8 (Current)
    const seed = [
      new Date(2026, 2, 10), new Date(2026, 2, 11), new Date(2026, 2, 12), new Date(2026, 2, 13), new Date(2026, 2, 14), // Mar 10-14
      new Date(2026, 3, 8)// April 8
    ];
    return seed;
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLogMode, setIsLogMode] = useState(false);

  const sorted = useMemo(
    () => [...periodDates].sort((a, b) => a.getTime() - b.getTime()),
    [periodDates]
  );

  const cycles = useMemo(() => {
    const periodStarts = getPeriodBlocks(sorted);
    if (periodStarts.length < 2) return [];
    
    const result: { start: Date; length: number }[] = [];
    for (let i = 1; i < periodStarts.length; i++) {
      // Access the start date of each block (index 0)
      const len = differenceInCalendarDays(periodStarts[i][0], periodStarts[i - 1][0]);
      // Standard human cycle length is usually between 21 and 35 days, 
      // but let's allow a wider range for irregular cycles.
      if (len > 15 && len < 60) {
        result.push({ start: periodStarts[i - 1][0], length: len });
      }
    }
    return result;
  }, [sorted]);

  const cycleStats = useMemo(() => getCycleStats(periodDates), [periodDates]);
  const avgCycleLength = cycleStats.avg;
  const currentAvgPeriod = useMemo(() => getAvgPeriodDuration(periodDates), [periodDates]);

  const cycleVariation = useMemo(() => {
    if (cycles.length < 2) return null;
    const min = Math.min(...cycles.map((c) => c.length));
    const max = Math.max(...cycles.map((c) => c.length));
    return { min, max };
  }, [cycles]);

  const hasData = sorted.length >= 2 && cycles.length > 0;
  const [pillReminder, setPillReminder] = useState(() => {
    const saved = localStorage.getItem("dc_pill_reminder");
    return saved ? JSON.parse(saved) : {
      enabled: false,
      time: "09:00",
      pillName: "Birth Control",
    };
  });

  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem("dc_notification_settings");
    return saved ? JSON.parse(saved) : {
      time: "08:30",
      lastNotified: {
        period: "",
        fertile: "",
        insight: ""
      }
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("dc_notification_toggles");
    return saved ? JSON.parse(saved) : {
      periodReminder: true,
      fertileWindow: true,
      dailyInsights: true,
    };
  });

  const [partnerSync, setPartnerSync] = useState(() => {
    const saved = localStorage.getItem("dc_partner_sync");
    return saved ? JSON.parse(saved) : {
      enabled: false,
      partnerName: "",
      partnerEmail: "",
      syncCode: "DC-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: "disconnected", // 'disconnected', 'pending', 'connected'
      inviteSentAt: null,
      lastSynced: null,
      shareSymptoms: true,
      shareMood: true,
      shareCycle: true,
      shareNotifications: false,
    };
  });

  const [lastPillNotifiedDay, setLastPillNotifiedDay] = useState<string>(() => {
    return localStorage.getItem("dc_last_pill_notified_day") || "";
  });

  useEffect(() => {
    localStorage.setItem("dc_last_pill_notified_day", lastPillNotifiedDay);
  }, [lastPillNotifiedDay]);

  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLogEntry>>(() => {
    const saved = localStorage.getItem("dc_daily_logs");
    if (saved && saved !== "{}") return JSON.parse(saved);

    // Initial Seed Data for Demo (April 8 - April 12)
    return {
      "2026-04-08": { mood: "happy", symptoms: ["cramps"], notes: "Starting my period today. Feeling a bit of cramps but overall positive about the new month.", hashtags: "periodstart,newbeginnings", periodStatus: "light-flow" },
      "2026-04-09": { mood: "neutral", symptoms: ["cramps", "fatigue"], notes: "Second day, flow is a bit heavier. Spending the day reading and resting.", hashtags: "selfcare,resting", periodStatus: "medium-flow" },
      "2026-04-10": { mood: "irritable", symptoms: ["bloating"], notes: "Hormones are hitting hard today. A bit snappy, sorry to anyone I talked to!", hashtags: "moody,bloating", periodStatus: "heavy-flow" },
      "2026-04-11": { mood: "energetic", symptoms: [], notes: "Flow is much lighter today and my energy is finally back! 🌟", hashtags: "feelinggood,energy", periodStatus: "light-flow" },
      "2026-04-12": { mood: "calm", symptoms: [], notes: "Period ended. Feeling balanced and ready for the week ahead.", hashtags: "calm,balanced", periodStatus: "no-period" }
    };
  });

  const hasInitialized = useRef(false);

  // ======== SUPABASE DATA SYNC ========
  // Load data from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        hasInitialized.current = true;
        return;
      }
      const uid = session.user.id;

      // Load period dates
      const { data: pdRows } = await supabase.from('period_dates').select('date').eq('user_id', uid);
      if (pdRows && pdRows.length > 0) {
        const dates = pdRows.map((r: { date: string }) => new Date(r.date + 'T00:00:00'));
        setPeriodDates(dates);
      } else {
        // New user: don't seed fake data, start clean
        setPeriodDates([]);
      }

      // Load daily logs
      const { data: dlRows } = await supabase.from('daily_logs').select('*').eq('user_id', uid);
      if (dlRows && dlRows.length > 0) {
        const logs: Record<string, DailyLogEntry> = {};
        dlRows.forEach((r: { log_date: string, symptoms?: string[], mood?: string, notes?: string, hashtags?: string, period_status?: string }) => {
          logs[r.log_date] = { 
            symptoms: r.symptoms || [], 
            mood: r.mood || '', 
            notes: r.notes || '',
            hashtags: r.hashtags || '',
            periodStatus: r.period_status || 'no-period'
          };
        });
        setDailyLogs(logs);
      }

      // Load settings
      const { data: settings } = await supabase.from('user_settings').select('*').eq('id', uid).single();
      if (settings) {
        setPillReminder({ enabled: settings.pill_enabled, time: settings.pill_time, pillName: settings.pill_name });
        setNotifications({ periodReminder: settings.notif_period, fertileWindow: settings.notif_fertile, dailyInsights: settings.notif_insights });
        setNotificationSettings(prev => ({ ...prev, time: settings.notif_time }));
      }

      // Load partner sync
      const { data: ps } = await supabase.from('partner_sync').select('*').eq('id', uid).single();
      if (ps) {
        setPartnerSync({
          enabled: ps.enabled, partnerName: ps.partner_name, partnerEmail: ps.partner_email,
          syncCode: ps.sync_code, status: ps.status,
          inviteSentAt: ps.invite_sent_at, lastSynced: ps.last_synced_at,
          shareSymptoms: ps.share_symptoms, shareMood: ps.share_mood,
          shareCycle: ps.share_cycle, shareNotifications: ps.share_notifications,
        });
      }

      // Delay flag so React can batch the state updates above before saves fire
      setTimeout(() => { hasInitialized.current = true; }, 500);
    };
    loadFromSupabase();
  }, []);

  // Helper: get current user id
  const getUserId = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id;
  }, []);

  // Auto-save period dates to localStorage + Supabase
  useEffect(() => {
    localStorage.setItem("dc_period_dates", JSON.stringify(periodDates));
    if (!hasInitialized.current) return;
    const syncPeriodDates = async () => {
      const uid = await getUserId();
      if (!uid) return;
      // Delete all and re-insert (simplest sync for date arrays)
      const rows = periodDates.map(d => ({
        user_id: uid,
        date: formatDateToYYYYMMDD(d)
      }));
      
      if (rows.length > 0) {
        // Use upsert to avoid issues with duplicates, but we still need to handle removals
        // Actually, for period dates, a full delete+insert is sometimes safer if the array is small,
        // but let's at least fix the date format first.
        await supabase.from('period_dates').delete().eq('user_id', uid);
        await supabase.from('period_dates').insert(rows);
      } else {
        await supabase.from('period_dates').delete().eq('user_id', uid);
      }
    };
    syncPeriodDates();
  }, [periodDates, getUserId]);

  // Auto-save daily logs
  useEffect(() => {
    localStorage.setItem("dc_daily_logs", JSON.stringify(dailyLogs));
    if (!hasInitialized.current) return;
    const syncDailyLogs = async () => {
      const uid = await getUserId();
      if (!uid) return;
      
      const rows = Object.entries(dailyLogs).map(([dateKey, log]) => ({
        user_id: uid, 
        log_date: dateKey,
        mood: log.mood || '', 
        symptoms: log.symptoms || [], 
        notes: log.notes || '',
        hashtags: log.hashtags || '',
        period_status: log.periodStatus || 'no-period',
        updated_at: new Date().toISOString()
      }));

      if (rows.length > 0) {
        const { error } = await supabase.from('daily_logs').upsert(rows, { onConflict: 'user_id,log_date' });
        if (error) {
          console.error("Daily log sync error:", error);
        }
      }
    };
    syncDailyLogs();
  }, [dailyLogs, getUserId]);

  // Auto-save notification settings
  useEffect(() => {
    localStorage.setItem("dc_notification_settings", JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem("dc_notification_toggles", JSON.stringify(notifications));
  }, [notifications]);

  // Auto-save settings to Supabase
  useEffect(() => {
    localStorage.setItem("dc_pill_reminder", JSON.stringify(pillReminder));
    if (!hasInitialized.current) return;
    const syncSettings = async () => {
      const uid = await getUserId();
      if (!uid) return;
      await supabase.from('user_settings').upsert({
        id: uid,
        pill_enabled: pillReminder.enabled, pill_time: pillReminder.time, pill_name: pillReminder.pillName,
        notif_period: notifications.periodReminder, notif_fertile: notifications.fertileWindow,
        notif_insights: notifications.dailyInsights, notif_time: notificationSettings.time,
        updated_at: new Date().toISOString()
      });
    };
    syncSettings();
  }, [pillReminder, notifications, notificationSettings, getUserId]);

  // Auto-save partner sync
  useEffect(() => {
    localStorage.setItem("dc_partner_sync", JSON.stringify(partnerSync));
    if (!hasInitialized.current) return;
    const syncPartner = async () => {
      const uid = await getUserId();
      if (!uid) return;
      await supabase.from('partner_sync').upsert({
        id: uid,
        enabled: partnerSync.enabled,
        partner_name: partnerSync.partnerName, partner_email: partnerSync.partnerEmail,
        sync_code: partnerSync.syncCode, status: partnerSync.status,
        share_symptoms: partnerSync.shareSymptoms, share_mood: partnerSync.shareMood,
        share_cycle: partnerSync.shareCycle, share_notifications: partnerSync.shareNotifications,
        updated_at: new Date().toISOString()
      });
    };
    syncPartner();
  }, [partnerSync, getUserId]);

  // Unified Notification Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHmm = format(now, "HH:mm");
      const todayStr = format(now, "yyyy-MM-dd");

      // 1. Pill Reminder logic (Pop-up at top)
      if (pillReminder.enabled && currentHHmm === pillReminder.time && lastPillNotifiedDay !== todayStr) {
        toast.success(`Pill Reminder: ${pillReminder.pillName} 💊`, {
          description: `It's ${pillReminder.time}. Time to take your daily dose! ✨`,
          duration: 15000,
          position: "top-center",
          action: {
            label: "TAKEN",
            onClick: () => {
              setLastPillNotifiedDay(todayStr);
              toast.success("Great! Habit tracked. ✅");
            }
          },
          icon: <Pill size={20} className="text-purple-500" />
        });
        setLastPillNotifiedDay(todayStr);
      }

      // 2. Cycle & Insight Notifications logic
      if (currentHHmm === notificationSettings.time) {
        // Daily Insights
        if (notifications.dailyInsights && notificationSettings.lastNotified.insight !== todayStr) {
          const tips = [
            "Staying hydrated can help reduce bloat during your cycle! 💧",
            "Try some light yoga today to ease any tension. 🧘‍♀️",
            "Iron-rich foods like spinach are great for this phase! 🥗",
            "A warm bath can mirror the body's natural cooling for better sleep. 🛁"
          ];
          const randomTip = tips[Math.floor(Math.random() * tips.length)];
          toast.info("Daily Wellness Insight ✨", {
            description: randomTip,
            duration: 8000,
            icon: <Lightbulb size={18} className="text-amber-500" />
          });
          setNotificationSettings(p => ({ 
            ...p, 
            lastNotified: { ...p.lastNotified, insight: todayStr } 
          }));
        }

        // Period & Fertile alerts
        if (sorted.length > 0) {
          const lastPeriod = sorted[sorted.length - 1];
          const daysSinceLast = differenceInCalendarDays(now, lastPeriod);
          const cycleDay = ((daysSinceLast % avgCycleLength) + avgCycleLength) % avgCycleLength + 1;
          
          const mLen = currentAvgPeriod;
          const cycleLen = avgCycleLength;
          const ovulationDay = cycleLen - 13;
          const fertileDayStart = ovulationDay - 5;

          // Period Reminder (2 days before predicted start)
          const daysUntilPeriod = avgCycleLength - (daysSinceLast % avgCycleLength);
          if (notifications.periodReminder && daysUntilPeriod <= 2 && daysUntilPeriod > 0 && notificationSettings.lastNotified.period !== todayStr) {
            toast.error("Period Reminder 🩸", {
              description: daysUntilPeriod === 1 ? "Your period is expected tomorrow. Stay prepared!" : "Your period is expected in 2 days. Get ready!",
              duration: 10000,
              icon: <Calendar size={18} />
            });
            setNotificationSettings(p => ({ 
              ...p, 
              lastNotified: { ...p.lastNotified, period: todayStr } 
            }));
          }

          // Fertile Window Alert (on the first day)
          if (notifications.fertileWindow && cycleDay === fertileDayStart && notificationSettings.lastNotified.fertile !== todayStr) {
            toast.success("Fertility Alert 💖", {
              description: "You've entered your fertile window. Chances of conception are higher!",
              duration: 10000,
              icon: <Heart size={18} className="fill-dc-pink-deep text-dc-pink-deep" />
            });
            setNotificationSettings(p => ({ 
              ...p, 
              lastNotified: { ...p.lastNotified, fertile: todayStr } 
            }));
          }
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [pillReminder, lastPillNotifiedDay, notificationSettings, notifications, sorted, avgCycleLength, currentAvgPeriod]);

  const togglePeriodDate = (date: Date) => {
    setPeriodDates((prev) =>
      prev.some((d) => isSameDay(d, date))
        ? prev.filter((d) => !isSameDay(d, date))
        : [...prev, date]
    );
  };

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      // If we go back to "Today", clear history to keep it as the root
      if (tab === "Today") {
        setTabHistory([]);
      } else {
        setTabHistory(prev => {
          // Keep only the last 5 unique tab changes to avoid long loops
          const newHistory = [...prev, activeTab].slice(-5);
          return newHistory;
        });
      }
      setActiveTab(tab);
    }
  };

  const handleBack = useCallback(() => {
    if (calendarOpen) {
      setCalendarOpen(false);
      return true;
    }
    if (showSymptomsView) {
      setShowSymptomsView(false);
      return true;
    }
    if (showHistoryView) {
      setShowHistoryView(false);
      return true;
    }
    
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTab(prevTab);
      return true;
    }

    // If we are not on the main dashboard tab (Today), go back to it
    if (activeTab !== "Today") {
      setActiveTab("Today");
      setTabHistory([]);
      return true;
    }

    return false; // Let parent handle it (exit or go back to onboarding)
  }, [calendarOpen, showSymptomsView, showHistoryView, tabHistory, activeTab]);

  // Pass the back handler to the parent
  useEffect(() => {
    setBackHandler(handleBack);
  }, [handleBack, setBackHandler]);

  return (
    <div className="h-full relative bg-background dc-gradient-warm flex flex-col transition-colors duration-500 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="flex-1 h-full flex flex-col overflow-hidden relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Today" && (
            showSymptomsView ? (
              <SymptomsLogPage 
                onBack={() => setShowSymptomsView(false)}
                onSave={(data) => {
                  const dateKey = format(selectedDate, "yyyy-MM-dd");
                  setDailyLogs(prev => ({ ...prev, [dateKey]: data }));
                  toast.success("Wellness log saved! ✨");
                  setShowSymptomsView(false);
                }}
                initialData={dailyLogs[format(selectedDate, "yyyy-MM-dd")]}
                dateFormatted={`${format(selectedDate, "dd MMMM")}`}
              />
            ) : ( showHistoryView ? (
              <WellnessHistory 
                onBack={() => setShowHistoryView(false)}
                logs={dailyLogs}
                onDeleteLog={(key) => {
                  setDailyLogs(prev => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                  });
                  toast.success("Log removed! \u2728");
                }}
              />
            ) : (
              <TodaySection 
                onOpenCalendar={() => setCalendarOpen(true)} 
                onOpenProfile={() => setActiveTab("Settings")}
                periodDates={periodDates} 
                sorted={sorted}
                cycles={cycles}
                avgCycleLength={avgCycleLength}
                cycleStats={cycleStats}
                cycleVariation={cycleVariation}
                hasData={hasData}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onOpenLog={() => {
                  setIsLogMode(true);
                  setCalendarOpen(true);
                }}
                onOpenSymptomsLog={() => setShowSymptomsView(true)}
                dailyLogs={dailyLogs}
                currentAvgPeriod={currentAvgPeriod}
                onOpenHistory={() => setShowHistoryView(true)}
                setDailyLogs={setDailyLogs}
                setPeriodDates={setPeriodDates}
              />
            ))
          )}
          {activeTab === "Insights" && <InsightsSection periodDates={periodDates} onOpenProfile={() => handleTabChange("Settings")} />}
          {activeTab === "Health Tips" && <HealthTipsSection onOpenProfile={() => handleTabChange("Settings")} />}
          {activeTab === "Messages" && <MessagesSection onOpenProfile={() => handleTabChange("Settings")} />}
          {activeTab === "Settings" && (
            <SettingsSection 
              userData={userData} 
              pillReminder={pillReminder}
              setPillReminder={setPillReminder}
              notifications={notifications}
              setNotifications={setNotifications}
              notificationSettings={notificationSettings}
              setNotificationSettings={setNotificationSettings}
              partnerSync={partnerSync}
              setPartnerSync={setPartnerSync}
              onLogout={onLogout}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <PeriodCalendar
        open={calendarOpen}
        onClose={() => {
          setCalendarOpen(false);
          setIsLogMode(false);
        }}
        isLogMode={isLogMode}
        onSave={(dates) => {
          setPeriodDates(dates);
          
          // Auto-focus on the latest period start date with defensive checks
          if (dates && dates.length > 0) {
            const blocks = getPeriodBlocks(dates);
            if (blocks && blocks.length > 0) {
              const latestBlock = blocks[blocks.length - 1];
              const latestStart = latestBlock[0];
              
              // Only update if we have a valid Date object
              if (latestStart instanceof Date && !isNaN(latestStart.getTime())) {
                setSelectedDate(latestStart);
              }
            }
          }
          
          setCalendarOpen(false);
          setIsLogMode(false);
          toast.success("Period dates updated! \u2728");
        }}
        periodDates={periodDates}
        onTogglePeriodDate={togglePeriodDate}
        avgCycleLength={avgCycleLength}
        cycleStats={cycleStats}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Bottom Navigation */}
      {!showSymptomsView && (
        <div className="absolute bottom-0 left-0 right-0 dc-glass-strong border-t border-white/30 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="max-w-[480px] mx-auto flex justify-around py-2.5 px-2">
            {NAV_ITEMS.map(({ icon: Icon, label }) => {
              const isActive = activeTab === label;
              return (
                <button
                  key={label}
                  onClick={() => handleTabChange(label)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                    isActive ? "text-dc-pink-deep" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className={`text-[9px] ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
                  {isActive && (
                    <motion.div
                      className="w-1 h-1 rounded-full bg-dc-pink-deep"
                      layoutId="navDot"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
