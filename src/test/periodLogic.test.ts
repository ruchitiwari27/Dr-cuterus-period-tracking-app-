import { describe, it, expect } from "vitest";
import { getCyclePhaseForDate } from "../lib/periodUtils";

describe("Period Tracking Algorithm (Ogino-Knaus)", () => {
  const lastPeriodStart = new Date(2026, 3, 1); // April 1, 2026
  const cycleStats = { avg: 28, min: 28, max: 28 };

  it("should calculate correct phases for a standard 28-day cycle", () => {
    const testCases = [
      { dayOffset: 1, expectedPhase: "menstrual" },
      { dayOffset: 5, expectedPhase: "menstrual" },
      { dayOffset: 6, expectedPhase: "not-fertile" },
      { dayOffset: 8, expectedPhase: "may-fertile" }, // min(28)-18 = 10; 10-2 = 8
      { dayOffset: 10, expectedPhase: "fertile" },
      { dayOffset: 14, expectedPhase: "fertile" },
      { dayOffset: 17, expectedPhase: "fertile" }, // max(28)-11 = 17
      { dayOffset: 18, expectedPhase: "not-fertile" },
      { dayOffset: 28, expectedPhase: "not-fertile" },
    ];

    testCases.forEach(({ dayOffset, expectedPhase }) => {
      const testDate = new Date(lastPeriodStart);
      testDate.setDate(lastPeriodStart.getDate() + dayOffset - 1);
      
      const result = getCyclePhaseForDate(testDate, lastPeriodStart, cycleStats);
      
      expect(result.phase).toBe(expectedPhase);
      expect(result.cycleDay).toBe(dayOffset);
    });
  });
});
