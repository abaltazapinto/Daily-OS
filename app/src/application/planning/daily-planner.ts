import type { DailyPlanningInput } from "./daily-planning-input";
import type { DailyPlan } from "../../domain/planning/daily-plan";

export interface DailyPlanner {
  plan(input: DailyPlanningInput): Promise<DailyPlan>;
}
