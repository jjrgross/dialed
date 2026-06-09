import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "../../../convex/_generated/api";
import { DEFAULT_WHEEL_AREAS } from "@dialed/shared";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors, fontSize, spacing } from "@/constants/theme";

const SECTIONS = [
  { key: "self" as const, label: "Self", icon: "👤" },
  { key: "wheel" as const, label: "Wheel", icon: "🎯" },
  { key: "log" as const, label: "Log", icon: "📓" },
  { key: "plans" as const, label: "Plans", icon: "🗺️" },
];

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const convexUser = useQuery(api.users.current);
  const profileSection = useAppStore((s) => s.profileSection);
  const setProfileSection = useAppStore((s) => s.setProfileSection);

  const wheelAreas = convexUser?.wheelOfLife ?? DEFAULT_WHEEL_AREAS;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress[0] ?? "?").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>
          {user?.fullName ?? user?.firstName ?? "User"}
        </Text>
        <Text style={styles.email}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      <View style={styles.sectionNav}>
        {SECTIONS.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => setProfileSection(s.key)}
            style={[
              styles.sectionChip,
              profileSection === s.key && styles.sectionChipActive,
            ]}
          >
            <Text style={styles.sectionIcon}>{s.icon}</Text>
            <Text
              style={[
                styles.sectionLabel,
                profileSection === s.key && styles.sectionLabelActive,
              ]}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {profileSection === "self" && (
        <Card>
          <Text style={styles.cardTitle}>About you</Text>
          <Text style={styles.cardBody}>
            Track habits, reflect on progress, and stay dialed in on what
            matters most.
          </Text>
        </Card>
      )}

      {profileSection === "wheel" && (
        <Card>
          <Text style={styles.cardTitle}>Wheel of Life</Text>
          <Text style={styles.cardSubtitle}>Analytics & balance</Text>
          {wheelAreas.map((area) => (
            <View key={area.area} style={styles.wheelRow}>
              <Text style={styles.wheelArea}>{area.area}</Text>
              <View style={styles.wheelBar}>
                <View
                  style={[
                    styles.wheelFill,
                    {
                      width: `${(area.score / 10) * 100}%`,
                      backgroundColor: area.color ?? colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.wheelScore}>{area.score}/10</Text>
            </View>
          ))}
        </Card>
      )}

      {profileSection === "log" && (
        <Card>
          <Text style={styles.cardTitle}>Activity Log</Text>
          <Text style={styles.cardBody}>
            Your focus sessions, completed tasks, and habit streaks appear
            here as you use Dialed.
          </Text>
        </Card>
      )}

      {profileSection === "plans" && (
        <Card>
          <Text style={styles.cardTitle}>Plans & Goals</Text>
          <Text style={styles.cardBody}>
            Set quarterly goals, weekly intentions, and connect tasks to
            bigger outcomes.
          </Text>
        </Card>
      )}

      <Button title="Sign Out" variant="secondary" onPress={() => signOut()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  header: { alignItems: "center", paddingVertical: spacing.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#fff" },
  name: { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  email: { color: colors.textMuted, marginTop: 4 },
  sectionNav: { flexDirection: "row", gap: spacing.sm },
  sectionChip: {
    flex: 1,
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  sectionIcon: { fontSize: 20 },
  sectionLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionLabelActive: { color: colors.primaryLight, fontWeight: "600" },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardSubtitle: { color: colors.textMuted, marginBottom: spacing.md },
  cardBody: { color: colors.textMuted, lineHeight: 22 },
  wheelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  wheelArea: { width: 100, color: colors.text, fontSize: fontSize.sm },
  wheelBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  wheelFill: { height: "100%", borderRadius: 4 },
  wheelScore: { width: 36, color: colors.textMuted, fontSize: fontSize.sm },
});
