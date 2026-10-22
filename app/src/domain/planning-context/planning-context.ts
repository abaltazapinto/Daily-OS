export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type RecurringCommitment = {
  title: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  location?: string;
};

export type Routine = {
  title: string;
  daysOfWeek: DayOfWeek[];
  durationMinutes: number;
  preferredStartTime?: string;
};

export type TravelMode = "walk" | "bike" | "car" | "public_transport";

export type TravelTime = {
  from: string;
  to: string;
  mode: TravelMode;
  durationMinutes: number;
};

export type PlanningPreferences = {
  preferredFocusDurationMinutes?: number;
  breakDurationMinutes?: number;
  defaultTransitionBufferMinutes?: number;
};

export type PlanningContext = {
  timeZone: string;
  recurringCommitments: RecurringCommitment[];
  routines: Routine[];
  travelTimes: TravelTime[];
  preferences: PlanningPreferences;
};
