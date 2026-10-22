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
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: planningContext.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  const planningDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const input: DailyPlanningInput = { context, planningDate, planningContext };
  return planner.plan(input);
}
