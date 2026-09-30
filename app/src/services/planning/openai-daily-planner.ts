import OpenAI from "openai";

import type { DailyPlanner } from "@/application/planning/daily-planner";
import type { DailyPlanningInput } from "@/application/planning/daily-planning-input";
import type { DailyPlan } from "@/domain/planning/daily-plan";

import { zodTextFormat } from "openai/helpers/zod";
import { dailyPlanSchema } from "./daily-plan-schema";
import { DAILY_OS_PLANNER_INSTRUCTIONS } from "./daily-os-planner-instructions";

export class OpenAIDailyPlanner implements DailyPlanner {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  async plan(input: DailyPlanningInput): Promise<DailyPlan> {
    const response = await this.client.responses.parse({
      model: "gpt-5.6-luna",
      instructions: DAILY_OS_PLANNER_INSTRUCTIONS,
      input: input.context,
      text: {
        format: zodTextFormat(dailyPlanSchema, "daily_plan"),
      },
    });

    if (!response.output_parsed) {
      throw new Error("OpenAI returned no valid DailyPlan.");
    }

    return response.output_parsed;
  }
}
