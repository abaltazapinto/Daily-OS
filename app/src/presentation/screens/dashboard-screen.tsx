import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CurrentFocusCard } from "@/presentation/components/dashboard/current-focus-card";

import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
} from "@/presentation/theme/theme";
import { GreetingCard } from "@/presentation/components/dashboard/greeting-card";

export function DashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <GreetingCard />
        <CurrentFocusCard />
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
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.two,
  },
});
