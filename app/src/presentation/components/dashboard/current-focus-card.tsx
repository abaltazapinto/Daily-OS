import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";
import type { DailyPlan } from "@/domain/planning/daily-plan";

type CurrentFocusCardProps = {
  focus?: DailyPlan["currentFocus"];
};

export function CurrentFocusCard({
  focus = { title: "Complete one LeetCode problem", durationMinutes: 60 },
}: CurrentFocusCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        CURRENT FOCUS
      </ThemedText>

      <ThemedText type="subtitle">{focus.title}</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        {focus.durationMinutes} minutes
      </ThemedText>
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
