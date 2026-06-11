"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { greetingForHour } from "@dialed/shared";
import { config } from "@/lib/config";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const { isLoading: convexAuthLoading, isAuthenticated: convexAuthenticated } =
    useConvexAuth();
  const ensureUser = useMutation(api.users.ensure);

  const tasks = useQuery(api.tasks.today);
  const habits = useQuery(api.habits.list, { activeOnly: true });
  const sessions = useQuery(api.focusSessions.list, {
    status: "completed",
    limit: 3,
  });

  useEffect(() => {
    if (convexAuthenticated) {
      void ensureUser();
    }
  }, [convexAuthenticated, ensureUser]);

  const greeting = greetingForHour(new Date().getHours());

  if (!config.convexUrl) {
    return (
      <main className={styles.main}>
        <div className={styles.errorBox}>
          <h1>Missing Convex URL</h1>
          <p>
            Add <code>NEXT_PUBLIC_CONVEX_URL</code> to{" "}
            <code>web/.env.local</code> and restart the dev server.
          </p>
        </div>
      </main>
    );
  }

  if (!clerkLoaded || convexAuthLoading) {
    return (
      <main className={styles.main}>
        <p className={styles.loading}>Loading dashboard…</p>
      </main>
    );
  }

  if (!convexAuthenticated) {
    return (
      <main className={styles.main}>
        <div className={styles.errorBox}>
          <h1>Convex auth not connected</h1>
          <p>Clerk sign-in worked, but Convex cannot verify your session.</p>
          <ol className={styles.checklist}>
            <li>
              In Clerk → <strong>Configure → JWT Templates</strong>, create a
              template named exactly <code>convex</code> (use the Convex preset).
            </li>
            <li>
              Run:{" "}
              <code>
                npx convex env set CLERK_JWT_ISSUER_DOMAIN
                &quot;https://awaited-bee-41.clerk.accounts.dev&quot;
              </code>
            </li>
            <li>
              Run <code>npx convex dev --once</code>, then restart{" "}
              <code>npm run dev:web</code>.
            </li>
          </ol>
        </div>
      </main>
    );
  }

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
          {tasks === undefined ? (
            <p className={styles.loading}>Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <p className={styles.empty}>No open tasks</p>
          ) : (
            <ul className={styles.list}>
              {tasks.slice(0, 8).map((task) => (
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
          {habits === undefined ? (
            <p className={styles.loading}>Loading habits…</p>
          ) : habits.length === 0 ? (
            <p className={styles.empty}>No habits yet</p>
          ) : (
            <ul className={styles.list}>
              {habits.map((habit) => (
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
          {sessions === undefined ? (
            <p className={styles.loading}>Loading sessions…</p>
          ) : sessions.length === 0 ? (
            <p className={styles.empty}>No sessions yet</p>
          ) : (
            <ul className={styles.list}>
              {sessions.map((session) => (
                <li key={session._id}>
                  <span>
                    {session.actualMinutes ?? session.durationMinutes}m
                  </span>
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
