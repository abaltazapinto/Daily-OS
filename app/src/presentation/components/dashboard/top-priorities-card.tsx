import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";
import type { DailyPlan } from "@/domain/planning/daily-plan";

type TopPrioritiesCardProps = {
  priorities?: DailyPlan["priorities"];
};

export function TopPrioritiesCard({ priorities }: TopPrioritiesCardProps) {
  const titles = priorities
    ? priorities.map((priority) => priority.title)
    : ["Daily OS", "LeetCode", "Engineering Lab"];

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        TOP PRIORITIES
      </ThemedText>

      <View style={styles.list}>
        {titles.map((title, index) => (
          <ThemedText key={index}>
            {index + 1}. {title}
          </ThemedText>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  list: {
    gap: Spacing.two,
  },
});
