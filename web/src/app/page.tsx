import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <span className={styles.logo}>Dialed</span>
        <div className={styles.navLinks}>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up" className={styles.ctaSmall}>
            Get started
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1>Stay dialed in on what matters</h1>
        <p>
          Tasks, focus sessions, habits, and your wheel of life — one
          productivity app for mobile and web.
        </p>
        <div className={styles.heroActions}>
          <Link href="/sign-up" className={styles.cta}>
            Start free
          </Link>
          <Link href="/sign-in" className={styles.secondary}>
            Sign in
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>Today</h3>
          <p>Daily dash — to-do and review at a glance.</p>
        </div>
        <div className={styles.feature}>
          <h3>Focus</h3>
          <p>Deep work sessions with timer and history.</p>
        </div>
        <div className={styles.feature}>
          <h3>Wheel</h3>
          <p>Customizable wheel of life analytics.</p>
        </div>
        <div className={styles.feature}>
          <h3>Plans</h3>
          <p>Goals and intentions connected to your tasks.</p>
        </div>
      </section>
    </main>
  );
}
