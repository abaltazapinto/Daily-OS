import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/presentation/theme/theme";

export type TimelineItem = {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
};

type TimelineCardProps = {
  items: TimelineItem[];
};

export function TimelineCard({ items }: TimelineCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        TODAY
      </ThemedText>

      <View style={styles.list}>
        {items.map((item) => (
          <ThemedText key={item.id}>
            {item.startTime} - {item.endTime} {item.title}
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
