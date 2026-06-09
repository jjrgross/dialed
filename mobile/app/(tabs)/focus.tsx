import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FOCUS_DURATIONS, formatDuration } from "@dialed/shared";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors, fontSize, spacing } from "@/constants/theme";
import { trackEvent } from "@/lib/analytics";

export default function FocusScreen() {
  const focusDurationMinutes = useAppStore((s) => s.focusDurationMinutes);
  const setFocusDuration = useAppStore((s) => s.setFocusDuration);
  const activeSession = useQuery(api.focusSessions.active);
  const recentSessions = useQuery(api.focusSessions.list, {
    status: "completed",
    limit: 5,
  });
  const startSession = useMutation(api.focusSessions.start);
  const completeSession = useMutation(api.focusSessions.complete);
  const cancelSession = useMutation(api.focusSessions.cancel);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeSession.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const remainingSeconds = activeSession
    ? Math.max(0, activeSession.durationMinutes * 60 - elapsed)
    : focusDurationMinutes * 60;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const handleStart = async () => {
    await startSession({ durationMinutes: focusDurationMinutes });
    trackEvent("focus_session_started", { duration: focusDurationMinutes });
  };

  const handleComplete = async () => {
    if (!activeSession) return;
    await completeSession({
      id: activeSession._id,
      actualMinutes: Math.ceil(elapsed / 60),
    });
    trackEvent("focus_session_completed");
  };

  const handleCancel = async () => {
    if (!activeSession) return;
    await cancelSession({ id: activeSession._id });
    trackEvent("focus_session_cancelled");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.timerCard}>
        <Text style={styles.timerLabel}>
          {activeSession ? "Focus time" : "Ready to focus"}
        </Text>
        <Text style={styles.timer}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Text>

        {!activeSession && (
          <View style={styles.durations}>
            {FOCUS_DURATIONS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setFocusDuration(d)}
                style={[
                  styles.durationChip,
                  focusDurationMinutes === d && styles.durationChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.durationText,
                    focusDurationMinutes === d && styles.durationTextActive,
                  ]}
                >
                  {d}m
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          {activeSession ? (
            <>
              <Button title="Complete" onPress={handleComplete} />
              <Button
                title="Cancel"
                variant="ghost"
                onPress={handleCancel}
              />
            </>
          ) : (
            <Button title="Start Focus" onPress={handleStart} />
          )}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Recent sessions</Text>
      {(recentSessions ?? []).map((session) => (
        <View key={session._id} style={styles.sessionRow}>
          <Text style={styles.sessionDuration}>
            {formatDuration(session.actualMinutes ?? session.durationMinutes)}
          </Text>
          <Text style={styles.sessionDate}>
            {new Date(session.startedAt).toLocaleDateString()}
          </Text>
        </View>
      ))}
      {(recentSessions ?? []).length === 0 && (
        <Text style={styles.empty}>No sessions yet — start your first!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.md,
  },
  timerCard: { alignItems: "center", paddingVertical: spacing.xl },
  timerLabel: { color: colors.textMuted, fontSize: fontSize.md },
  timer: {
    fontSize: 64,
    fontWeight: "200",
    color: colors.text,
    fontVariant: ["tabular-nums"],
    marginVertical: spacing.lg,
  },
  durations: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  durationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
  },
  durationChipActive: { backgroundColor: colors.primary },
  durationText: { color: colors.textMuted },
  durationTextActive: { color: "#fff", fontWeight: "600" },
  actions: { gap: spacing.sm, width: "100%" },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sessionDuration: { color: colors.text, fontWeight: "500" },
  sessionDate: { color: colors.textMuted },
  empty: { color: colors.textMuted, fontStyle: "italic" },
});
