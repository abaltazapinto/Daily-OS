import { useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import type { DailyPlanner } from "@/application/planning/daily-planner";
import { planDay } from "@/application/planning/plan-day";
import type { PlanningContextProvider } from "@/application/planning-context/planning-context-provider";
import { LocalPlanningContextProvider } from "@/infrastructure/storage/local-planning-context-provider";
import type { DailyPlan } from "@/domain/planning/daily-plan";
import { HttpDailyPlanner } from "@/services/planning/http-daily-planner";
import { CurrentFocusCard } from "@/presentation/components/dashboard/current-focus-card";
import { DailyContextInputCard } from "@/presentation/components/dashboard/daily-context-input-card";
import { GreetingCard } from "@/presentation/components/dashboard/greeting-card";
import { PlanningWarningsCard } from "@/presentation/components/dashboard/planning-warnings-card";
import { TopPrioritiesCard } from "@/presentation/components/dashboard/top-priorities-card";
import { TimelineCard } from "@/presentation/components/dashboard/timeline-card";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
} from "@/presentation/theme/theme";

const timelineItems = [
  {
    id: "daily-os",
    startTime: "09:00",
    endTime: "10.30",
    title: "Daily OS",
  },
  {
    id: "leetcode",
    startTime: "10:30",
    title: "LeetCode",
  },
  {
    id: "engineering-lab",
    startTime: "15:00",
    endTime: "16:30",
    title: "Engineering Lab",
  },
];

type PlanningState =
  | { status: "idle" | "submitting" | "error"; plan?: DailyPlan }
  | { status: "success"; plan: DailyPlan };

const dailyPlanner: DailyPlanner = new HttpDailyPlanner();
const planningContextProvider: PlanningContextProvider =
  new LocalPlanningContextProvider();

export function DashboardScreen() {
  const [dailyContext, setDailyContext] = useState("");
  const [planning, setPlanning] = useState<PlanningState>({ status: "idle" });
  const submitting = useRef(false);

  async function handlePlanMyDay() {
    if (submitting.current || dailyContext.trim().length === 0) return;

    submitting.current = true;
    setPlanning((previous) => ({ status: "submitting", plan: previous.plan }));

    try {
      const plan = await planDay(
        dailyContext,
        planningContextProvider,
        dailyPlanner,
      );
      setPlanning({ status: "success", plan });
    } catch {
      setPlanning((previous) => ({ status: "error", plan: previous.plan }));
    } finally {
      submitting.current = false;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <GreetingCard />
          <DailyContextInputCard
            value={dailyContext}
            onChangeText={setDailyContext}
            onSubmit={handlePlanMyDay}
            isSubmitting={planning.status === "submitting"}
            feedback={
              planning.status === "error"
                ? "We couldn't plan your day. Please try again."
                : planning.status === "success"
                  ? "Your daily plan is ready."
                  : undefined
            }
          />
          <CurrentFocusCard focus={planning.plan?.currentFocus} />
          <TopPrioritiesCard priorities={planning.plan?.priorities} />
          <TimelineCard items={planning.plan?.timeline ?? timelineItems} />
          {planning.plan && (
            <PlanningWarningsCard warnings={planning.plan.warnings} />
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  content: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
