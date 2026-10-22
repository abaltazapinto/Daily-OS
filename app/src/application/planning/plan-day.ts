import type { PlanningContextProvider } from "../planning-context/planning-context-provider";
import type { DailyPlan } from "../../domain/planning/daily-plan";
import type { DailyPlanner } from "./daily-planner";
import type { DailyPlanningInput } from "./daily-planning-input";

export async function planDay(
  context: string,
  contextProvider: PlanningContextProvider,
  planner: DailyPlanner,
): Promise<DailyPlan> {
  const planningContext = await contextProvider.load();
  const input: DailyPlanningInput = { context, planningContext };
  return planner.plan(input);
}
