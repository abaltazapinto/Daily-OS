import type { PlanningContext } from "../../domain/planning-context/planning-context";

export type DailyPlanningInput = {
  context: string;
  planningContext: PlanningContext;
};
