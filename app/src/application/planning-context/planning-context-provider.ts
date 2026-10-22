import type { PlanningContext } from "../../domain/planning-context/planning-context";

export interface PlanningContextProvider {
  // Returns an empty context when no context has been saved.
  load(): Promise<PlanningContext>;
  // Replaces the entire saved context. Failures reject the promise.
  save(context: PlanningContext): Promise<void>;
}
