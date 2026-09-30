import { z } from "zod/v4";

import type { DailyPlan } from "@/domain/planning/daily-plan";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const dailyPlanSchema: z.ZodType<DailyPlan> = z.object({
  currentFocus: z.object({
    title: z.string(),
    durationMinutes: z.number().int().positive(),
  }),

  priorities: z.array(
    z.object({
      title: z.string(),
      durationMinutes: z.number().int().positive(),
    }),
  ),

  timeline: z.array(
    z.object({
      startTime: timeSchema,
      endTime: timeSchema,
      title: z.string(),
    }),
  ),

  warnings: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});
