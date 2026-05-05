import { addDays, differenceInCalendarDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export type CyclePhase = "menstrual" | "may-fertile" | "fertile" | "not-fertile" | "none";

export interface CycleInfo {
  phase: CyclePhase;
  cycleDay: number;
  chanceOfPregnancy: "High" | "Low";
  color: string;
  label: string;
}

export const PHASE_COLORS = {
  menstrual: "#FF6B9E",   // Vibrant Rose (from image)
  "may-fertile": "#E2D1FF", // Lavender (from image)
  fertile: "#C0EBA6",     // Soft Green (from image)
  "not-fertile": "#B9E5FF", // Sky Blue (from image)
  none: "transparent",
};

export const PHASE_LABELS = {
  menstrual: "Menstrual Phase",
  "may-fertile": "May Fertile",
  fertile: "Fertile Window",
  "not-fertile": "Not Fertile",
  none: "No Data",
};

/**
 * Calculates the average period duration from logged blocks.
 */
export const getAvgPeriodDuration = (dates: Date[]): number => {
  const blocks = getPeriodBlocks(dates);
  if (blocks.length === 0) return 5;
  const sum = blocks.reduce((acc, block) => acc + block.length, 0);
  return Math.round(sum / blocks.length) || 5;
};

/**
 * Calculates the cycle phase for a specific date using logic aligned with the reference image and Java code.
 */
export const getCyclePhaseForDate = (
  date: Date,
  lastPeriodStartDate: Date,
  cycleStats: { avg: number; min: number; max: number } = { avg: 28, min: 28, max: 28 },
  avgPeriodDuration: number = 5
): { 
  phase: CyclePhase; 
  cycleDay: number; 
  daysUntilOvulation: number; 
  daysUntilPeriod: number;
  fertilityStatus: "low" | "high" | "medium";
} => {
  const { avg, min, max } = cycleStats;
  const diff = differenceInCalendarDays(date, lastPeriodStartDate);
  const cycleDay = ((diff % avg) + avg) % avg + 1;

  // Ogino-Knaus Logic:
  // Fertile Start Day = minCycleLength - 18
  // Fertile End Day = maxCycleLength - 11
  
  const fertileStart = Math.max(avgPeriodDuration + 1, min - 18);
  const fertileEnd = max - 11;
  const ovulationDay = Math.round((fertileStart + fertileEnd) / 2);
  
  // Transition (May Fertile) begins 2 days before fertile window
  const transitionStart = fertileStart - 2;
  
  let phase: CyclePhase = "not-fertile";
  let fertilityStatus: "low" | "high" | "medium" = "low";

  // Menstrual: 1 to avgPeriodDuration
  if (cycleDay >= 1 && cycleDay <= avgPeriodDuration) {
    phase = "menstrual";
    fertilityStatus = "low";
  } 
  // Fertile Window
  else if (cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    phase = "fertile";
    fertilityStatus = "high";
  }
  // Transition Window
  else if (cycleDay >= transitionStart && cycleDay < fertileStart) {
    phase = "may-fertile";
    fertilityStatus = "medium";
  }

  // Calculate days until milestones
  let daysUntilOvulation = 0;
  if (cycleDay < ovulationDay) {
    daysUntilOvulation = ovulationDay - cycleDay;
  } else if (cycleDay === ovulationDay) {
    daysUntilOvulation = 0;
  } else {
    daysUntilOvulation = (avg - cycleDay) + ovulationDay;
  }

  const daysUntilPeriod = avg - cycleDay + 1;

  return {
    phase,
    cycleDay,
    daysUntilOvulation,
    daysUntilPeriod,
    fertilityStatus
  };
};

/**
 * Generates predictions for the next 3 months.
 */
export const getPredictionsForMonths = (
  lastPeriodStartDate: Date,
  averageCycleLength: number = 28,
  periodDuration: number = 5,
  monthsCount: number = 3
) => {
  const predictions = [];
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(addDays(startDate, monthsCount * 30));
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(date => ({
    date: format(date, "yyyy-MM-dd"),
    ...getCyclePhaseForDate(date, lastPeriodStartDate, { avg: averageCycleLength, min: averageCycleLength, max: averageCycleLength })
  }));
};

/**
 * Shifts subsequent predictions when a user overrides a period date.
 * This is a simplified version that returns the new start date.
 */
export const editPeriodDates = (newDate: Date) => {
  return newDate;
};

/**
 * Finds the start date of the contiguous period block that ends at or just before targetDate.
 * This is crucial for cycle calculations because a user may log multiple days for one period.
 */
export const getLastPeriodStartDate = (dates: Date[], targetDate: Date): Date | null => {
  if (!dates.length) return null;
  
  // Sort dates descending
  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
  
  // Find the latest date that is <= targetDate
  const latestRelevant = sorted.find(d => d.getTime() <= targetDate.getTime());
  if (!latestRelevant) return null;

  let current = latestRelevant;
  while (true) {
    const prevDay = addDays(current, -1);
    const hasPrev = dates.some(d => isSameDay(d, prevDay));
    if (hasPrev) {
      current = prevDay;
    } else {
      break;
    }
  }
  
  return current;
};

/**
 * Groups individual logged dates into contiguous period blocks (Date[][]).
 * This allows us to track the duration and end date of each period.
 */
export const getPeriodBlocks = (dates: Date[]): Date[][] => {
  if (!dates.length) return [];
  
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const blocks: Date[][] = [];
  let currentBlock: Date[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(sorted[i], sorted[i - 1]);
    // If the difference is 1 day, it belongs to the same block
    if (diff === 1) {
      currentBlock.push(sorted[i]);
    } else {
      // Gap detected, finalize current block and start a new one
      blocks.push(currentBlock);
      currentBlock = [sorted[i]];
    }
  }
  blocks.push(currentBlock);
  return blocks;
};

/**
 * Calculates cycle statistics from provided period dates.
 * Returns the average, minimum (shortest), and maximum (longest) cycle lengths.
 */
export const getCycleStats = (dates: Date[], n: number = 6) => {
  const blocks = getPeriodBlocks(dates);
  if (blocks.length < 2) {
    return { avg: 28, min: 28, max: 28 };
  }
  
  const lengths: number[] = [];
  for (let i = 1; i < blocks.length; i++) {
    lengths.push(differenceInCalendarDays(blocks[i][0], blocks[i - 1][0]));
  }
  
  const relevantLengths = lengths.slice(-n);
  const sum = relevantLengths.reduce((acc, val) => acc + val, 0);
  const avg = Math.round(sum / relevantLengths.length);
  const min = Math.min(...relevantLengths);
  const max = Math.max(...relevantLengths);
  
  return { avg, min: min || 28, max: max || 28 };
};

/**
 * Calculates the moving average of cycle lengths (deprecated, use getCycleStats).
 */
export const calculateMovingAverage = (dates: Date[], n: number = 6): number => {
  return getCycleStats(dates, n).avg;
};
