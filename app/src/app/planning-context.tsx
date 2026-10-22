import type { PlanningContextProvider } from "@/application/planning-context/planning-context-provider";
import { LocalPlanningContextProvider } from "@/infrastructure/storage/local-planning-context-provider";
import { PlanningContextScreen } from "@/presentation/screens/planning-context-screen";

const provider: PlanningContextProvider = new LocalPlanningContextProvider();

export default function PlanningContextPage() {
  return <PlanningContextScreen provider={provider} />;
}
