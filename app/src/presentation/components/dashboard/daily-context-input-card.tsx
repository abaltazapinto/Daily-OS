import { Pressable, StyleSheet, TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Fonts, Spacing } from "@/presentation/theme/theme";

type DailyContextInputCardProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
};

export function DailyContextInputCard({
  value,
  onChangeText,
  onSubmit,
}: DailyContextInputCardProps) {
  const theme = useTheme();
  const isEmpty = value.trim().length === 0;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        DAILY CONTEXT
      </ThemedText>
      <TextInput
        accessibilityLabel="Daily context"
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder="What do you need to do today? Include goals, commitments, and limits."
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.background },
        ]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isEmpty }}
        disabled={isEmpty}
        onPress={() => {
          if (!isEmpty) onSubmit();
        }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? theme.backgroundSelected
              : theme.background,
          },
          isEmpty && styles.disabled,
        ]}
      >
        <ThemedText type="smallBold">Plan my day</ThemedText>
      </Pressable>
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
  input: {
    minHeight: Spacing.six * 2,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
  },
  button: {
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  disabled: {
    opacity: 0.5,
  },
});
