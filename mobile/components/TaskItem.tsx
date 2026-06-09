import { Pressable, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, spacing } from "@/constants/theme";
import type { TaskStatus, TaskPriority } from "@dialed/shared";

interface TaskItemProps {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  onPress?: () => void;
  onToggle?: () => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: colors.textMuted,
  medium: colors.warning,
  high: colors.danger,
};

export function TaskItem({
  title,
  status,
  priority,
  onPress,
  onToggle,
}: TaskItemProps) {
  const done = status === "done";

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Pressable onPress={onToggle} hitSlop={8}>
        <Ionicons
          name={done ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={done ? colors.success : colors.textMuted}
        />
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
        {status === "review" && (
          <Text style={styles.badge}>Review</Text>
        )}
      </View>
      <View style={[styles.dot, { backgroundColor: priorityColors[priority] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  content: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: fontSize.md },
  titleDone: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  badge: {
    fontSize: fontSize.sm,
    color: colors.accent,
    fontWeight: "600",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
