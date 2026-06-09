import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { greetingForHour } from "@dialed/shared";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TaskItem } from "@/components/TaskItem";
import { colors, fontSize, spacing } from "@/constants/theme";

export default function TodayScreen() {
  const { user } = useUser();
  const tasks = useQuery(api.tasks.today);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const [newTask, setNewTask] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const greeting = greetingForHour(new Date().getHours());
  const reviewTasks = tasks?.filter((t) => t.status === "review") ?? [];
  const todoTasks = tasks?.filter((t) => t.status !== "review") ?? [];

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await createTask({ title: newTask.trim() });
    setNewTask("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 500);
          }}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.greeting}>
        {greeting}, {user?.firstName ?? "there"}
      </Text>
      <Text style={styles.subtitle}>Your daily dash</Text>

      <Card style={styles.addCard}>
        <Text style={styles.sectionTitle}>Quick add</Text>
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="What needs doing?"
            placeholderTextColor={colors.textMuted}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={handleAdd}
          />
          <Button title="Add" onPress={handleAdd} style={styles.addButton} />
        </View>
      </Card>

      {reviewTasks.length > 0 && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Review</Text>
          {reviewTasks.map((task) => (
            <TaskItem
              key={task._id}
              title={task.title}
              status={task.status}
              priority={task.priority}
              onToggle={() =>
                updateTask({ id: task._id, status: "done" })
              }
            />
          ))}
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>To do</Text>
        {todoTasks.length === 0 ? (
          <Text style={styles.empty}>All clear — time to focus!</Text>
        ) : (
          todoTasks.map((task) => (
            <TaskItem
              key={task._id}
              title={task.title}
              status={task.status}
              priority={task.priority}
              onToggle={() =>
                updateTask({
                  id: task._id,
                  status: task.status === "done" ? "todo" : "done",
                })
              }
            />
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: { color: colors.textMuted, marginBottom: spacing.sm },
  section: { gap: spacing.sm },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addCard: { gap: spacing.sm },
  addRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
  },
  addButton: { paddingHorizontal: spacing.md },
  empty: { color: colors.textMuted, fontStyle: "italic" },
});
