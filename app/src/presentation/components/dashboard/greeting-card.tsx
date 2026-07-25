import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";

export function GreetingCard() {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="title">Good morning, André.</ThemedText>
      <ThemedText>Here&apos;s your day.</ThemedText>
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
