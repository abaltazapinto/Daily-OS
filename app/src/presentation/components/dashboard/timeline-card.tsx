import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";

export function TimelineCard() {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        TODAY
      </ThemedText>

      <View style={styles.list}>
        <ThemedText>09:00 – 10:30 Daily OS</ThemedText>
        <ThemedText>11:00 – 12:00 LeetCode</ThemedText>
        <ThemedText>15:00 – 16:30 Engineering Lab</ThemedText>
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
