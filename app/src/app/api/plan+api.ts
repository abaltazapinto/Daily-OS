import { OpenAIDailyPlanner } from "@/services/planning/openai-daily-planner";
import { dailyPlanningInputSchema } from "@/services/planning/daily-planning-input-schema";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const input = dailyPlanningInputSchema.safeParse(body);

  if (!input.success) {
    return Response.json(
      {
        error:
          "Non-empty context text and a valid planningContext are required.",
      },
      { status: 400 },
    );
  }

  try {
    const planner = new OpenAIDailyPlanner();
    const plan = await planner.plan(input.data);

    return Response.json(plan);
  } catch {
    return Response.json(
      { error: "Planning service is unavailable." },
      { status: 503 },
    );
  }
}
