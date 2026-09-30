import { OpenAIDailyPlanner } from "@/services/planning/openai-daily-planner";
import type { DailyPlanningInput } from "@/application/planning/daily-planning-input";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isDailyPlanningInput(body)) {
    return Response.json(
      { error: "A non-empty planning context is required." },
      { status: 400 },
    );
  }

  try {
    const planner = new OpenAIDailyPlanner();
    const plan = await planner.plan(body);

    return Response.json(plan);
  } catch {
    return Response.json(
      { error: "Planning service is unavailable." },
      { status: 503 },
    );
  }
}

function isDailyPlanningInput(value: unknown): value is DailyPlanningInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const input = value as Record<string, unknown>;

  return typeof input.context === "string" && input.context.trim().length > 0;
}
