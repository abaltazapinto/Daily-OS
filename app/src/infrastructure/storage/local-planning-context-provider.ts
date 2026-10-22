import AsyncStorage from "@react-native-async-storage/async-storage";

import { createEmptyPlanningContext } from "../../application/planning-context/create-empty-planning-context";
import type { PlanningContextProvider } from "../../application/planning-context/planning-context-provider";
import type { PlanningContext } from "../../domain/planning-context/planning-context";
import { planningContextSchema } from "./planning-context-schema";

const storageKey = "daily-os:planning-context:v1";

type ContextStorage = Pick<typeof AsyncStorage, "getItem" | "setItem">;

export class LocalPlanningContextProvider implements PlanningContextProvider {
  constructor(private readonly storage: ContextStorage = AsyncStorage) {}

  async load(): Promise<PlanningContext> {
    const stored = await this.storage.getItem(storageKey);
    if (stored === null) {
      return createEmptyPlanningContext(
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      );
    }

    // Invalid data is surfaced without deleting or overwriting the saved value.
    return planningContextSchema.parse(JSON.parse(stored));
  }

  async save(context: PlanningContext): Promise<void> {
    const validated = planningContextSchema.parse(context);
    await this.storage.setItem(storageKey, JSON.stringify(validated));
  }
}
