"use client";

import { useQuery } from "convex/react";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { greetingForHour } from "@dialed/shared";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { user } = useUser();
  const tasks = useQuery(api.tasks.today);
  const habits = useQuery(api.habits.list, { activeOnly: true });
  const sessions = useQuery(api.focusSessions.list, {
    status: "completed",
    limit: 3,
  });

  const greeting = greetingForHour(new Date().getHours());

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1>
            {greeting}, {user?.firstName ?? "there"}
          </h1>
          <p>Your web dashboard</p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Today&apos;s tasks</h2>
          {(tasks ?? []).length === 0 ? (
            <p className={styles.empty}>No open tasks</p>
          ) : (
            <ul className={styles.list}>
              {(tasks ?? []).slice(0, 8).map((task) => (
                <li key={task._id}>
                  <span
                    className={
                      task.status === "done" ? styles.done : undefined
                    }
                  >
                    {task.title}
                  </span>
                  <span className={styles.badge}>{task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2>Active habits</h2>
          {(habits ?? []).length === 0 ? (
            <p className={styles.empty}>No habits yet</p>
          ) : (
            <ul className={styles.list}>
              {(habits ?? []).map((habit) => (
                <li key={habit._id}>
                  <span>{habit.title}</span>
                  <span className={styles.streak}>🔥 {habit.streak}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2>Recent focus</h2>
          {(sessions ?? []).length === 0 ? (
            <p className={styles.empty}>No sessions yet</p>
          ) : (
            <ul className={styles.list}>
              {(sessions ?? []).map((session) => (
                <li key={session._id}>
                  <span>{session.actualMinutes ?? session.durationMinutes}m</span>
                  <span className={styles.muted}>
                    {new Date(session.startedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
