import type { PlanningContext } from "./planning-context";

// Static contract example, independent of providers and storage.
export const planningContextExample = {
  timeZone: "Europe/Lisbon",
  recurringCommitments: [
    {
      title: "Language class",
      daysOfWeek: ["tuesday", "thursday"],
      startTime: "18:00",
      endTime: "19:00",
      location: "Learning centre",
    },
  ],
  routines: [
    {
      title: "Reading",
      daysOfWeek: ["monday", "wednesday", "friday"],
      durationMinutes: 20,
      preferredStartTime: "08:00",
    },
  ],
  travelTimes: [{ from: "Home", to: "Learning centre", durationMinutes: 15 }],
  preferences: {
    preferredFocusDurationMinutes: 50,
    breakDurationMinutes: 10,
  },
} satisfies PlanningContext;
