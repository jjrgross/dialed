import { SignIn } from "@clerk/nextjs";
import styles from "../../auth.module.css";

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
