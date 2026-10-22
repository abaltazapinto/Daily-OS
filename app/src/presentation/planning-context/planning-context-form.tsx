import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { TravelMode } from "@/domain/planning-context/planning-context";
import { Spacing } from "@/presentation/theme/theme";
import {
  DayPicker,
  EditorButton,
  EditorField,
  EditorSection,
} from "./editor-controls";
import type { PlanningContextDraft } from "./planning-context-draft";

type Props = {
  draft: PlanningContextDraft;
  onChange: (draft: PlanningContextDraft) => void;
  disabled: boolean;
};

export function PlanningContextForm({ draft, onChange, disabled }: Props) {
  function commitment(
    index: number,
    patch: Partial<PlanningContextDraft["recurringCommitments"][number]>,
  ) {
    onChange({
      ...draft,
      recurringCommitments: draft.recurringCommitments.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });
  }
  function routine(
    index: number,
    patch: Partial<PlanningContextDraft["routines"][number]>,
  ) {
    onChange({
      ...draft,
      routines: draft.routines.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });
  }
  function travel(
    index: number,
    patch: Partial<PlanningContextDraft["travelTimes"][number]>,
  ) {
    onChange({
      ...draft,
      travelTimes: draft.travelTimes.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });
  }
  const modes: { value: TravelMode; label: string }[] = [
    { value: "walk", label: "Walk" },
    { value: "bike", label: "Bike" },
    { value: "car", label: "Car" },
    { value: "public_transport", label: "Public transport" },
  ];
  return (
    <>
      <EditorSection title="Time zone">
        <EditorField
          label="Time zone"
          value={draft.timeZone}
          onChange={(timeZone) => onChange({ ...draft, timeZone })}
          disabled={disabled}
          placeholder="Europe/Lisbon"
        />
        <ThemedText type="small" themeColor="textSecondary">
          All times use this time zone. Enter times as HH:mm.
        </ThemedText>
      </EditorSection>
      <EditorSection title="Recurring commitments">
        {!draft.recurringCommitments.length && (
          <ThemedText type="small">No recurring commitments.</ThemedText>
        )}
        {draft.recurringCommitments.map((item, index) => {
          const label = `Commitment ${index + 1}`;
          return (
            <View key={index} style={styles.item}>
              <ThemedText type="smallBold">{label}</ThemedText>
              <EditorField
                label={`${label} title`}
                value={item.title}
                onChange={(title) => commitment(index, { title })}
                disabled={disabled}
              />
              <DayPicker
                label={label}
                value={item.daysOfWeek}
                onChange={(daysOfWeek) => commitment(index, { daysOfWeek })}
                disabled={disabled}
              />
              <EditorField
                label={`${label} start time`}
                value={item.startTime}
                onChange={(startTime) => commitment(index, { startTime })}
                disabled={disabled}
                placeholder="09:00"
              />
              <EditorField
                label={`${label} end time`}
                value={item.endTime}
                onChange={(endTime) => commitment(index, { endTime })}
                disabled={disabled}
                placeholder="10:00"
              />
              <EditorField
                label={`${label} location (optional)`}
                value={item.location}
                onChange={(location) => commitment(index, { location })}
                disabled={disabled}
              />
              <EditorButton
                label={`Remove ${label.toLowerCase()}`}
                onPress={() =>
                  onChange({
                    ...draft,
                    recurringCommitments: draft.recurringCommitments.filter(
                      (_, i) => i !== index,
                    ),
                  })
                }
                disabled={disabled}
              />
            </View>
          );
        })}
        <EditorButton
          label="Add commitment"
          disabled={disabled}
          onPress={() =>
            onChange({
              ...draft,
              recurringCommitments: [
                ...draft.recurringCommitments,
                {
                  title: "",
                  daysOfWeek: [],
                  startTime: "",
                  endTime: "",
                  location: "",
                },
              ],
            })
          }
        />
      </EditorSection>
      <EditorSection title="Routines">
        {!draft.routines.length && (
          <ThemedText type="small">No routines.</ThemedText>
        )}
        {draft.routines.map((item, index) => {
          const label = `Routine ${index + 1}`;
          return (
            <View key={index} style={styles.item}>
              <ThemedText type="smallBold">{label}</ThemedText>
              <EditorField
                label={`${label} title`}
                value={item.title}
                onChange={(title) => routine(index, { title })}
                disabled={disabled}
              />
              <DayPicker
                label={label}
                value={item.daysOfWeek}
                onChange={(daysOfWeek) => routine(index, { daysOfWeek })}
                disabled={disabled}
              />
              <EditorField
                label={`${label} duration (minutes)`}
                value={item.durationMinutes}
                onChange={(durationMinutes) =>
                  routine(index, { durationMinutes })
                }
                disabled={disabled}
                numeric
              />
              <EditorField
                label={`${label} preferred start (optional)`}
                value={item.preferredStartTime}
                onChange={(preferredStartTime) =>
                  routine(index, { preferredStartTime })
                }
                disabled={disabled}
                placeholder="HH:mm"
              />
              <EditorButton
                label={`Remove ${label.toLowerCase()}`}
                disabled={disabled}
                onPress={() =>
                  onChange({
                    ...draft,
                    routines: draft.routines.filter((_, i) => i !== index),
                  })
                }
              />
            </View>
          );
        })}
        <EditorButton
          label="Add routine"
          disabled={disabled}
          onPress={() =>
            onChange({
              ...draft,
              routines: [
                ...draft.routines,
                {
                  title: "",
                  daysOfWeek: [],
                  durationMinutes: "",
                  preferredStartTime: "",
                },
              ],
            })
          }
        />
      </EditorSection>
      <EditorSection title="Directional travel times">
        <ThemedText type="small" themeColor="textSecondary">
          Each entry applies in one direction. Add a separate entry for the
          return trip.
        </ThemedText>
        {!draft.travelTimes.length && (
          <ThemedText type="small">No travel times.</ThemedText>
        )}
        {draft.travelTimes.map((item, index) => {
          const label = `Travel time ${index + 1}`;
          return (
            <View key={index} style={styles.item}>
              <ThemedText type="smallBold">{label}</ThemedText>
              <EditorField
                label={`${label} from`}
                value={item.from}
                onChange={(from) => travel(index, { from })}
                disabled={disabled}
              />
              <EditorField
                label={`${label} to`}
                value={item.to}
                onChange={(to) => travel(index, { to })}
                disabled={disabled}
              />
              <ThemedText type="small">
                Mode: {modes.find((mode) => mode.value === item.mode)?.label}
              </ThemedText>
              <View style={styles.modes}>
                {modes.map((mode) => (
                  <EditorButton
                    key={mode.value}
                    label={`${item.mode === mode.value ? "✓ " : ""}${mode.label}`}
                    disabled={disabled}
                    onPress={() => travel(index, { mode: mode.value })}
                  />
                ))}
              </View>
              <EditorField
                label={`${label} duration (minutes)`}
                value={item.durationMinutes}
                onChange={(durationMinutes) =>
                  travel(index, { durationMinutes })
                }
                disabled={disabled}
                numeric
              />
              <EditorButton
                label={`Remove ${label.toLowerCase()}`}
                disabled={disabled}
                onPress={() =>
                  onChange({
                    ...draft,
                    travelTimes: draft.travelTimes.filter(
                      (_, i) => i !== index,
                    ),
                  })
                }
              />
            </View>
          );
        })}
        <EditorButton
          label="Add travel time"
          disabled={disabled}
          onPress={() =>
            onChange({
              ...draft,
              travelTimes: [
                ...draft.travelTimes,
                { from: "", to: "", mode: "walk", durationMinutes: "" },
              ],
            })
          }
        />
      </EditorSection>
      <EditorSection title="Planning preferences">
        <ThemedText type="small" themeColor="textSecondary">
          Leave a field blank for no preference. Breaks and buffers may be zero.
        </ThemedText>
        {(
          [
            [
              "preferredFocusDurationMinutes",
              "Preferred focus duration (minutes)",
            ],
            ["breakDurationMinutes", "Break duration (minutes)"],
            ["defaultTransitionBufferMinutes", "Transition buffer (minutes)"],
          ] as const
        ).map(([key, label]) => (
          <EditorField
            key={key}
            label={label}
            value={draft.preferences[key]}
            onChange={(value) =>
              onChange({
                ...draft,
                preferences: { ...draft.preferences, [key]: value },
              })
            }
            disabled={disabled}
            numeric
          />
        ))}
      </EditorSection>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#888888",
  },
  modes: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
