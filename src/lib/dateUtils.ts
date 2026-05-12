import { format } from "date-fns";

/**
 * Formats a date to YYYY-MM-DD in local time.
 * This avoids the common bug where .toISOString().split('T')[0] 
 * returns the wrong day due to timezone shifts.
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  if (!date || isNaN(date.getTime())) return "";
  return format(date, "yyyy-MM-dd");
};

/**
 * Parses a YYYY-MM-DD string into a local Date object.
 */
export const parseYYYYMMDD = (dateStr: string): Date => {
  return new Date(dateStr + "T00:00:00");
};
