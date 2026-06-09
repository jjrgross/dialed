import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { TaskStatus } from "@dialed/shared";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/Button";
import { colors, fontSize, spacing } from "@/constants/theme";

const FILTERS: Array<{ label: string; value: TaskStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" },
];

export default function TasksScreen() {
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [newTask, setNewTask] = useState("");
  const tasks = useQuery(
    api.tasks.list,
    filter === "all" ? {} : { status: filter },
  );
  const allTasks = useQuery(api.tasks.list, {});
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);

  const displayTasks =
    filter === "all" ? allTasks : tasks;

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await createTask({ title: newTask.trim() });
    setNewTask("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={[styles.chip, filter === f.value && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                filter === f.value && styles.chipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="New task..."
          placeholderTextColor={colors.textMuted}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAdd}
        />
        <Button title="Add" onPress={handleAdd} />
      </View>

      <FlatList
        data={displayTasks ?? []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet</Text>
        }
        renderItem={({ item }) => (
          <TaskItem
            title={item.title}
            status={item.status}
            priority={item.priority}
            onToggle={() =>
              updateTask({
                id: item._id,
                status: item.status === "done" ? "todo" : "done",
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    padding: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { color: colors.textMuted, fontSize: fontSize.sm },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  addRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.sm,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: { padding: spacing.md, gap: spacing.sm },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
