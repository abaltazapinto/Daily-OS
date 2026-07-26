import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";

export function CurrentFocusCard() {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        CURRENT FOCUS
      </ThemedText>

      <ThemedText type="subtitle">Complete one LeetCode problem</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        60 minutes
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
