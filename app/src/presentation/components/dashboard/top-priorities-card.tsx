import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";

export function TopPrioritiesCard() {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        TOP PRIORITIES
      </ThemedText>

      <View style={styles.list}>
        <ThemedText>1. Daily OS</ThemedText>
        <ThemedText>2. LeetCode</ThemedText>
        <ThemedText>3. Engineering Lab</ThemedText>
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
