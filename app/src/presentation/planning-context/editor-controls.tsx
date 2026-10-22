import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type { PropsWithChildren } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Fonts, Spacing } from "@/presentation/theme/theme";
import type { DayOfWeek } from "@/domain/planning-context/planning-context";

export function EditorButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed
            ? theme.backgroundSelected
            : theme.background,
        },
        disabled && { opacity: 0.5 },
      ]}
    >
      <ThemedText type="smallBold">{label}</ThemedText>
    </Pressable>
  );
}

export function EditorField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  numeric = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  numeric?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText type="small">{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        inputMode={numeric ? "decimal" : "text"}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.background },
        ]}
      />
    </View>
  );
}

const weekdays: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
export function DayPicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: DayOfWeek[];
  onChange: (value: DayOfWeek[]) => void;
  disabled: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText type="small">Days</ThemedText>
      <View style={styles.days}>
        {weekdays.map((day) => {
          const selected = value.includes(day);
          return (
            <Pressable
              key={day}
              accessibilityRole="checkbox"
              accessibilityLabel={`${label} ${day}`}
              accessibilityState={{ checked: selected, disabled }}
              disabled={disabled}
              onPress={() =>
                onChange(
                  selected
                    ? value.filter((item) => item !== day)
                    : [...value, day],
                )
              }
              style={[
                styles.button,
                {
                  backgroundColor: selected
                    ? theme.backgroundSelected
                    : theme.background,
                  borderColor: selected ? theme.text : theme.background,
                  borderWidth: 1,
                },
              ]}
            >
              <ThemedText type="smallBold">{day.slice(0, 3)}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function EditorSection({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <ThemedView type="backgroundElement" style={styles.section}>
      <ThemedText type="smallBold" accessibilityRole="header">
        {title}
      </ThemedText>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  field: { gap: Spacing.two },
  days: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  button: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: "center",
  },
  input: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    fontFamily: Fonts.sans,
    fontSize: 16,
    minHeight: 48,
  },
});
