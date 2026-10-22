import { z } from "zod/v4";

import type { DailyPlanningInput } from "../../application/planning/daily-planning-input";
import { planningContextSchema } from "../../infrastructure/planning-context-schema";

export const dailyPlanningInputSchema: z.ZodType<DailyPlanningInput> = z.object(
  {
    context: z.string().refine((text) => text.trim().length > 0),
    planningDate: z.iso.date(),
    planningContext: planningContextSchema,
  },
);
