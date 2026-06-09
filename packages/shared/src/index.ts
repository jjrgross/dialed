export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type FocusSessionStatus = "active" | "completed" | "cancelled";
export type HabitFrequency = "daily" | "weekly" | "custom";

export interface WheelOfLifeArea {
  area: string;
  score: number;
  color?: string;
}

export const DEFAULT_WHEEL_AREAS: WheelOfLifeArea[] = [
  { area: "Health", score: 5, color: "#22c55e" },
  { area: "Career", score: 5, color: "#3b82f6" },
  { area: "Finance", score: 5, color: "#eab308" },
  { area: "Relationships", score: 5, color: "#ec4899" },
  { area: "Growth", score: 5, color: "#8b5cf6" },
  { area: "Fun", score: 5, color: "#f97316" },
  { area: "Environment", score: 5, color: "#14b8a6" },
  { area: "Purpose", score: 5, color: "#6366f1" },
];

export const FOCUS_DURATIONS = [15, 25, 45, 60] as const;

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
