import { fetch } from "expo/fetch";

import type { DailyPlanner } from "@/application/planning/daily-planner";
import type { DailyPlanningInput } from "@/application/planning/daily-planning-input";
import type { DailyPlan } from "@/domain/planning/daily-plan";
import { dailyPlanSchema } from "./daily-plan-schema";

export class HttpDailyPlanner implements DailyPlanner {
  async plan(input: DailyPlanningInput): Promise<DailyPlan> {
    const response = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Planning request failed.");
    }

    return dailyPlanSchema.parse(await response.json());
  }
}
