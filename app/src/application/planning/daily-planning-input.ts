import type { PlanningContext } from "../../domain/planning-context/planning-context";

export type DailyPlanningInput = {
  context: string;
  // Calendar date (YYYY-MM-DD) in planningContext.timeZone.
  planningDate: string;
  planningContext: PlanningContext;
};
