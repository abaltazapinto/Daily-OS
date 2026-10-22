import type { PlanningContext } from "./planning-context";

export const planningContextExample = {
  timeZone: "Europe/Lisbon",
  recurringCommitments: [
    {
      title: "ISEP",
      daysOfWeek: ["monday", "tuesday", "wednesday", "thursday"],
      startTime: "18:10",
      endTime: "19:00",
      location: "ISEP",
    },
  ],
  routines: [
    {
      title: "GYM",
      daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      durationMinutes: 60,
      preferredStartTime: "12:00",
    },
  ],
  travelTimes: [
    {
      from: "Home",
      to: "ISEP",
      mode: "bike",
      durationMinutes: 30,
    },
    {
      from: "ISEP",
      to: "Home",
      mode: "bike",
      durationMinutes: 20,
    },
  ],
  preferences: {
    preferredFocusDurationMinutes: 50,
    breakDurationMinutes: 10,
    defaultTransitionBufferMinutes: 10,
  },
} satisfies PlanningContext;
