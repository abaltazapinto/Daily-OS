export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// Times are local HH:mm values in PlanningContext.timeZone.
// A window whose end is earlier than its start ends on the following day.
export type RecurringCommitment = {
  title: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  location?: string;
};

// Routines recur on the listed days but do not reserve a fixed time window.
export type Routine = {
  title: string;
  daysOfWeek: DayOfWeek[];
  durationMinutes: number;
  preferredStartTime?: string;
};

// Locations are plain labels; each estimate applies only in this direction.
export type TravelTime = {
  from: string;
  to: string;
  durationMinutes: number;
};

export type PlanningPreferences = {
  preferredFocusDurationMinutes?: number;
  breakDurationMinutes?: number;
};

// A type contract only: callers are responsible for validating external data.
// Durations are positive minutes; breakDurationMinutes may also be zero.
export type PlanningContext = {
  // IANA time zone, for example "Europe/Lisbon".
  timeZone: string;
  recurringCommitments: RecurringCommitment[];
  routines: Routine[];
  travelTimes: TravelTime[];
  preferences: PlanningPreferences;
};
