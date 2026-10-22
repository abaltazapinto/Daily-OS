import type { PlanningContext } from "../../domain/planning-context/planning-context";

export function createEmptyPlanningContext(timeZone: string): PlanningContext {
  return {
    timeZone,
    recurringCommitments: [],
    routines: [],
    travelTimes: [],
    preferences: {},
  };
}
