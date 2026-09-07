import type { DailyPlan } from "../../domain/planning/daily-plan";
import type { DailyPlanningInput } from "./daily-planning-input";

// Static contract example, independent of a planning service or UI.
export const dailyPlanningInputExample = {
  context:
    "It is 09:00. I have physiotherapy from 11:00 to 12:00 and must stop at noon. " +
    "I want to work on Daily OS for 60 minutes, solve a LeetCode problem for " +
    "30 minutes, and study engineering for 90 minutes. Leave a 30-minute " +
    "break before physiotherapy; postpone engineering if it will not fit.",
} satisfies DailyPlanningInput;

export const dailyPlanExample = {
  currentFocus: {
    title: "Work on Daily OS",
    durationMinutes: 60,
  },
  priorities: [
    { title: "Work on Daily OS", durationMinutes: 60 },
    { title: "Solve a LeetCode problem", durationMinutes: 30 },
  ],
  timeline: [
    { startTime: "09:00", endTime: "10:00", title: "Work on Daily OS" },
    { startTime: "10:00", endTime: "10:30", title: "Solve a LeetCode problem" },
    { startTime: "10:30", endTime: "11:00", title: "Break" },
    { startTime: "11:00", endTime: "12:00", title: "Physiotherapy" },
  ],
  warnings: [
    {
      message:
        "Engineering study is postponed because it does not fit before noon " +
        "while preserving your break and physiotherapy appointment.",
    },
  ],
} satisfies DailyPlan;
