import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { PlanningContext } from "@/domain/planning-context/planning-context";
import type { PlanningContextProvider } from "@/application/planning-context/planning-context-provider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
} from "@/presentation/theme/theme";
import { EditorButton } from "../planning-context/editor-controls";
import { PlanningContextForm } from "../planning-context/planning-context-form";
import {
  createPlanningContextDraft,
  planningContextFromDraft,
  type PlanningContextDraft,
} from "../planning-context/planning-context-draft";

export function PlanningContextScreen({
  provider,
}: {
  provider: PlanningContextProvider;
}) {
  const [draft, setDraft] = useState<PlanningContextDraft | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [dirty, setDirty] = useState(false);
  const savingRef = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void provider
      .load()
      .then((context) => {
        if (active) setDraft(createPlanningContextDraft(context));
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [provider, attempt]);

  function change(next: PlanningContextDraft) {
    if (savingRef.current) return;
    setDraft(next);
    setDirty(true);
    setFeedback("");
  }

  async function save() {
    if (!draft || savingRef.current) return;
    let context: PlanningContext;
    try {
      context = planningContextFromDraft(draft);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Check the entered values.",
      );
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setFeedback("");
    try {
      await provider.save(context);
      if (mounted.current) {
        setDraft(createPlanningContextDraft(context));
        setDirty(false);
        setFeedback("Planning context saved.");
      }
    } catch {
      if (mounted.current)
        setFeedback(
          "Could not save planning context. Your edits are still here; try again.",
        );
    } finally {
      savingRef.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <ThemedText type="subtitle" accessibilityRole="header">
            Planning context
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Save your regular commitments and preferences for future daily
            plans.
          </ThemedText>
          {!saving && (
            <Link
              href="/"
              replace
              accessibilityLabel={
                dirty
                  ? "Cancel and discard unsaved changes"
                  : "Back to dashboard"
              }
            >
              <ThemedText type="linkPrimary">
                {dirty
                  ? "Cancel · discard unsaved changes"
                  : "Back to dashboard"}
              </ThemedText>
            </Link>
          )}
          {loadError ? (
            <View style={styles.feedback}>
              <ThemedText accessibilityLiveRegion="polite">
                Could not load planning context. Your saved data has not been
                changed.
              </ThemedText>
              <EditorButton
                label="Retry loading"
                onPress={() => {
                  setLoadError(false);
                  setAttempt((value) => value + 1);
                }}
              />
            </View>
          ) : !draft ? (
            <ThemedText accessibilityLiveRegion="polite">
              Loading planning context…
            </ThemedText>
          ) : (
            <>
              <PlanningContextForm
                draft={draft}
                onChange={change}
                disabled={saving}
              />
              <ThemedView type="backgroundElement" style={styles.feedback}>
                <ThemedText type="small">
                  {dirty
                    ? "You have unsaved changes."
                    : "Changes are stored only when you save."}
                </ThemedText>
                <EditorButton
                  label={saving ? "Saving…" : "Save planning context"}
                  disabled={saving || !dirty}
                  onPress={save}
                />
                {!!feedback && (
                  <ThemedText accessibilityLiveRegion="polite">
                    {feedback}
                  </ThemedText>
                )}
              </ThemedView>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  safeArea: { flex: 1, width: "100%", maxWidth: MaxContentWidth },
  content: {
    gap: Spacing.three,
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  feedback: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
