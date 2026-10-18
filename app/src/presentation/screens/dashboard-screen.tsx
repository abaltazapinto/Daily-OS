import { useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import type { DailyPlanner } from "@/application/planning/daily-planner";
import type { DailyPlanningInput } from "@/application/planning/daily-planning-input";
import type { DailyPlan } from "@/domain/planning/daily-plan";
import { HttpDailyPlanner } from "@/services/planning/http-daily-planner";
import { CurrentFocusCard } from "@/presentation/components/dashboard/current-focus-card";
import { DailyContextInputCard } from "@/presentation/components/dashboard/daily-context-input-card";
import { GreetingCard } from "@/presentation/components/dashboard/greeting-card";
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
  | { status: "idle" | "submitting" | "error" }
  | { status: "success"; plan: DailyPlan };

const dailyPlanner: DailyPlanner = new HttpDailyPlanner();

export function DashboardScreen() {
  const [dailyContext, setDailyContext] = useState("");
  const [planning, setPlanning] = useState<PlanningState>({ status: "idle" });
  const submitting = useRef(false);

  async function handlePlanMyDay() {
    if (submitting.current || dailyContext.trim().length === 0) return;

    const input: DailyPlanningInput = { context: dailyContext };
    submitting.current = true;
    setPlanning({ status: "submitting" });

    try {
      const plan = await dailyPlanner.plan(input);
      setPlanning({ status: "success", plan });
    } catch {
      setPlanning({ status: "error" });
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
          <CurrentFocusCard />
          <TopPrioritiesCard />
          <TimelineCard items={timelineItems} />
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
