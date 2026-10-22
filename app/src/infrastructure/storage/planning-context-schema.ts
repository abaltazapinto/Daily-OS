import { z } from "zod/v4";

import type { PlanningContext } from "../../domain/planning-context/planning-context";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const durationSchema = z.number().positive();
const daysSchema = z.array(
  z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
);

export const planningContextSchema: z.ZodType<PlanningContext> = z.object({
  timeZone: z.string().refine((timeZone) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone });
      return true;
    } catch {
      return false;
    }
  }, "Invalid time zone"),
  recurringCommitments: z.array(
    z.object({
      title: z.string(),
      daysOfWeek: daysSchema,
      startTime: timeSchema,
      endTime: timeSchema,
      location: z.string().optional(),
    }),
  ),
  routines: z.array(
    z.object({
      title: z.string(),
      daysOfWeek: daysSchema,
      durationMinutes: durationSchema,
      preferredStartTime: timeSchema.optional(),
    }),
  ),
  travelTimes: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      mode: z.enum(["walk", "bike", "car", "public_transport"]),
      durationMinutes: durationSchema,
    }),
  ),
  preferences: z.object({
    preferredFocusDurationMinutes: durationSchema.optional(),
    breakDurationMinutes: z.number().nonnegative().optional(),
    defaultTransitionBufferMinutes: z.number().nonnegative().optional(),
  }),
});
