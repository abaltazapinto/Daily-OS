import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { DailyPlan } from "@/domain/planning/daily-plan";
import { Spacing } from "@/presentation/theme/theme";

type PlanningWarningsCardProps = {
  warnings: DailyPlan["warnings"];
};

export function PlanningWarningsCard({ warnings }: PlanningWarningsCardProps) {
  if (warnings.length === 0) return null;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        PLANNING WARNINGS
      </ThemedText>
      {warnings.map((warning, index) => (
        <ThemedText key={index} type="small">
          {warning.message}
        </ThemedText>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
});
