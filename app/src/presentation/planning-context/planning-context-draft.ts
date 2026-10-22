import type {
  DayOfWeek,
  PlanningContext,
  PlanningPreferences,
  RecurringCommitment,
  Routine,
  TravelTime,
} from "../../domain/planning-context/planning-context";

export type PlanningContextDraft = {
  timeZone: string;
  recurringCommitments: (RecurringCommitment & { location: string })[];
  routines: (Omit<Routine, "durationMinutes" | "preferredStartTime"> & {
    durationMinutes: string;
    preferredStartTime: string;
  })[];
  travelTimes: (Omit<TravelTime, "durationMinutes"> & {
    durationMinutes: string;
  })[];
  preferences: { [K in keyof PlanningPreferences]-?: string };
};

export function createPlanningContextDraft(
  context: PlanningContext,
): PlanningContextDraft {
  return {
    timeZone: context.timeZone,
    recurringCommitments: context.recurringCommitments.map((item) => ({
      ...item,
      daysOfWeek: [...item.daysOfWeek],
      location: item.location ?? "",
    })),
    routines: context.routines.map((item) => ({
      ...item,
      daysOfWeek: [...item.daysOfWeek],
      durationMinutes: String(item.durationMinutes),
      preferredStartTime: item.preferredStartTime ?? "",
    })),
    travelTimes: context.travelTimes.map((item) => ({
      ...item,
      durationMinutes: String(item.durationMinutes),
    })),
    preferences: {
      preferredFocusDurationMinutes:
        context.preferences.preferredFocusDurationMinutes?.toString() ?? "",
      breakDurationMinutes:
        context.preferences.breakDurationMinutes?.toString() ?? "",
      defaultTransitionBufferMinutes:
        context.preferences.defaultTransitionBufferMinutes?.toString() ?? "",
    },
  };
}

function required(value: string, label: string): string {
  if (!value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function time(value: string, label: string): string {
  const result = value.trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(result)) {
    throw new Error(`${label}: use HH:mm, for example 09:00.`);
  }
  return result;
}

function minutes(value: string, label: string, allowZero = false): number {
  const result = Number(value);
  if (
    !value.trim() ||
    !Number.isFinite(result) ||
    (allowZero ? result < 0 : result <= 0)
  ) {
    throw new Error(
      `${label}: enter ${allowZero ? "zero or a positive number" : "a positive number"} of minutes.`,
    );
  }
  return result;
}

function days(value: DayOfWeek[], label: string): DayOfWeek[] {
  if (!value.length) throw new Error(`${label}: select at least one day.`);
  return [...value];
}

export function planningContextFromDraft(
  draft: PlanningContextDraft,
): PlanningContext {
  const timeZone = required(draft.timeZone, "Time zone");
  try {
    new Intl.DateTimeFormat("en", { timeZone });
  } catch {
    throw new Error(
      "Time zone: enter a valid name, for example Europe/Lisbon.",
    );
  }
  const preferences: PlanningPreferences = {};
  const preferenceFields = [
    ["preferredFocusDurationMinutes", "Preferred focus duration", false],
    ["breakDurationMinutes", "Break duration", true],
    ["defaultTransitionBufferMinutes", "Transition buffer", true],
  ] as const;
  for (const [key, label, allowZero] of preferenceFields) {
    if (draft.preferences[key].trim()) {
      preferences[key] = minutes(draft.preferences[key], label, allowZero);
    }
  }
  return {
    timeZone,
    recurringCommitments: draft.recurringCommitments.map((item, index) => {
      const label = `Commitment ${index + 1}`;
      return {
        title: required(item.title, `${label} title`),
        daysOfWeek: days(item.daysOfWeek, label),
        startTime: time(item.startTime, `${label} start time`),
        endTime: time(item.endTime, `${label} end time`),
        ...(item.location.trim() ? { location: item.location.trim() } : {}),
      };
    }),
    routines: draft.routines.map((item, index) => {
      const label = `Routine ${index + 1}`;
      return {
        title: required(item.title, `${label} title`),
        daysOfWeek: days(item.daysOfWeek, label),
        durationMinutes: minutes(item.durationMinutes, `${label} duration`),
        ...(item.preferredStartTime.trim()
          ? {
              preferredStartTime: time(
                item.preferredStartTime,
                `${label} preferred start`,
              ),
            }
          : {}),
      };
    }),
    travelTimes: draft.travelTimes.map((item, index) => {
      const label = `Travel time ${index + 1}`;
      return {
        from: required(item.from, `${label} from`),
        to: required(item.to, `${label} to`),
        mode: item.mode,
        durationMinutes: minutes(item.durationMinutes, `${label} duration`),
      };
    }),
    preferences,
  };
}
